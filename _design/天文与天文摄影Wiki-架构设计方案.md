# 天文 & 天文摄影 Wiki — 架构设计方案

> 目标:囊括从入门到精通的全部知识 + 知识索引 + 大量图片,双语(中文为主 / 英文对照),先自用、后期可开源给爱好者社区。
> 技术选型:**Astro + Starlight**(静态站点生成器)。

---

## 1. 为什么选 Astro + Starlight

你的核心需求是「图文并茂的双语知识库 + 索引 + 可发布」。Starlight 是 Astro 官方的文档/wiki 主题,几乎是为这个场景量身定做:

- **内置中英双语 i18n**:自动语言切换、侧边栏翻译、缺失翻译时自动回退(fallback)到默认语言。Chinese 是官方支持的 40+ 内置 UI 语言之一,开箱即用。
- **内置全文搜索**:由 Pagefind 提供,静态、免后端、支持中文,正好做你要的「知识索引」基础。
- **Astro 原生图片优化**:自动生成 WebP/AVIF、响应式尺寸、懒加载——这对动辄几十 MB 的天文照片至关重要。
- **Markdown / MDX 内容**:纯文本、可版本控制(Git)、未来开源零摩擦;MDX 还能内嵌交互组件(图片画廊、前后对比滑块、可折叠数据表)。
- **免费部署**:Cloudflare Pages / Vercel / GitHub Pages 一键上线。
- **侧边栏自动导航 + 页内目录(TOC)**:层级结构天然契合 wiki。

> 备选对比:Docusaurus(React 偏重、i18n 也不错,但配置更繁);MkDocs Material(最简单,但图片/组件灵活度低于 Starlight)。综合「图片密集 + 双语 + 可成长」,Starlight 最优。
>
> 巧合的是项目文件夹就叫 `astro`,正好就是这个框架。

---

## 2. 信息架构(核心理念)

整个 wiki 用 **「两支柱 + 索引层 + 难度标签」** 的三维结构,而**不是**按「入门/进阶/精通」拆成三棵重复的树(那样会内容碎片化、维护噩梦)。

```
                         天文 & 天文摄影 Wiki
        ┌───────────────────────┴───────────────────────┐
   支柱 A:天文知识                              支柱 B:天文摄影
   (Astronomy)                                  (Astrophotography)
        │                                               │
        └───────────────┬───────────────────────────────┘
                        ▼
                  索引层(贯穿全站)
        术语表 / 天体目录 / 器材库 / 软件索引 / 学习路径 / 标签 / 资源
                        ▼
              每篇文章打「难度标签」:🟢入门 / 🟡进阶 / 🔴精通
```

**关键设计决策:难度不分树,而是「标签 + 学习路径」。**
每个主题只有**一篇**权威文章(单一信息源),文章头部标注难度;再用「学习路径」把不同难度的文章串成路线图。好处:无重复、好维护、读者可多入口进入。这是现代知识库的最佳实践。

---

## 3. 完整内容大纲(囊括入门到精通)

> **优先级(v2,2026-06 调整):** 短期不自购器材,因此**先写**「天文知识(支柱 A)」+「深空摄影基础(B1 摄影基础、B5 后期处理入门)」+「远程平台(B0)」;**后置**「B2 器材」「B6 操作/自动化」等需要自有设备的内容。下方大纲已标注 ⭐=优先、⏸=后置。
>
> **「观测站」消歧:** 中文"观测站"含两类,wiki 里分开放——① **远程成像平台**(iTelescope/SkyShare 等,租机时拍照)→ 归「天文摄影 · B0 远程平台」;② **著名天文台**(VLT/ALMA 等科研地标 + 半球可见性)→ 归「天文知识」参考 + 索引层。详见《观测站与远程平台-对比与指南》《天体目录与著名天文台-起步内容》两份文件。

### 支柱 A — 天文知识 Astronomy

**A1. 天文基础 Foundations** 🟢
- 天球与坐标系(赤道坐标 RA/Dec、地平坐标 Alt/Az、黄道坐标)
- 时间系统(恒星时、儒略日、世界时与时区、均时差)
- 星图与星座(88 星座、星官、亮星命名 Bayer/Flamsteed)
- 天体的视运动(周日运动、岁差、章动、视差、自行)
- 星等系统(视星等、绝对星等、光度)

**A2. 太阳系 Solar System** 🟢→🟡
- 太阳(黑子、日珥、日冕、太阳活动周期)
- 月球(月相、天平动、月面地形、月食)
- 行星(各行星特征、冲/合/大距、行星合月)
- 矮行星与小天体(冥王星、谷神星、柯伊伯带、奥尔特云)
- 彗星、小行星、流星与流星雨、黄道光

