# SEO_RULES.md｜K叔 SEO + AI 搜尋核心規則
> 核心大腦補充檔案（與 Blog Agent 搭配使用）  
> 版本：v1.1

---

## 這個檔案解決什麼問題

SOUL / RULES / TOOLS 是為了社群平台設計的。  
這個檔案是讓 runing9to5.com 的內容被 **Google** 和 **AI 搜尋** 找到的專屬規則。

---

## 一、官網現況問題清單（2026-05 診斷）

| 問題 | 說明 | 優先度 |
|------|------|--------|
| URL 中文 slug | 所有文章 URL 含中文，encode 後成亂碼 | 🔴 P0 |
| 分類 taxonomy 混亂 | 6 個分類（自媒體、自我成長、個人成長等）語意重疊 | 🔴 P0 |
| 標題格式含 `[[分類]` | 吃掉 title tag 黃金前段，SEO 無效率 | 🔴 P0 |
| 缺 Article JSON-LD | 文章頁無結構化資料，AI 搜尋信任度低 | 🟡 P1 |
| 缺 FAQPage JSON-LD | 首頁有 FAQ 但無 schema，Google 不顯示 rich snippet | 🟡 P1 |
| 缺內部連結 | 文章之間幾乎無互連，PageRank 無法流動 | 🟡 P1 |
| Meta description 不穩定 | 部分文章 description 可能為空 | 🟡 P1 |

---

## 二、URL Slug 修正規則

### 問題
中文 slug 在瀏覽器 encode 後：
```
/自我成長/自媒體經營/2026/04/09/上班族的風險遠比創業者高.html
→ /%E8%87%AA%E6%88%91%E6%88%90%E9%95%B7/%E8%87%AA%E5%AA%92%E9%AB%94%E7%B6%93%E7%87%9F/2026/04/09/...
```
Google 抓取效率差、分享時變亂碼、AI 爬蟲識別困難。

### 解法
每篇文章在 Jekyll front matter 加入英文 `slug`：

```yaml
---
layout: post
title: "上班族的風險遠比創業者高｜一人公司的自由之道"
slug: employee-risk-vs-entrepreneur-freedom
permalink: /articles/:slug/
---
```

### 英文 Slug 命名規則

- 使用連字號 `-` 分隔，禁止底線 `_`
- 含 1-2 個目標關鍵字
- 不超過 5 個單字（URL 過長影響點擊率）

範例：
| 文章標題 | 建議 Slug |
|---------|----------|
| 上班族的風險遠比創業者高 | employee-risk-vs-entrepreneur |
| 自媒體不是先發文而是先賣東西 | content-monetization-first |
| 不露臉也能打造高信任變現系統 | faceless-content-trust-system |
| 零粉絲也能做自媒體 PDCA | zero-followers-content-pdca |

---

## 三、分類 Taxonomy 整併

### 問題
現有 6 個語意重疊的分類讓 Google 看到的是主題分散的小站。

### 解法：整併為 3 個核心分類

| 舊分類 | 整併到 |
|-------|-------|
| 自媒體、自媒體經營 | `content-strategy`（自媒體策略）|
| 自我成長、個人成長 | `personal-growth`（個人成長）|
| 創業與副業 | `side-hustle`（副業斜槓）|
| 自我管理 | 併入 `personal-growth` |

```yaml
# Jekyll front matter 範例
categories: [content-strategy]
tags: [自媒體入門, Threads經營, 內容策略]
```

---

## 四、E-E-A-T 強化規則（Google 信任信號）

E-E-A-T = Experience（經歷）/ Expertise（專業）/ Authoritativeness（權威）/ Trustworthiness（可信度）

### K叔的 E-E-A-T 弱點
- About 頁缺乏具體成果數字
- 文章缺乏作者 byline 強化
- 缺乏外部引用或背書

### 強化行動

