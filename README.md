# K叔 AI Agent 核心設定檔

> 自媒體變現系統 × Claude Project Instructions
> 架構版本：v2.1（三 Agent + SEO 架構）

漏斗邏輯：**被看見 → 信任 → 變現**

---

## 系統架構

```
AI_K叔（核心大腦）← 根目錄 9 個 md 檔
├── AI_K叔_THREADS（Threads 文案生成）← agents/AI_K叔_THREADS.md
│   └── SKILL：AK-Threads-booster ✅
└── AI_K叔_Blog（官網 Blog + FB 文案）← agents/AI_K叔_Blog.md
    ├── SKILL：AK-Threads-booster ✅
    └── 參考：SEO_RULES.md ✅
```

> **所有文章生成都依賴 AK-Threads-booster SKILL**
> 本機路徑：`/Users/ken/SKILLS/AK-Threads-booster`

---

## 核心檔案（AI_K叔 大腦）

根目錄 9 個 md 是所有子 Agent 的共同基礎：

| 檔案 | 用途 | 優先度 |
|------|------|--------|
| `SOUL.md` | 靈魂：K叔是誰、核心信念、說話風格、標語使用規範 | 🔴 最先 |
| `USER.md` | 目標受眾：四層痛點、轉換觸發點 | 🔴 最先 |
| `RULES.md` | 行為規則：禁止清單、必做清單、Blog 專屬規則 | 🔴 最先 |
| `AGENTS.md` | 變現流程引擎：三階段漏斗、完整商品線 | 🟡 第二批 |
| `BOOTSTRAP.md` | 啟動分流：A/B/C/D/E 五條路徑（含 SEO 路徑） | 🟡 第二批 |
| `IDENTITY.md` | 品牌記憶點：差異化定位、語氣記憶點 | 🟡 第二批 |
| `TOOLS.md` | 內容工具箱：5條支線法、PDCA循環 | 🟢 第三批 |
| `MEMORY.md` | 成長記憶：爆文規律、月度復盤、主題新鮮度追蹤 Protocol | 🟢 第三批 |
| `SEO_RULES.md` | 🆕 官網 SEO + AI 搜尋規則：URL修正、taxonomy、JSON-LD | 🟢 第三批（Blog 使用必讀）|

---

## 子 Agent 檔案

| 檔案 | 用途 | SKILL | 版本 |
|------|------|-------|------|
| `agents/AI_K叔_THREADS.md` | Threads 文案生成、演算法紅線、聲音分析 | AK-Threads-booster ✅ | v2.0 |
| `agents/AI_K叔_Blog.md` | 官網 Blog、SEO 優化、FB 文案、Topic Cluster、GEO | AK-Threads-booster ✅ | v1.2 |

---

## 載入清單

### AI_K叔（核心，全功能）

```
SOUL.md + USER.md + RULES.md + AGENTS.md + BOOTSTRAP.md + IDENTITY.md + TOOLS.md + MEMORY.md
```

### AI_K叔_THREADS

```
SOUL.md + IDENTITY.md + RULES.md + AGENTS.md
+ agents/AI_K叔_THREADS.md
+ SKILL: AK-Threads-booster
```

### AI_K叔_Blog

```
SOUL.md + IDENTITY.md + RULES.md + AGENTS.md + TOOLS.md + SEO_RULES.md
+ agents/AI_K叔_Blog.md
+ SKILL: AK-Threads-booster
```

---

## AK-Threads-booster SKILL 在所有 Agent 中的角色

```
Threads Agent → 演算法優化、互動預測、聲音分析

Blog Agent    → Hook 設計、AI腔偵測、結構健康檢查、分享動機分析
               注意：R1/R5(同主題限制)/R8 在 Blog 有不同解釋
               詳見 agents/AI_K叔_Blog.md「AK-Threads-booster 在 Blog 的適用說明」

共同邏輯：
  R1-R12 紅線  → 確保內容結構健康（Blog 部分規則調整解釋）
  AI腔偵測     → 確保 K叔聲音不被稀釋
  Hook 框架    → 所有文章第一句都要能讓人停下來
```

---

## v2.1 更新紀錄

| 版本 | 說明 |
|------|------|
| v2.1 | 新增 SEO_RULES.md；更新 SOUL/RULES/MEMORY/BOOTSTRAP/Blog Agent；修正 Threads vs Blog 邏輯分離 |
| v2.0 | 三 Agent 架構，所有 Agent 統一依賴 AK-Threads-booster SKILL |
| v1.0 | 初始 8 個 md 核心設定 |

---

## 核心定位

> **K叔 = 還在上班 + 自媒體變現系統 + 帶著任務的勇者**

「我幫想斜槓卻沒時間的上班族，解決不知道從哪裡開始的問題，透過系統化的內容方法，在不離職的情況下慢慢建立第二條收入路線」

---

*@runing_9to5 × K叔 Agent v2.1*