**A3. 恒星与深空 Stars & Deep Sky** 🟡→🔴
- 恒星物理(赫罗图 H-R、光谱型 OBAFGKM、恒星演化、核合成)
- 双星、聚星与变星(食变星、造父变星、新星/超新星)
- 星团(疏散星团、球状星团)
- 星云(发射、反射、行星状、暗、超新星遗迹)
- 星系(类型、本星系群、活动星系核、类星体)

**A4. 宇宙学 Cosmology** 🔴
- 大尺度结构、哈勃定律与红移、宇宙微波背景
- 暗物质与暗能量、宇宙演化与大爆炸

**A5. 观测天文学 Observing** 🟢→🟡 ⭐
- 大气与观测条件(视宁度 seeing、透明度、光污染、Bortle 暗空分级)
- **半球可见性原理**(用纬度 φ 与天体赤纬 Dec 判断能否看到 / 拱极)⭐
- **全球著名天文台**(莫纳克亚 / 帕瑞纳尔 VLT / ALMA…… + 所在半球与选址三要素)⭐
- 选址与观测计划(星历、可见性、Stellarium 等天象软件)
- 目视观测技巧(暗适应、余光视觉、双筒 vs 望远镜)

### 支柱 B — 天文摄影 Astrophotography

**B0. 远程平台 Remote Imaging Platforms** 🟢 ⭐(新增·优先)
- 远程成像是什么、为什么适合"不买器材也能拍深空"
- 平台对比:AstroBin(图床/数据库) vs iTelescope(老牌网络) vs SkyShare(按夜包干) + Telescope Live / Slooh 等
- 怎么挑目标、怎么拿 FITS、怎么接后期(衔接 B5)

**B1. 摄影基础 Fundamentals** 🟢 ⭐
- 光学基础(焦距、口径、焦比 f/、视场 FoV、采样率 arcsec/px)
- 天文中的曝光三角与 ISO/增益
- 传感器(CMOS vs CCD、黑白 vs 彩色 OSC、量子效率 QE、读出噪声、增益/偏置)
- 噪声与信噪比 SNR(为什么要叠加)

**B2. 器材 Equipment** 🟢→🟡 ⏸(后置:自购器材时再展开)
- 望远镜类型(折射、牛顿反射、施卡 SCT、RC、马卡 Mak)
- 赤道仪与跟踪(经纬仪 vs 赤道仪、GoTo、周期误差 PE、负载比)
- 相机(单反/微单、专用天文相机、行星相机)
- 导星系统(主镜导星、副镜 OAG、导星软件)
- 滤镜(宽带、窄带 Hα/OIII/SII、抗光害 LP、双窄/三窄)
- 配件(平场镜、彗差改正镜、减焦镜、大气色散改正 ADC)

**B3. 拍摄技术 Capture(按目标分类)** 🟢→🔴
- 星野/广角(银河、夜景星空、固定/简易跟踪)
- 深空 DSO(长曝、跟踪、抖动 dithering、子帧策略)
- 行星 / 月球 / 太阳(幸运成像 lucky imaging、视频拍摄、ROI)
- 窄带成像(SHO / HOO 调色板、哈勃色)
- 特殊题材(日月食、彗星、ISS 凌日、掩星、星轨、延时)

**B4. 校准帧 Calibration** 🟡
- 暗场 Darks、平场 Flats、偏置 Bias / 暗平场 —— 各自校正什么、怎么拍

**B5. 后期处理 Processing** 🟡→🔴
- 预处理与叠加(DeepSkyStacker、Siril、APP)
- 处理流程(PixInsight、Photoshop、GraXpert、StarNet++)
- 关键技术(去渐变、色彩校准、拉伸 stretch、反卷积、降噪、缩星)
- 行星处理(AutoStakkert、RegiStax、小波锐化 wavelets)

**B6. 工作流与排障 Workflow & Troubleshooting** 🟡→🔴 ⏸(后置:自购器材时再展开)
- 自动化(N.I.N.A.、ASIAIR、序列拍摄)
- 极轴校准(漂移法、电子极轴镜)
- 常见问题图鉴(星点拖线、暗角、走动噪声 walking noise、星点臃肿、倾斜 tilt)

### 索引层 — Indexes(贯穿全站,你要的「知识索引」)