**About 頁應包含：**
- 實際服務年數（「從 20XX 年開始幫助上班族...」）
- 具體數字（已服務 100+ 上班族 / Threads 1,500+ 貼文 / 電子報 XXX 訂閱）
- 第三方佐證（讀者回饋截圖、平台帳號連結）

**每篇文章 byline：**
```markdown
作者：[K叔](https://runing9to5.com/about)（自媒體變現系統顧問，上班族斜槓實踐者）
```

---

## 五、Jekyll _config.yml 建議設定

```yaml
# SEO 基本設定
title: "K叔｜低風險自媒體變現系統"
description: "幫助上班族與內向創作者，不離職也能打造自媒體第二收入。"
url: "https://runing9to5.com"
author: "K叔 (runing_9to5)"
lang: zh-TW

# Permalink 改為英文 slug
permalink: /articles/:slug/

# 建議安裝的 Jekyll plugins
plugins:
  - jekyll-seo-tag      # 自動生成 meta tags
  - jekyll-sitemap      # 自動生成 sitemap.xml
  - jekyll-feed         # 自動生成 RSS feed
```

---

## 六、30 天 SEO 修正優先序

### Week 1：修結構（影響所有文章）
```
□ _config.yml 加 permalink: /articles/:slug/
□ 所有文章 front matter 加英文 slug
□ _layouts/post.html 加 Article JSON-LD
□ index.md 加 FAQPage JSON-LD（10 個 FAQ 全部加入）
```

### Week 2：修 Meta（提升 CTR）
```
□ 每篇文章補或改寫 description（120-155 字）
□ 標題格式改掉 [[分類] 前綴
□ 圖片補 alt 屬性
```

### Week 3：修內容（提升排名）
```
□ 每篇文章加 1-2 個站內連結
□ 每篇文章加「K叔觀點」段落
□ 舊文章標題改成含關鍵字的格式
```

### Week 4：新內容（擴大叢集）
```
□ 確認三個 Topic Cluster 的 Pillar 文章是否存在
□ 從 Threads 高互動文挑選 3 篇擴展成 Blog
□ Pillar 文章互連所有 Cluster Posts
```

---

## 七、AI 搜尋（GEO）快速行動清單

讓 ChatGPT Search / Perplexity / Gemini 引用 K叔內容的最快行動：

```
□ 首頁 FAQPage JSON-LD（最快見效，AI 最愛 FAQ 格式）
□ 每篇文章加 Article JSON-LD（author 信號）
□ 每篇文章有「K叔觀點」段落（原創立場 > 通識轉述）
□ About 頁補強具體經歷數字（E-E-A-T）
□ 文章中有「K叔定義」段落（「我對 X 的定義是...」）
```

---

---

## 八、SEO Coach 外部工具整合

> 來源：[akseolabs-seo/seo-coach](https://github.com/akseolabs-seo/seo-coach)  
> 安裝：`git clone https://github.com/akseolabs-seo/seo-coach /Users/ken/SKILLS/seo-coach`

**SEO Coach 補充 B1-B12 的面向：**

| 本地 B1-B12 | SEO Coach 補充 |
|------------|---------------|
| 發布前快速掃描 | 系統性 18 模組深度審查 |
| 機械式紅線檢查 | 蘇格拉底問答→讓你理解問題根因 |
| 無 GSC 數據整合 | 接受 GSC / GA4 數據作為輸入 |
| 無技術層追蹤 | Core Web Vitals / robots.txt / canonical 深挖 |

**何時用 SEO Coach（vs 直接用 Blog Agent）：**
- 流量異常下滑 → 找根本原因 → `/seo-coach`
- 想系統學 SEO 而非只是「過關」→ `/seo-coach`
- 快速發文前確認 → Blog Agent B1-B12 即可

---

*SEO_RULES.md v1.1 | 新增 SEO Coach 整合說明；配合 agents/AI_K叔_Blog.md v1.3 使用*
