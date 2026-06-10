# 拾光记 · Lumina — 天文 & 天文摄影 Wiki

一个以中文为主、逐步补充英文内容的天文与天文摄影知识库,基于 **Astro + Starlight** 构建。
内容覆盖天球坐标、观测规划、深空天体、远程成像、校准和后期处理。

> 设计方案见 [`_design/天文与天文摄影Wiki-架构设计方案.md`](_design/)。

## 本地开发

```bash
npm install
npm run dev       # 开发服务器 http://localhost:4321
npm run build     # 构建到 dist/(含 Pagefind 全文搜索索引)
npm run preview   # 预览构建产物
```

要求 Node ≥ 18。

## 目录结构

```
src/
├─ content/docs/            # 所有内容页(Markdown/MDX)
│  ├─ index.mdx             # 中文首页(splash)
│  ├─ start.mdx             # 欢迎/导览
│  ├─ astronomy/            # 天文知识(基础/太阳系/深空/宇宙学/观测)
│  ├─ astrophotography/     # 天文摄影(远程平台/基础/拍摄/校准/后期)
│  ├─ reference/            # 索引层(天体目录/天文台/术语表/软件/学习路径/资源)
│  └─ en/                   # 英文镜像(同名文件自动互译;缺失则回退中文)
├─ data/
│  ├─ objects.yaml          # ★ 天体目录数据源(改这里即可增删天体)
│  └─ credits.json          # 图片署名/许可表(由抓图脚本生成)
├─ assets/images/           # 本地图片(构建时优化为 WebP/AVIF)
├─ components/
│  ├─ Fig.astro             # 带署名的配图  <Fig name="..." alt="..." caption="..." />
│  ├─ Capture.astro         # AstroBin 式拍摄参数卡
│  ├─ ObjectCatalog.astro   # 数据驱动 + 可筛选的天体卡片网格
│  ├─ PageTitle.astro       # 覆盖件:按 frontmatter 自动渲染难度徽章/季节
│  └─ diagrams/             # 7 个 SVG 概念图(含交互式半球可见性)
├─ pages/reference/catalog/[id].astro   # 数据驱动的天体详情页(自动生成)
├─ content.config.ts        # 内容集合 schema(难度/标签 + 天体字段)
└─ styles/theme.css         # 文档站主题
```

## 怎么加内容

- **加一篇文章**:在 `src/content/docs/<支柱>/<分类>/` 下新建 `.mdx`,frontmatter 写
  `title` / `difficulty`(beginner|intermediate|advanced)/ `sidebar.order`,侧边栏会自动收录。
- **加一个天体**:在 `src/data/objects.yaml` 追加一条;详情页与可筛选索引**自动生成**,无需写页面。
- **加配图**:把图片放进 `src/assets/images/`,在文章里 `import Fig from '@/components/Fig.astro'` 后
  `<Fig name="文件名(无扩展名)" alt="..." />`。署名可在 `src/data/credits.json` 维护。
- **概念图**:从 `@/components/diagrams/` 引入(`CoordSphere` / `HemisphereViz` / `HRDiagram` /
  `BortleScale` / `SNRChart` / `SHOPalette` / `FocalFOV`)。

> MDX 注意:正文里 `<` 紧跟数字(如 `<1`)或属性值里嵌套直引号会导致解析报错,
> 用「小于 1」或中文引号「」代替。

## 图片版权

正文图片来自公共版权来源:**NASA**(公有领域)、**ESO / ESA-Hubble**(CC BY)及
Wikimedia Commons 上的 CC 作品,署名与许可记录在 `src/data/credits.json`,并显示在每张图下方。
抓图脚本见 `_design/fetch_images.py`。

## 部署

连接 Git 仓库到 **Cloudflare Pages** 或 **Vercel**,构建命令 `npm run build`、输出目录 `dist/`,即可自动上线(免费 HTTPS)。
记得把 `astro.config.mjs` 里的 `site` 改成你的正式域名。

## 技术要点

- **双语 i18n**:中文为根(`/`),英文在 `/en/`;同名文件自动关联互译,缺失翻译自动回退中文。
- **全文搜索**:Starlight 内置 Pagefind,静态、免后端、支持中文。
- **图片优化**:Astro `<Image>` 自动生成 WebP/AVIF 多尺寸 + 懒加载。
- **难度标签 + 学习路径**:每个主题使用独立文章和难度徽章,学习路径负责串联跨目录内容。
