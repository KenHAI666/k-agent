import express from 'express'
import { Client } from '@notionhq/client'
import Anthropic from '@anthropic-ai/sdk'
import cron from 'node-cron'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── 設定 ──────────────────────────────────────────────
const NOTION_TOKEN    = process.env.NOTION_TOKEN    || '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'
const THREADS_TOKEN   = process.env.THREADS_TOKEN   || 'THAAVwcNLxi6ZABUVFvVml6TnlfNklFWUZA3OHN5WXZAYMElrbHplNWVqY25Bc1RmZAFpmQWZAVVGQzTXp3cFhmUmxuXzlabG1OVHpqeUs5Nmt4ODhMYTZASUk9MYi1UN1RCdDRxdjlVdzAtQWVFSERCcWZA2UlhFcFVMMTRQMURkSDJmYllVdwZDZD'
const THREADS_USER_ID = process.env.THREADS_USER_ID || '25279980738260900'
const ANTHROPIC_KEY   = process.env.ANTHROPIC_API_KEY || ''
const DB_ID = 'cb3bacc7-4254-414c-9610-f2dde41352e1'

const notion    = new Client({ auth: NOTION_TOKEN })
const anthropic = ANTHROPIC_KEY ? new Anthropic({ apiKey: ANTHROPIC_KEY }) : null
const app       = express()
app.use(express.json())
app.use(express.static(join(__dirname, 'public')))

// ── 載入參考文件 ──────────────────────────────────────

function loadRef(filename) {
  try { return readFileSync(join(ROOT, filename), 'utf8') } catch { return '' }
}

// ── Notion 工具 ───────────────────────────────────────

const getText   = (p, k) => p.properties[k]?.title?.map(t => t.plain_text).join('') || p.properties[k]?.rich_text?.map(t => t.plain_text).join('') || ''
const getSelect = (p, k) => p.properties[k]?.select?.name ?? ''
const getNumber = (p, k) => p.properties[k]?.number ?? null
const getDate   = (p, k) => p.properties[k]?.date?.start ?? null

function pageToPost(page) {
  return {
    id:       page.id,
    title:    getText(page, '標題'),
    content:  getText(page, '內容'),
    day:      getNumber(page, '天數'),
    seq:      getNumber(page, '貼文序號'),
    status:   getSelect(page, '狀態'),
    postTime: getDate(page, '發文時間'),
    type:     getSelect(page, '類型'),
    topic:    getText(page, '主題方向'),
  }
}

// ── API：取得某天的貼文 ────────────────────────────────

