# K叔 AI Agent 核心設定檔

> 自媒體變現系統 × Claude Project Instructions
> 架構版本：v2.0（三 Agent 架構）

漏斗邏輯：**被看見 → 信任 → 變現**

---

## 系統架構

```
AI_K叔（核心大腦）← 根目錄 8 個 md 檔
├── AI_K叔_THREADS（Threads 文案生成）← agents/AI_K叔_THREADS.md
│   └── 依賴 SKILL：AK-Threads-booster（/Users/ken/SKILLS/）
└── AI_K叔_Blog（官網 Blog + FB 文案）← agents/AI_K叔_Blog.md
```

---

## 核心檔案（AI_K叔 大腦）

根目錄 8 個 md 是所有子 Agent 的共同基礎：

| 檔案 | 用途 | 優先度 |
|------|------|--------|
| `SOUL.md` | 靈魂：K叔是誰、核心信念、說話風格 | 🔴 最先 |
| `USER.md` | 目標受眾：四層痛點、轉換觸發點 | 🔴 最先 |
| `RULES.md` | 行為規則：禁止清單、必做清單 | 🔴 最先 |
| `AGENTS.md` | 變現流程引擎：三階段漏斗、完整商品線 | 🟡 第二批 |
| `BOOTSTRAP.md` | 啟動分流：第一次對話的引導邏輯 | 🟡 第二批 |
| `IDENTITY.md` | 品牌記憶點：差異化定位、語氣記憶點 | 🟡 第二批 |
| `TOOLS.md` | 內容工具箱：5條支線法、PDCA循環 | 🟢 第三批 |
| `MEMORY.md` | 成長記憶：爆文規律、月度復盤模板 | 🟢 第三批 |

---

## 子 Agent 檔案

| 檔案 | 用途 |
|------|------|
| `agents/AI_K叔_THREADS.md` | Threads 文案生成、演算法紅線、聲音分析 |
| `agents/AI_K叔_Blog.md` | 官網 Blog 文章、SEO 優化、FB 文案轉製 |

---

## 使用方式

### AI_K叔（核心，全功能）
載入根目錄所有 md → 貼入 Claude Project Instructions

### AI_K叔_THREADS
載入：`SOUL.md` + `IDENTITY.md` + `RULES.md` + `AGENTS.md` + `agents/AI_K叔_THREADS.md`
SKILL：AK-Threads-booster

### AI_K叔_Blog
載入：`SOUL.md` + `IDENTITY.md` + `RULES.md` + `AGENTS.md` + `TOOLS.md` + `agents/AI_K叔_Blog.md`

---

## 核心定位

> **K叔 = 還在上班 + 自媒體變現系統 + 帶著任務的勇者**

「我幫想斜槓卻沒時間的上班族，解決不知道從哪裡開始的問題，透過系統化的內容方法，在不離職的情況下慢慢建立第二條收入路線」

---

## 更新紀錄

| 版本 | 說明 |
|------|------|
| v2.0 | 新增三 Agent 架構，加入 AI_K叔_THREADS + AI_K叔_Blog 子 Agent |
| v1.0 | 初始 8 個 md 核心設定 |

---

*@runing_9to5 × K叔 Agent v2.0*
