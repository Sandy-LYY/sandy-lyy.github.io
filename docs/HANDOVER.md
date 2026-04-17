# 交接文档（个人主页项目）

> 面向：下一位接手本仓库的 AI 或人类开发者。  
> 撰写时间：2026-04-18（以对话上下文为准）。  
> 项目根目录：`/Users/wangzixuan/sandy-personal-site`（在 Cursor 中通常已作为 workspace root 打开）。

---

## 1. 任务背景与目标（我们到底在做什么）

- **原始诉求**：用户希望基于 GitHub 上的模板仓库 [Zhero-Hub/Zhero-s-website](https://github.com/Zhero-Hub/Zhero-s-website)（实为 **PRISM** 模板）搭建**求职 / 实习向**的个人主页，而不是偏学术发表的主页。
- **实际服务对象**：主页主体为用户的**女友**（对外展示名多用 **Sandy / 罗雅颖**），简历 PDF 曾由用户提供；GitHub 账号为 **`Sandy-LYY`**，用户站点域名倾向 **`https://sandy_yaying.github.io`**（与 GitHub Username 一致即可）。
- **核心产出**：
  1. 本地可运行的 Next.js 站点（`npm run dev`）。
  2. 静态导出 `out/`（`npm run build`），用于 GitHub Pages 部署。
  3. 中英文内容（`content/`、`content_zh/`）已按求职叙事调整；导航含 **About / Experience / Projects / CV**（中文对应「关于我 / 实习与经历 / 项目 / 简历」）。

---

## 2. 原计划（高层）与当前进度

### 2.1 原计划（摘要）

1. 获取模板 → 本地运行 → 改 `content*` → 配 `next.config` 静态导出 → GitHub Pages / Actions 发布。  
2. 将「论文 / 学术」叙事改为「实习 / 项目 / 数据驱动营销 / 市场研究」叙事。  
3. 按需微调 UI（头像、侧栏联系信息、兴趣关键词等）。

### 2.2 当前进度（截至交接）

| 阶段 | 状态 | 说明 |
|------|------|------|
| 模板落地与本地运行 | **基本完成** | 曾遇 `Node v23` + Turbopack 导致 `.next` 损坏；已将 `package.json` 的 `dev` 改为 `next dev`（去掉 `--turbopack`）。建议本机使用 **Node 22**（`.nvmrc` 为 `22`；用户环境用 Homebrew 装 `node@22` 更稳）。 |
| 内容改造（中英） | **大部分完成** | 实习、项目、CV、关于我、动态等已多轮修改；**请以仓库内文件为准**，下文列出关键路径。 |
| 静态构建 `npm run build` | **曾通过** | 交接前若又改过依赖/Node，请接手人再跑一次 `npm run build` 验证。 |
| GitHub Pages 实际上线 | **未在对话内闭环** | 需在 GitHub 创建 `sandy_yaying.github.io` 仓库（或选定仓库名），上传 `out/` 或启用 Actions。仓库内已有 `.github/workflows/deploy.yml` 及构建后 `touch out/.nojekyll` 步骤（若仍存在）。 |

---

## 3. 仓库与文档的物理位置及关系

```
sandy-personal-site/          ← Git 项目根（workspace root）
├── content/                  ← 默认语言（当前配置里 default_locale = "en"）
├── content_zh/               ← 中文覆盖层（与 content/ 同名文件对应）
├── public/                   ← 静态资源（头像、favicon、logos 等）
│   ├── avatar.png
│   ├── favicon.svg
│   └── logos/                ← 学校与公司 logo（由 Cursor assets 拷贝而来）
├── src/                      ← Next.js App Router + 组件
├── docs/
│   ├── deployment.md         ← 上游 PRISM 自带：GitHub Pages / Cloudflare 说明
│   └── HANDOVER.md           ← 本文件：给人/给 AI 的交接说明
├── next.config.ts            ← 静态导出等（勿随意改 basePath，除非改为「项目页」部署）
├── package.json
└── out/                      ← build 产物（可删；不要提交大体积时留意 .gitignore）
```

**关系说明**：

- **改文案几乎只动** `content/` 与 `content_zh/`，一般不需要改 `src/`。
- **改布局 / 交互** 才动 `src/components/...`（例如侧栏 `Profile.tsx`）。
- **`docs/deployment.md`** 是上游部署指南；**`docs/HANDOVER.md`** 是本对话沉淀的「项目特有」说明，两者互补。

---

## 4. 我们具体做过哪些改动（按模块）

### 4.1 站点信息与导航（TOML）

- **英文全局**：`content/config.toml`  
  - `author.name`、`title`（支持 **多行**：用换行符拆成两行展示，见 `Profile.tsx`）、`institution`、`social`（邮箱、地区、GitHub、LinkedIn）等。
- **中文全局**：`content_zh/config.toml`  
  - 与英文对齐；导航文案为中文。

**导航**（两语言均已配置）：`about`（首页）、`experience`、`projects`、`cv`。

### 4.2 首页结构（`content/about.toml` 与 `content_zh/about.toml`）

- `about` 页由多个 `[[sections]]` 组成：`markdown`（bio）、`cards`（实习亮点，引用 `experience.toml`，`limit = 3`）、`list`（动态 `news.toml`）。
- 根据用户后续反馈：**不应把「项目卡片整块搬到首页」**；若当前 `about.toml` 里仍有 `project_highlights` 区块，接手人应按用户最终意愿删除或保留（以用户最新消息为准）。

### 4.3 实习与经历页

- **英文**：`content/experience.toml`（`type = "card"`）  
- **中文**：`content_zh/experience.toml`  
- 已按「数据驱动 / 增长 / 市场洞察」方向改写多条 bullet。  
- `CardPage` 支持 `[[items]]` 可选字段 **`image`**（见 `src/types/page.ts` 的 `CardItem`），用于公司 logo。

### 4.4 项目页

- **英文**：`content/projects.toml`  
- **中文**：`content_zh/projects.toml`  
- 含 The Ordinary 文本挖掘、AI 营销 Agent 流程、KOL 评估框架等**叙述型项目**（接手人需与用户核实「是否全部属实/是否需匿名化数据规模」）。

### 4.5 简历页（Markdown）

- `content/cv.md`、`content_zh/cv.md`  
- 曾要求：将 **BNU-HKBU UIC** 等表述改为 **香港浸会大学 / HKBU**；删除「朋辈导师 & 招生宣传」整块；公司名去掉「广州」前缀等——**请以当前文件内容为准**，若仍有遗漏用全文搜索 `UIC`、`BNU`、`北京师范大学` 复查。

### 4.6 关于我正文（Markdown）

- `content/bio.md`、`content_zh/bio.md`  
- 用户曾提供「用某段中文自我介绍替换现有首段」的需求；若英文未同步，应补齐双语一致性。

### 4.7 动态（`news.toml` / `content_zh/news.toml`）

- 用户希望：**第一人称、偏口语、带少量 emoji**；内容应来自**真实简历要素提炼**（实习数据、升学、项目进展等），**不要**把整页项目卡片搬到动态里充当「动态」。
- **不要编造具体 offer / 公司录取**（除非用户书面确认）；可用「在推进几家面试 / 等结果」这类不指名的表述。

### 4.8 静态资源与品牌素材

- 用户提供的 logo 已复制到：  
  `public/logos/hkbu-wordmark.png`、`hkbu-seal.png`、`bristol.png`、`joyy.png`、`iblue.png`  
- 头像：`public/avatar.png`（由用户照片拷贝而来）。  
- `public/favicon.svg`：由 emoji 占位改为更贴近人设的图标（具体以文件为准）。

### 4.9 前端代码层面的重要改动

1. **`src/components/home/Profile.tsx`**（侧栏）  
   - 曾从「横向 icon + 悬浮气泡」改为更接近用户参考图的 **纵向信息列表**：地图/邮箱/GitHub/LinkedIn 等分行展示；邮箱展示 **真实 `@`**（不再 ` (at) ` 替换）。  
   - `author.title` 支持 `\n` 拆行（用于「方向一行 + 求职状态一行」）。  
   - `research_interests` 渲染为 **关键词 pill**（非长段落列表）。

2. **`src/app/page.tsx` + `src/components/home/HomePageClient.tsx`**  
   - 增加对 `sections` 中 **`type = "cards"`** 的处理链：服务端 `processSections` 读取对应 `source` 的 TOML，截取 `limit` 条，客户端用 `CardPage embedded` 渲染。  
   - 接手人若发现首页卡片不显示，优先检查这两处 `SectionConfig` 的 type 联合类型是否一致。

3. **`src/components/pages/CardPage.tsx`、`About.tsx`、`TextPage.tsx`**  
   - 为 Markdown 增加 `img` 映射到 `next/image`，便于在 `cv.md` 等处以 `![](/logos/...)` 插入 logo。

4. **`package.json`**  
   - `dev`：`next dev`（去掉 `--turbopack`），降低与本机 Node 版本组合时的 `.next` 损坏概率。

---

## 5. 已知问题与环境建议（接手人优先读）

1. **Node 版本**  
   - 用户终端曾显示 `v23.x`，而项目 `engines` / `.nvmrc` 指向 **>=22** 且 README 强调 22。  
   - 建议：Homebrew 安装并链接 `node@22`，在项目目录执行 `node -v` 确认后再 `rm -rf .next && npm install && npm run dev`。

2. **`.next` ENOENT / Internal Server Error**  
   - 典型修复：`Ctrl+C` 停 dev → `rm -rf .next` → 换 Node 22 → `npm run dev`。  
   - 若仍异常，再尝试删除 `node_modules` 重装（较重）。

3. **中英文内容一致性**  
   - 任何字段尽量 **双文件同步**（`content/` 与 `content_zh/`），避免 i18n 回退到英文时出现旧文案。

4. **事实准确性**  
   - 项目页中的方法名词（Sentence Transformer、BERTopic、样本量等）需与用户确认，避免求职材料夸大。

---

## 6. 建议的接手后验收清单（15 分钟）

```bash
cd /Users/wangzixuan/sandy-personal-site
node -v    # 期望 v22.x
npm install
rm -rf .next
npm run dev
```

浏览器检查：

- `/`：侧栏信息纵向排版、邮箱为真 `@`、关键词 pill、头像与 favicon。  
- `/experience`、`/projects`、`/cv`：文案、logo、无死链。  
- 语言切换：中/英导航与内容是否同步。

然后：

```bash
npm run build
```

确认 `out/` 生成且无报错，再按 `docs/deployment.md` 部署 GitHub Pages。

---

## 7. 与用户沟通时的高效问法（可选）

- LinkedIn 是否确认使用固定 URL（含中文路径段）？是否需要短链？  
- 「动态」里是否允许提及具体面试公司名 / offer？（默认建议不写死）  
- 项目页是否需要外链（GitHub repo、PDF 报告、slides）？  
- 是否还需要 Publications 页面（当前导航可能已移除；若 bib 为空可删文件或保留占位）。

---

## 8. 对话级元信息（给 AI 用）

- 用户偏好：**中文沟通**；希望步骤「手把手」但仍会授权本地执行。  
- 用户曾明确：**动态不要官方腔**，要第一人称 + emoji；**不要把项目卡片整块搬到首页当动态替代**。  
- 计划文件（若仍存在）：可能在用户本机 `~/.cursor/plans/` 下以 `个人主页_prism_定制_*.plan.md` 命名——**以本 HANDOVER 与仓库实际代码为准**，计划文件可能滞后。

---

## 9. 文件索引（快速跳转）

| 用途 | 路径 |
|------|------|
| 英文站点配置 | `content/config.toml` |
| 中文站点配置 | `content_zh/config.toml` |
| 首页 sections | `content/about.toml`、`content_zh/about.toml` |
| 实习卡片 | `content/experience.toml`、`content_zh/experience.toml` |
| 项目卡片 | `content/projects.toml`、`content_zh/projects.toml` |
| 简历 Markdown | `content/cv.md`、`content_zh/cv.md` |
| 动态 | `content/news.toml`、`content_zh/news.toml` |
| 侧栏组件 | `src/components/home/Profile.tsx` |
| 首页客户端 | `src/components/home/HomePageClient.tsx` |
| 首页数据预处理 | `src/app/page.tsx` |
| 卡片页渲染 | `src/components/pages/CardPage.tsx` |
| 静态资源 | `public/*` |
| 上游部署说明 | `docs/deployment.md` |
| 本交接说明 | `docs/HANDOVER.md` |

---

## 10. 对话记忆摘要（与用户的协作过程，非代码细节）

以下内容来自多轮对话的**事实与决策**，便于还原「为什么这样改」。若与当前仓库文件冲突，**以仓库为准**。

1. **模板选型**：用户最初指向 `Zhero-Hub/Zhero-s-website`，实为 PRISM；内容主要在 `content/`（TOML + Markdown + Bib），`content_zh/` 为中文镜像；静态导出目录为 `out/`。
2. **域名与 GitHub**：用户一度想要 `SandyLYY.github.io`，后接受使用现有账号下的 **`sandy_yaying.github.io`** 用户站规则；GitHub 展示主页链接为 **`https://github.com/Sandy-LYY`**（与早期 `Sandy_yaying` 混用需以最终配置为准）。
3. **叙事转向**：从学术主页改为**求职 / 实习**；弱化论文页，强化实习、项目、CV；导航增加 **Projects**。
4. **简历来源**：用户提供微信路径下的 PDF；曾提取文本写入 `content*`（教育、实习、技能等）。
5. **女友求职方向头脑风暴**：用户转述另一 AI 对「腾讯广告营销管培生 / 市场研究」JD 的改写建议，用于润色经历 bullet（数据驱动、EDM CTR、KOL 指标等），接手人需与用户**核对真实性**。
6. **头像与 favicon**：用户照片 → `public/avatar.png`；`favicon.svg` 由肌肉 emoji 改为更贴近人设的 emoji（以文件为准）。
7. **侧栏 UI 反馈**：用户参考「纵向排列的联系信息列表」；邮箱弹层曾显示 ` (at) ` 被用户指出错误，后续改为**直接展示真实邮箱**并改为纵向列表布局（见 `Profile.tsx`）。
8. **动态（News）**：用户强调用**第一人称、口语、带 emoji**；内容应**提炼**实习/升学/项目一句话，**不要**把项目卡片整块搬到首页充当动态；**勿编造具体 offer** 除非用户书面确认。
9. **学校名称修正**：用户要求简历等页面将「BNU-HKBU UIC / 北师港浸大」改为「**香港浸会大学 / HKBU**」；删除「朋辈导师 & 招生宣传」整块；公司名去掉「广州」前缀（圣岚、阿尔法时空等）。
10. **LinkedIn**：用户补充个人主页路径为 `www.linkedin.com/in/雅颖-罗-3b4443404`（配置里应带 `https://`，中文路径注意 URL 编码）。
11. **Logo 素材**：用户上传多枚 PNG，已复制到 `public/logos/`（`hkbu-wordmark.png`、`hkbu-seal.png`、`bristol.png`、`joyy.png`、`iblue.png`），供 Markdown 或卡片 `image` 字段引用。
12. **本地环境问题**：用户本机曾用 **Node v23** + `next dev --turbopack` 出现 `.next` 下 `app-build-manifest.json` 缺失报错；处理方向为 **Node 22** + 去掉 turbopack 的 dev 脚本 + 清理 `.next`。
13. **未完成/易分歧点**：GitHub Pages **实际上线**由用户在网页端完成；`about.toml` 是否保留首页「项目亮点」卡片需与用户最终一句话对齐（用户曾反对把项目卡片当动态替代，不等同于一定禁止首页展示项目摘要）。

---

## 11. 给下一位 AI 的「启动提示词」（可直接复制到新对话）

把下面整段粘贴到新对话的第一条（并把「当前日期」按需改掉）：

```text
你是我的结对编程助手。请先阅读我仓库里的交接文档，再开始改代码或给命令：

1) 打开并通读：docs/HANDOVER.md（项目交接、进度、文件索引、已知问题）
2) 打开并参考：docs/deployment.md（上游 PRISM 的 GitHub Pages 部署说明）
3) 项目根目录应为：/Users/wangzixuan/sandy-personal-site（Next.js 15 + PRISM 模板）

接手规则：
- 默认用中文回复我。
- 改文案优先只动 content/ 与 content_zh/；改布局/交互才动 src/。
- 不要编造我女友的 offer/录取/公司面试细节；不确定就先问我。
- 动态 news.toml：第一人称、口语化、可少量 emoji；用简历里可核实的事实一句话概括；不要把整页项目卡片当「动态」。
- 学校表述：用「香港浸会大学 / HKBU」，不要用 BNU-HKBU UIC；简历里已要求删除朋辈导师与招生宣传段落。
- 本地开发：优先 Node 22；若 dev 异常先 rm -rf .next 再 npm run dev；package.json 里 dev 应为 next dev（非 turbopack）。

请你先总结：你读完 HANDOVER 后认为「当前已完成 / 可能未完成 / 风险点」各是什么；再列出你建议的下一步（最多 3 条）。在我确认前不要大范围重构。
```

---

**祝接手顺利。** 若你发现本文件与代码不一致，以 **Git 当前版本** 为准，并建议将差异补记在本文件末尾（追加一节 Changelog 即可）。