app.get('/api/posts/:day', async (req, res) => {
  const day = parseInt(req.params.day)
  try {
    const resp = await notion.databases.query({
      database_id: DB_ID,
      filter: { property: '天數', number: { equals: day } },
      sorts: [{ property: '貼文序號', direction: 'ascending' }],
    })
    res.json({ day, posts: resp.results.map(pageToPost) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── API：更新貼文 ─────────────────────────────────────

app.patch('/api/posts/:id', async (req, res) => {
  const { content, postTime, status, title, type, topic } = req.body
  const props = {}
  if (title    !== undefined) props['標題']    = { title: [{ text: { content: title } }] }
  if (content  !== undefined) props['內容']    = { rich_text: [{ text: { content } }] }
  if (status   !== undefined) props['狀態']    = { select: { name: status } }
  if (type     !== undefined) props['類型']    = { select: { name: type } }
  if (topic    !== undefined) props['主題方向'] = { rich_text: [{ text: { content: topic } }] }
  if (postTime !== undefined) props['發文時間'] = postTime ? { date: { start: postTime } } : { date: null }
  try {
    await notion.pages.update({ page_id: req.params.id, properties: props })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── API：立刻發文 ─────────────────────────────────────

app.post('/api/publish/:id', async (req, res) => {
  try {
    const page = await notion.pages.retrieve({ page_id: req.params.id })
    const post = pageToPost(page)
    const threadId = await publishToThreads(post)
    res.json({ ok: true, threadId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── API：手動觸發 AI 生文 ──────────────────────────────

app.post('/api/generate/:day', async (req, res) => {
  const day = parseInt(req.params.day)
  try {
    const posts = await generateDayPosts(day)
    res.json({ ok: true, count: posts.length, posts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Threads 發文 ──────────────────────────────────────

async function publishToThreads(post) {
  const base   = `https://graph.threads.net/v1.0/${THREADS_USER_ID}`
  const params = new URLSearchParams({ media_type: 'TEXT', text: post.content, access_token: THREADS_TOKEN })

  const cr = await fetch(`${base}/threads?${params}`, { method: 'POST' })
  const created = await cr.json()
  if (!created.id) throw new Error(`建立失敗: ${JSON.stringify(created)}`)

  await new Promise(r => setTimeout(r, 5000))

  const pr = await fetch(`${base}/threads_publish?${new URLSearchParams({ creation_id: created.id, access_token: THREADS_TOKEN })}`, { method: 'POST' })
  const published = await pr.json()
  if (!published.id) throw new Error(`發布失敗: ${JSON.stringify(published)}`)

  await notion.pages.update({ page_id: post.id, properties: { '狀態': { select: { name: '已發' } } } })
  console.log(`[發文成功] ${post.title} → ${published.id}`)
  return published.id
}

// ── AI 生文 ───────────────────────────────────────────

async function generateDayPosts(day) {
  if (!anthropic) throw new Error('未設定 ANTHROPIC_API_KEY')

  const agents   = loadRef('AGENTS.md')
  const soul     = loadRef('SOUL.md')
  const rules    = loadRef('RULES.md')
  const identity = loadRef('IDENTITY.md')
  const history  = loadRef('THREADS_21DAY_V1.md')

  // 依天數判斷所在週次與階段
  const week  = Math.ceil(day / 7)
  const phase = week === 1 ? '被看見（人設 60% / 觀點 40%）'
              : week === 2 ? '建立信任（人設 40% / 價值 40% / 商品 20%）'
              :              '成交（人設 20% / 價值 20% / 銷售 60%）'

  const systemPrompt = `你是 AI_K叔，一個斜槓自媒體企劃 Agent。
你要為 K叔的 Threads 帳號產出每日5篇貼文草稿。

## K叔品牌與語氣規則
${soul}
${identity}

## 變現策略框架
${agents}

## 行為規則
${rules}

## 歷史貼文語氣參考（請對照維持一致）
${history.slice(0, 3000)}

## 規則
- 句子短，口語，不說「您」
- 不堆砌形容詞，不像 AI 說話
- 關鍵詞維持：海巡 / 以終為始 / 信任漏斗 / 看見→信任→變現 / 脆友
- 結尾必須是：我是K叔\\n一個斜槓的自媒體企劃（或「你的自媒體企劃」）
- 每篇 150-300 字`

  const userPrompt = `現在是第 ${day} 天（第 ${week} 週）。
當前階段：${phase}

請依照 AGENTS.md 的「3-2-1 黃金比例」與「內容節奏四種組合拳」，
配合當前階段的內容比例，產出今天的 5 篇 Threads 草稿。

每篇請用以下 JSON 格式輸出（整體是陣列）：
[
  {
    "seq": 1,
    "title": "貼文標題（簡短描述）",
    "type": "個人定位 或 知識 或 銷售",
    "topic": "主題方向（一句話說明這篇在漏斗哪個位置、要達成什麼）",
    "content": "完整貼文正文"
  }
]

只輸出 JSON，不要加其他文字。`

  const resp = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  let raw = resp.content[0].text.trim()
  if (raw.startsWith('```')) raw = raw.replace(/```json\n?|```/g, '').trim()
  const drafts = JSON.parse(raw)

  // 預設發文時間（台北時間 08:00 / 12:00 / 15:30 / 18:30 / 21:00）
  const times = ['T00:00:00+00:00', 'T04:00:00+00:00', 'T07:30:00+00:00', 'T10:30:00+00:00', 'T13:00:00+00:00']
  const today = new Date().toISOString().slice(0, 10)

  const created = []
  for (let i = 0; i < drafts.length; i++) {
    const d = drafts[i]
    const page = await notion.pages.create({
      parent: { database_id: DB_ID },
      properties: {
        '標題':    { title: [{ text: { content: d.title || `DAY-${day} 貼文${i + 1}` } }] },
        '內容':    { rich_text: [{ text: { content: d.content } }] },
        '天數':    { number: day },
        '貼文序號': { number: d.seq || i + 1 },
        '狀態':    { select: { name: '草稿' } },
        '類型':    { select: { name: d.type || '知識' } },
        '主題方向': { rich_text: [{ text: { content: d.topic || '' } }] },
        '發文時間': { date: { start: today + times[i] } },
      },
    })
    created.push(pageToPost(page))
  }

  console.log(`[AI 生文] DAY-${day} 完成，共 ${created.length} 篇`)
  return created
}

// ── 排程：每天 06:00 台北時間自動生文 ───────────────────

cron.schedule('0 22 * * *', async () => {
  const now = new Date()
  const day = Math.ceil((now - new Date('2026-03-09')) / (1000 * 60 * 60 * 24))
  console.log(`[06:00 觸發] 開始生成 DAY-${day} 文案...`)
  generateDayPosts(day).catch(err => console.error('[AI 生文失敗]', err.message))
}, { timezone: 'Asia/Taipei' })

// ── 排程：每分鐘掃「待發」貼文，到時間就發 ──────────────

cron.schedule('* * * * *', async () => {
  const now    = new Date()
  const tenAgo = new Date(now - 10 * 60 * 1000).toISOString()
  try {
    const resp = await notion.databases.query({
      database_id: DB_ID,
      filter: {
        and: [
          { property: '狀態',    select: { equals: '待發' } },
          { property: '發文時間', date: { on_or_before: now.toISOString() } },
          { property: '發文時間', date: { after: tenAgo } },
        ],
      },
    })
    for (const page of resp.results) {
      const post = pageToPost(page)
      await notion.pages.update({ page_id: page.id, properties: { '狀態': { select: { name: '排程中' } } } })
      publishToThreads(post).catch(err => console.error(`[發文失敗] ${post.title}:`, err.message))
    }
  } catch (err) {
    console.error('[排程掃描錯誤]', err.message)
  }
})

// ── 啟動 ──────────────────────────────────────────────

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`\n🚀 AI_K叔 發文台：http://localhost:${PORT}`)
  console.log(`   每天 06:00 自動生成新文案`)
  console.log(`   排程發文每分鐘掃描中\n`)
})