1. **术语表 Glossary**:中英对照、按字母/分类,正文术语自动链接到词条。
2. **天体目录 Object Catalog** ⭐:Messier / NGC / Caldwell;每个天体一页含**所在星座、赤经赤纬(RA/Dec)、星等、类型、最佳半球·季节、一句话简介、推荐焦距、AstroBin 实拍参考**,并按半球/季节/类型可筛选。**数据驱动**(见 §7)。起步样板见《天体目录与著名天文台-起步内容》。
3. **著名天文台 Observatories** ⭐(新增):VLT/ALMA/莫纳克亚等科研地标 + 所在半球 + 选址要素。注意与「B0 远程平台」分开(消歧)。
4. **软件索引 Software Index**:拍摄/处理/规划工具一览。
5. **学习路径 Learning Paths**:精选路线图(见 §9),解决「从入门到精通」的引导。
6. **标签索引 Tags**:按难度、目标类型、季节、星座、半球聚合。
7. **外部资源 Resources**:书籍、论坛、计算器、巡天图库、公共版权图源。
8. **器材库 Equipment Database** ⏸:望远镜/赤道仪/相机规格卡片(自购器材阶段再建)。

---

## 4. 目录与文件结构

中文设为**默认语言(根目录)**,英文放 `/en/`;两边**同名文件**自动关联为互译(Starlight 约定)。后期想把英文设为根也只需改一行配置。

```
astro/                          # 仓库根 = Astro 项目
├─ astro.config.mjs             # Starlight 配置:locales(zh 根 / en)、侧边栏
├─ package.json
├─ src/
│  ├─ content/
│  │  └─ docs/
│  │     ├─ index.mdx                    # 中文首页(默认语言=根)
│  │     ├─ astronomy/                   # A 支柱(中文)
│  │     │  ├─ foundations/
│  │     │  ├─ solar-system/
│  │     │  ├─ deep-sky/
│  │     │  ├─ cosmology/
│  │     │  └─ observing/
│  │     ├─ astrophotography/            # B 支柱(中文)
│  │     │  ├─ fundamentals/
│  │     │  ├─ equipment/
│  │     │  ├─ capture/
│  │     │  ├─ calibration/
│  │     │  ├─ processing/
│  │     │  └─ workflow/
│  │     ├─ index/                       # 索引层(术语表/目录/路径…)
│  │     └─ en/                          # 英文镜像,文件名与上面一一对应
│  │        ├─ index.mdx
│  │        ├─ astronomy/ …
│  │        └─ astrophotography/ …
│  ├─ assets/images/             # 正文图片源文件(构建时优化,≤2000px)
│  ├─ components/                # 自定义组件(见 §6、§7)
│  └─ content.config.ts          # 内容集合 schema + 自定义 frontmatter
├─ public/                       # 原样托管的静态文件(如全分辨率下载图)
└─ astro.config.mjs
```

---

## 5. 双语方案

- `astro.config.mjs` 里:
  ```js
  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },  // 中文 = 根
    en:   { label: 'English',  lang: 'en' },
  }
  ```
- **同名关联**:`docs/astrophotography/capture/dso-basics.mdx`(中)↔ `docs/en/astrophotography/capture/dso-basics.mdx`(英),Starlight 自动在两者间放语言切换链接。
- **自动回退**:英文还没写的页面,会自动显示中文内容并提示「尚未翻译」,你可以中文先行、英文逐步补。
- **术语策略**:中文正文里关键术语首次出现附英文,如「赤道仪(equatorial mount)」;术语表做完整中英对照。

---

## 6. 图片资源管理(天文摄影的命脉)

天文照片又大又多,这是架构里最需要提前规划的部分。

**分层存放:**
- **正文配图** → `src/assets/images/`,经 Astro `<Image>` 自动优化(WebP/AVIF、多尺寸、懒加载)。源图控制在 ≤2000px 长边、合理压缩。
- **全分辨率原图 / 下载** → 不要随意塞进 Git。两种方案:
  - 数量不大:`public/` + **Git LFS**(大文件单独管理)。
  - 数量大 / 要开源:用图床 CDN(**Cloudflare R2 / Images**、Cloudinary),正文按 URL 引用,仓库保持轻量。

**给每张天文照片带「拍摄元数据」(强烈推荐):**
做一个自定义 `<Capture>` 组件,像 AstroBin 那样在图下展示采集信息——目标、器材、曝光(如 `60×300s`)、滤镜、日期、地点、Bortle。元数据写在 MDX frontmatter 或组件 props 里。这让 wiki 既是教程也是作品集。

**其他有用组件:**
- 图片灯箱缩放(插件 `starlight-image-zoom`)——看大图细节必备。
- **前后对比滑块**——后期教程展示「处理前/后」极其直观。
- 带标注的图(箭头/圈出目标)。

**版权与署名:**
开源 wiki 务必标注图源。可放心使用的公共版权图源:**NASA**(公有领域)、**ESO / ESA-Hubble**(CC BY 4.0)。自己拍的标 © 你,转载的注明许可。建议在 frontmatter 加 `imageCredit` 字段统一管理。

---

## 7. 知识索引与交叉链接机制

- **全文搜索**:Starlight 内置 Pagefind,构建时自动索引,支持中文。
- **天体目录做成「数据驱动」**:把 Messier/NGC 等天体存成数据(内容集合的 YAML/JSON 或 frontmatter),用 Astro 的 `getCollection()` 自动生成:① 每个天体的详情页;② 一张可按类型/季节/难度筛选的总表。新增天体只改数据,不写页面。
- **术语自动链接**:正文中的术语自动指向术语表词条(remark 插件或约定式 `[赤道仪](/index/glossary#equatorial-mount)`)。
- **标签聚合页**:按 `difficulty` / `tags` 自动生成聚合索引(如「所有🟢入门」「所有冬季深空目标」)。
- **交叉链接校验**:插件 `starlight-links-validator` 在构建时报出失效内链,防止 wiki 长大后链接腐烂。
- **多版块侧边栏**:插件 `starlight-sidebar-topics` 可把「天文」与「天文摄影」做成两个独立顶层版块,各自有侧边栏,导航更清爽。

---

## 8. 文章 Frontmatter 模板(统一元数据)

在 `content.config.ts` 扩展 Starlight 的 schema,每篇文章头部统一:

```yaml
---
title: 猎户座大星云 M42
description: 冬季最易拍的发射星云,新手深空第一目标。
difficulty: beginner          # beginner | intermediate | advanced → 🟢🟡🔴
tags: [emission-nebula, winter, narrowband, beginner-target]
objectId: M42                 # 关联天体目录
prerequisites:                # 建议先读
  - /astrophotography/capture/dso-basics
season: winter                # 可选:观测季节
lastUpdated: 2026-06-08
---
```

`difficulty` / `tags` / `objectId` 这几个自定义字段,是驱动「难度徽章、标签索引、目录关联」的关键。

---

## 9. 学习路径示例(解决「入门到精通」)

每条路径 = 跨越内容树的一串有序链接,放在索引层:

- 🌱 **零基础天文入门**:认星座 → 用双筒 → 第一台望远镜 → 看懂星图 → 第一次目视深空。
- 📷 **天文摄影·你的第一张深空(远程版,无需器材)** ⭐:认识远程平台 → 选平台(SkyShare 试拍)→ 选一个大星云目标 → 拿原始 FITS → Siril 第一次叠加 → 基础后期。
- 📷 **天文摄影·你的第一张深空(自有器材版)** ⏸:看懂器材 → 极轴校准 → 合焦试拍 → 校准帧 → 叠加 → 后期。
- 🪐 **行星摄影进阶**:行星相机与 ROI → 幸运成像 → AutoStakkert 叠加 → 小波锐化 → ADC 调试。
- 🌌 **窄带深空精通**:窄带滤镜原理 → SHO 采集策略 → PixInsight 流程 → 调色板与缩星 → 马赛克拼接。

---

## 10. 推荐插件与部署

**Starlight 插件(按需启用):**
- `starlight-image-zoom` — 图片灯箱
- `starlight-sidebar-topics` — 天文/摄影双版块
- `starlight-links-validator` — 内链校验
- `starlight-blog` —(可选)做「观测日志/拍摄记录」时间线

**部署:** Cloudflare Pages 或 Vercel,连 Git 仓库自动构建上线;域名免费 HTTPS。开源时直接公开仓库 + 接受 PR。

---

## 11. 落地步骤(Roadmap · v2 已按新优先级重排)

1. **脚手架**:初始化 Astro + Starlight 项目,配好 zh/en 双语。
2. **骨架**:按 §4 建好目录 + 占位页 + 侧边栏。
3. **schema**:写 `content.config.ts`(difficulty/tags/objectId + **constellation/RA/Dec/hemisphere** 字段)+ 难度徽章组件 + `<Capture>` 图片组件。
4. **⭐ 先做天文知识**:支柱 A 入门(基础 / 太阳系 / 深空 / 观测天文学,含**半球可见性** + **著名天文台**)。
5. **⭐ 天体目录起步**:Messier 110 个数据(含位置 / 半球 / 简介,样板已就绪),做可筛选索引。
6. **⭐ 远程平台 + 深空基础**:B0 平台对比(已就绪)+ B1 摄影基础 + B5 后期入门 + 一条「远程版第一张深空」学习路径。
7. **填充**:按学习路径持续补,中文先行、英文跟进。
8. **⏸ 后置**:待自购器材后,再展开 B2 器材、B6 操作/自动化、器材库。
9. **上线**:部署到 Cloudflare/Vercel;成熟后开源。

---

*下一步我可以直接帮你把第 1~3 步的脚手架和骨架在这个文件夹里搭出来(可跑的 Astro + Starlight 项目 + 双语目录 + 难度徽章/图片组件),并把已就绪的 B0 平台对比、天体目录样板、半球可见性、著名天文台直接灌成首批页面。*
