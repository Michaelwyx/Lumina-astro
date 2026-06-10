export const meta = {
  name: 'astro-wiki-content',
  description: '并行撰写天文 wiki 的 37 个内容页(每 agent 一页,统一组件/配图/链接规范)',
  phases: [{ title: '撰写内容', detail: '每个 agent 扩写一页 MDX' }],
};

const ROOT = 'src/content/docs';

// ── 所有 agent 共用的规范与速查表 ────────────────────────────────────────────
const GUIDE = `
你在为一个「Astro + Starlight」双语天文 & 天文摄影知识库撰写**一个**中文内容页(MDX)。
目标读者:中文天文/天文摄影爱好者,从入门到精通。风格:准确、有教学性、图文并茂、简洁清晰。

## 工作方式(必须遵守)
1. 先用 Read 读取目标文件(它现在是占位骨架),拿到现有 YAML frontmatter。
2. 用 Write **整体覆盖**该文件。保留 frontmatter 里的 title / difficulty / pillar / sidebar(原样不动);
   只把 description 改写成一句具体、准确的摘要(20–40 字)。frontmatter 之后写正文。
3. 只写这**一个**目标文件,不要碰任何其它文件,不要运行构建/安装命令。

## MDX 硬性规则
- 简体中文为主;关键术语首次出现加英文,如「赤道仪(equatorial mount)」。
- **禁止 LaTeX / $$公式$$**(站点不渲染数学)。公式用行内代码或**加粗**表示,如 \`f/ = 焦距 ÷ 口径\`。
- 标题从 \`##\` 开始(H1 由系统用 frontmatter.title 自动生成,正文不要再写 H1,也不要重复写难度徽章——会自动显示)。
- 善用:Markdown 表格、有序/无序列表、以及 Starlight 的 Aside 提示框。
- frontmatter 里若 title 含英文冒号或特殊字符,保持其原有引号写法。

## 可用组件(只在用到时 import,路径用 @ 别名,任何页面深度都通用)

Starlight 内置(按需):
\`import { Aside, Card, CardGrid, LinkCard, Steps } from '@astrojs/starlight/components';\`
- \`<Aside type="tip|note|caution|danger" title="...">…</Aside>\` 提示框
- \`<Steps>\` 包一个有序列表 \`<ol>\`,渲染成漂亮的步骤条
- \`<CardGrid>\`+\`<Card title="" icon="star">\` 或 \`<LinkCard title="" href="" description="" />\`

配图(本地优化图,**只能用下面列出的 key**,否则会显示缺图占位):
\`import Fig from '@/components/Fig.astro';\` → \`<Fig name="KEY" alt="..." caption="说明" />\`
两图并排:\`<div class="cols2"><Fig .../><Fig .../></div>\`
可用 KEY 及内容:
  m42-orion=猎户座大星云M42 | m31-andromeda=仙女座星系M31 | m45-pleiades=昴星团M45 |
  m13-hercules=武仙座球状星团M13 | m51-whirlpool=涡状星系M51 | m57-ring=环状星云M57 |
  m8-lagoon=礁湖星云M8 | m104-sombrero=草帽星系M104 | ngc7000-namerica=北美洲星云 |
  carina=船底座星云 | omega-cen=半人马ω球状星团 | 47tuc=杜鹃47球状星团 | lmc=大麦哲伦云 |
  horsehead=马头星云 | eagle-pillars=鹰状星云/创生之柱 | sun=太阳(SDO) | moon=满月 |
  saturn=土星(卡西尼) | jupiter=木星(哈勃) | milkyway=银河拱桥 | vlt=帕瑞纳尔VLT |
  alma=ALMA阵列 | startrails=星轨 | lasergstar=激光导星指向银心

拍摄参数卡片(AstroBin 风格,展示一张样片+采集参数,适合做"示例作品"):
\`import Capture from '@/components/Capture.astro';\`
\`<Capture name="KEY" alt="..." target="目标" scope="主镜" mount="赤道仪" camera="相机" filters="滤镜" exposure="60×300s (5h)" location="地点" bortle="2" date="2025-01" software="Siril" />\`
(除 name/alt 外所有参数可选;参数为示意性合理数值即可)

概念示意图(SVG,直接用,可加 caption="..."):
\`import CoordSphere from '@/components/diagrams/CoordSphere.astro';\`  天球坐标(赤经/赤纬/天赤道/黄道)
\`import HemisphereViz from '@/components/diagrams/HemisphereViz.astro';\`  交互式半球可见性(纬度滑块)
\`import HRDiagram from '@/components/diagrams/HRDiagram.astro';\`  赫罗图
\`import BortleScale from '@/components/diagrams/BortleScale.astro';\`  波特尔暗空分级 1–9
\`import SNRChart from '@/components/diagrams/SNRChart.astro';\`  信噪比 ∝ √N 曲线
\`import SHOPalette from '@/components/diagrams/SHOPalette.astro';\`  窄带 SHO/HOO 调色板
\`import FocalFOV from '@/components/diagrams/FocalFOV.astro';\`  焦距 vs 视场取景

## 站内交叉链接(用绝对路径 + 结尾斜杠,自然地嵌进正文,1–4 处即可)
/start/
天文基础: /astronomy/foundations/celestial-coordinates/ , .../time-systems/ , .../constellations/ , .../apparent-motion/ , .../magnitude/
太阳系: /astronomy/solar-system/sun/ , .../moon/ , .../planets/ , .../small-bodies/
深空: /astronomy/deep-sky/stellar-physics/ , .../variable-multiple-stars/ , .../star-clusters/ , .../nebulae/ , .../galaxies/
宇宙学: /astronomy/cosmology/overview/
观测: /astronomy/observing/conditions/ , .../hemisphere-visibility/ , .../planning/ , .../visual-techniques/
远程平台: /astrophotography/remote-platforms/overview/ , .../platforms-comparison/
摄影基础: /astrophotography/fundamentals/optics/ , .../exposure/ , .../sensors/ , .../snr/
拍摄: /astrophotography/capture/widefield/ , .../dso-basics/ , .../planetary/ , .../narrowband/
校准: /astrophotography/calibration/calibration-frames/
后期: /astrophotography/processing/stacking/ , .../workflow/ , .../techniques/
索引: /reference/catalog/ , /reference/observatories/ , /reference/glossary/ , /reference/software/ , /reference/learning-paths/ , /reference/resources/

## 篇幅
正文约 500–900 字中文 + 合适的表格/列表/提示框,以及**至少一处**贴切的配图或概念图(若该页有指定的图/图表,必须用上)。不要为凑字数灌水。
`;

// ── 每页规格:path / 概要 / 视觉指定 / 可选源料 ──────────────────────────────
const PAGES = [
  {
    path: 'start.mdx',
    brief: `站点欢迎/导览页。说明这座 wiki 的理念:两支柱(天文知识 / 天文摄影)+ 索引层 + 难度标签(🟢入门/🟡进阶/🔴精通)。
告诉不同读者从哪开始:完全没基础→半球可见性+天球坐标;想拍深空→远程平台+后期叠加;想查天体→天体目录。
介绍三类入口:支柱A、支柱B、索引层(术语表/天体目录/天文台/软件/学习路径/资源)。说明双语(中文先行,英文回退)。`,
    visual: `开头用 <Fig name="milkyway" .../>;用 <CardGrid> + <LinkCard> 列出主要入口;可用 <Aside>。`,
  },

  // ───────── 天文基础 ─────────
  {
    path: 'astronomy/foundations/celestial-coordinates.mdx',
    brief: `天球与坐标系。讲:天球概念;赤道坐标系(赤经 RA 时分秒 / 赤纬 Dec 度,J2000);地平坐标系(地平高度 Alt / 方位 Az,随时间地点变);黄道坐标(黄经黄纬,行星与太阳轨迹);三者关系与换算直觉;为什么深空天体用 RA/Dec(固定不变)。给一两个例子(M42 的 RA/Dec)。`,
    visual: `必须用 <CoordSphere />。可链接 /astronomy/observing/hemisphere-visibility/ 与 /reference/catalog/。`,
  },
  {
    path: 'astronomy/foundations/time-systems.mdx',
    brief: `天文时间系统。讲:恒星时(sidereal time)vs 太阳时,为什么相差约每天4分钟;儒略日(Julian Date)连续计日;世界时 UT/UTC 与时区、地方时;均时差(equation of time)与8字曲线;这些怎么用于算天体何时上中天/可见。`,
    visual: `无指定图,可不配图或用一张相关 Fig(如 startrails 体现周日运动)。`,
  },
  {
    path: 'astronomy/foundations/constellations.mdx',
    brief: `星图与星座。讲:88个现代星座(IAU 划界);中国古代星官体系(三垣四象二十八宿)简述与对照;亮星命名 Bayer(α/β + 星座属格,如 Betelgeuse=猎户α)与 Flamsteed 编号;如何用星图/星桥(star hopping)找目标;季节星座。`,
    visual: `可用 <Fig name="m45-pleiades"/> 或 milkyway。链接 /astronomy/foundations/celestial-coordinates/。`,
  },
  {
    path: 'astronomy/foundations/apparent-motion.mdx',
    brief: `天体的视运动。讲:周日运动(地球自转→天体东升西落、绕极);周年运动(地球公转→季节星空更替、黄道);岁差(precession,约25800年,北极星会变)、章动(nutation);视差(parallax)与自行(proper motion)。区分"视运动"与真实运动。`,
    visual: `可用 <Fig name="startrails" caption="星轨记录了周日运动" />。`,
  },
  {
    path: 'astronomy/foundations/magnitude.mdx',
    brief: `星等系统。讲:视星等(apparent magnitude)对数尺度,数字越小越亮,每5等差100倍,1等差约2.512倍;几个锚点(天狼星-1.46、织女星≈0、肉眼极限约6、满月-12.7、太阳-26.7);绝对星等(absolute magnitude,10秒差距处);光度(luminosity);面亮度(surface brightness)对深空摄影的意义。`,
    visual: `无指定图。可配 <Fig name="m45-pleiades"/>(亮星团)说明星等。`,
  },

  // ───────── 太阳系 ─────────
  {
    path: 'astronomy/solar-system/sun.mdx',
    brief: `太阳。讲:基本参数;光球/色球/日冕分层;黑子(sunspots)与11年活动周期、蝴蝶图;日珥(prominences)、耀斑(flares)、日冕物质抛射;**观测安全**:必须用专用太阳滤镜/Hα,绝不可裸眼或普通望远镜直视。`,
    visual: `用 <Fig name="sun" caption="SDO 拍摄的太阳" />。用 <Aside type="danger"> 强调观测安全。链接 /astrophotography/capture/planetary/。`,
  },
  {
    path: 'astronomy/solar-system/moon.mdx',
    brief: `月球。讲:月相成因(新月→满月→残月)与周期(朔望月29.5天);天平动(libration)让我们看到约59%月面;月海/环形山/月陆等地形;月食(lunar eclipse)成因与红月亮;月龄对深空拍摄的影响(满月光害)。`,
    visual: `用 <Fig name="moon" caption="满月" />。链接 /astrophotography/capture/planetary/ 与 /astronomy/observing/conditions/。`,
  },
  {
    path: 'astronomy/solar-system/planets.mdx',
    brief: `行星。讲:类地行星 vs 巨行星;内行星(水金)的大距(elongation)与相位、外行星的冲(opposition,最佳观测)/合(conjunction);各行星看点(金星相位、火星冲、木星大红斑与四大卫星、土星环);行星合月/行星连珠。`,
    visual: `用 <div class="cols2"> 放 <Fig name="saturn"/> 和 <Fig name="jupiter"/>。链接 /astrophotography/capture/planetary/。`,
  },
  {
    path: 'astronomy/solar-system/small-bodies.mdx',
    brief: `矮行星与小天体。讲:矮行星(冥王星、谷神星);柯伊伯带与奥尔特云;小行星带;彗星(结构:彗核/彗发/离子尾+尘埃尾,轨道与回归);流星与流星雨(辐射点、著名雨:英仙座/双子座/象限仪)、火流星;黄道光。`,
    visual: `无对应实拍图,可不配图,或用 milkyway 作背景氛围图。链接 /astronomy/observing/visual-techniques/。`,
  },

  // ───────── 恒星与深空 ─────────
  {
    path: 'astronomy/deep-sky/stellar-physics.mdx',
    brief: `恒星物理与赫罗图。讲:光谱型 OBAFGKM(温度由蓝到红,记忆口诀);赫罗图(H-R diagram)横轴温度纵轴光度,主序带/巨星/白矮星;恒星演化(主序→红巨星→白矮星 / 大质量→超新星→中子星/黑洞);核合成(nucleosynthesis)造就重元素。`,
    visual: `必须用 <HRDiagram />。链接 /astronomy/deep-sky/variable-multiple-stars/ 与 /astronomy/foundations/magnitude/。`,
  },
  {
    path: 'astronomy/deep-sky/variable-multiple-stars.mdx',
    brief: `双星、聚星与变星。讲:光学双星 vs 物理双星;聚星;变星分类:食变星(algol 型)、脉动变星(造父变星 Cepheid——周光关系作"量天尺")、长周期变星;爆发型:新星(nova)、超新星(supernova,Ia/II 型)及其遗迹。`,
    visual: `无指定图;可配 <Fig name="m13-hercules"/> 或省略。链接 /astronomy/deep-sky/stellar-physics/。`,
  },
  {
    path: 'astronomy/deep-sky/star-clusters.mdx',
    brief: `星团。讲:疏散星团(open cluster,年轻、松散、银盘内,如昴星团M45、双星团、蜂巢M44)vs 球状星团(globular,年老、致密球状、银晕中,如M13、ω星团、47Tuc);成员星同源;作为恒星演化与距离标尺的意义;拍摄要点(疏散用广角、球状用长焦)。`,
    visual: `用 <div class="cols2"> 放 <Fig name="m45-pleiades" caption="疏散星团 M45"/> 和 <Fig name="omega-cen" caption="球状星团 ω 星团"/>。链接 /reference/catalog/。`,
  },
  {
    path: 'astronomy/deep-sky/nebulae.mdx',
    brief: `星云。讲五类:发射星云(emission,Hα红,恒星诞生地,如M42、礁湖)、反射星云(reflection,蓝,如昴星团周围)、行星状星云(planetary,中小质量恒星死亡气壳,如环状M57)、暗星云(dark,尘埃遮挡,如马头)、超新星遗迹(SNR,如面纱/蟹状)。各自的辐射机制与拍摄滤镜要点。`,
    visual: `多图:<Fig name="m42-orion" caption="发射星云 M42"/>、<Fig name="m57-ring" caption="行星状星云 M57"/>、<Fig name="horsehead" caption="暗星云 马头"/>、<Fig name="eagle-pillars"/> 选3-4张(可用 cols2)。链接 /astrophotography/capture/narrowband/。`,
  },
  {
    path: 'astronomy/deep-sky/galaxies.mdx',
    brief: `星系。讲:哈勃分类(椭圆E、旋涡S、棒旋SB、不规则Irr,"音叉图");本星系群(银河系、仙女M31、三角M33+卫星星系如麦哲伦云);活动星系核(AGN)、类星体(quasar);星系团与大尺度结构(引出宇宙学);拍摄要点(多为小目标,需长焦+暗空)。`,
    visual: `多图:<Fig name="m31-andromeda" caption="旋涡星系 M31"/>、<Fig name="m51-whirlpool"/>、<Fig name="m104-sombrero"/>、<Fig name="lmc" caption="不规则/矮星系 大麦哲伦云"/> 选3-4张。链接 /astronomy/cosmology/overview/。`,
  },

  // ───────── 宇宙学 ─────────
  {
    path: 'astronomy/cosmology/overview.mdx',
    brief: `宇宙学概览。讲:大尺度结构(星系长城、纤维与空洞);哈勃定律(Hubble's law)与红移(redshift)→宇宙膨胀;宇宙微波背景(CMB)→大爆炸证据;暗物质(星系旋转曲线)与暗能量(加速膨胀);宇宙演化时间线(大爆炸→暴胀→复合→第一代恒星→今天)。点到为止、概念清晰。`,
    visual: `可配 <Fig name="m31-andromeda" caption="仙女座星系——肉眼可见最远的天体之一"/>。链接 /astronomy/deep-sky/galaxies/。`,
  },

  // ───────── 观测天文学 ─────────
  {
    path: 'astronomy/observing/conditions.mdx',
    brief: `大气与观测条件。讲:视宁度(seeing,大气湍流→星点抖动,影响行星与高分辨)、透明度(transparency,影响暗弱深空)、光污染与波特尔(Bortle)1–9 暗空分级、消光(地平线附近更糟)、月光与湿度/露水。区分 seeing 好≠透明度好。给"什么条件拍什么"的建议。`,
    visual: `必须用 <BortleScale />。可配 <Fig name="startrails"/>。链接 /astronomy/observing/hemisphere-visibility/ 与 /astronomy/observing/planning/。`,
    source: `波特尔分级:1极暗原始天空→9市中心。深空摄影理想在1–4级。选址三要素:暗(低光污染)、稳(好seeing)、晴(多晴夜干燥)。`,
  },
  {
    path: 'astronomy/observing/planning.mdx',
    brief: `选址与观测计划。讲:怎么挑观测地(暗、稳、晴 + 地平开阔 + 可达);看光污染地图(Light Pollution Map);用 Stellarium / SkySafari 等查天象与可见性;规划一晚(目标上中天时刻、月相、天气/云图、晨昏蒙影);制定目标清单。`,
    visual: `可用 <Fig name="vlt" caption="选址典范:智利帕瑞纳尔"/> 或 milkyway。用 <Steps> 写"规划一晚"的步骤。链接 /astronomy/observing/hemisphere-visibility/ , /reference/software/ , /reference/observatories/。`,
  },
  {
    path: 'astronomy/observing/visual-techniques.mdx',
    brief: `目视观测技巧。讲:暗适应(dark adaptation,约20–30分钟,用红光护眼);余光视觉(averted vision)看暗弱目标;双筒望远镜 vs 天文望远镜的取舍与新手建议(7x50/10x50双筒入门);出瞳、放大率与视场;目视画星图/记录。`,
    visual: `可用 <Fig name="m13-hercules"/> 或 m45(双筒目标)。链接 /astronomy/foundations/constellations/ 与 /astrophotography/fundamentals/optics/。`,
  },

  // ───────── 远程平台 ─────────
  {
    path: 'astrophotography/remote-platforms/overview.mdx',
    brief: `远程成像入门。讲:远程成像是什么(租用架设在暗空的远程望远镜,网上选目标/拍摄/下载数据);为什么特别适合"不买器材也能拍深空"(省去赤道仪/极轴/天气/光污染/大笔投入);完整流程:选平台→选目标→设置/委托拍摄→拿原始 FITS→接后期叠加。强调这是 v2 优先推荐的入门路径。`,
    visual: `用 <Steps> 写整套流程;可配 <Fig name="m42-orion" caption="远程平台适合先拍大而亮的星云"/>。
**重点链接** /astrophotography/remote-platforms/platforms-comparison/(平台详细对比)、/reference/catalog/(选目标)、/astrophotography/processing/stacking/(接后期)、/astronomy/observing/hemisphere-visibility/(南北半球)。`,
    source: `AstroBin=图床/数据库(不出租镜);iTelescope=双半球远程网络(月订阅+机时,实时控制);SkyShare=按夜包干($79起)拍550mm广角深空,24h内交付FITS含天气保证。建议:开AstroBin免费号→SkyShare $79试拍→需要长焦/双半球再上iTelescope。`,
  },

  // ───────── 摄影基础 ─────────
  {
    path: 'astrophotography/fundamentals/optics.mdx',
    brief: `光学基础。讲:焦距(focal length,决定放大/视场)、口径(aperture,决定集光力与分辨)、焦比(focal ratio f/=焦距÷口径,决定"速度"/面亮度)、视场(FoV)、采样率(arcsec/px = 206.265 × 像元µm ÷ 焦距mm,过采样/欠采样);焦距如何决定目标在画面里的大小(广角拍大星云,长焦拍小星系/行星)。`,
    visual: `必须用 <FocalFOV />。用表格列"焦距区间→适合目标"。链接 /reference/catalog/(每个天体有推荐焦距)、/astrophotography/fundamentals/sensors/。`,
  },
  {
    path: 'astrophotography/fundamentals/exposure.mdx',
    brief: `曝光、增益与 ISO。讲:天文里的曝光三角与白天摄影的不同(光圈≈焦比固定、ISO/增益、单张曝光时长);单张曝光受限于跟踪精度/导星/光害(为何拍很多张短曝再叠加而非一张超长曝);增益(gain)vs ISO 的关系、单位增益(unity gain)、动态范围权衡;直方图判断曝光是否到位(背景峰值离左缘1/4–1/3)。`,
    visual: `可用一个 <Capture> 示例展示典型参数(如 60×300s)。链接 /astrophotography/fundamentals/snr/(为什么叠加)、/astrophotography/fundamentals/sensors/。`,
  },
  {
    path: 'astrophotography/fundamentals/sensors.mdx',
    brief: `传感器。讲:CMOS vs CCD(现今 CMOS 主流);单色(mono)+滤镜轮 vs 彩色(OSC,带拜耳阵列)的取舍;量子效率(QE)、读出噪声(read noise)、暗电流与制冷(冷冻相机降噪)、满阱容量与动态范围、像元大小(与焦距决定采样率);专用天文相机 vs 单反/微单 vs 行星相机的区别。`,
    visual: `用表格对比 mono vs OSC、CMOS vs CCD。链接 /astrophotography/fundamentals/optics/(像元↔采样)、/astrophotography/fundamentals/snr/、/astrophotography/capture/narrowband/(mono+窄带)。`,
  },
  {
    path: 'astrophotography/fundamentals/snr.mdx',
    brief: `噪声与信噪比:为什么叠加。讲:信号 vs 噪声来源(光子散粒噪声、读出噪声、暗电流、天光背景);信噪比(SNR)决定成片细腻度;叠加 N 张子帧,随机噪声按 √N 下降,SNR ∝ √N(16张≈4倍,回报递减);所以"总曝光时长"是王道,以及为何要拍很多子帧 + 抖动(dithering)。`,
    visual: `必须用 <SNRChart />。链接 /astrophotography/processing/stacking/(怎么叠)、/astrophotography/calibration/calibration-frames/(校准噪声)、/astrophotography/fundamentals/exposure/。`,
  },

  // ───────── 拍摄技术 ─────────
  {
    path: 'astrophotography/capture/widefield.mdx',
    brief: `星野与广角。讲:用相机+镜头拍银河/星空夜景;固定三脚架的 NPF/500法则(避免星点拖线)、ISO与光圈选择;简易跟踪(星野赤道仪如 Star Adventurer)解锁更长曝光;前景构图与光绘;银河季节与拍摄地选择。新手最低门槛的入门题材。`,
    visual: `用 <div class="cols2"> 放 <Fig name="milkyway"/> 和 <Fig name="startrails"/>。链接 /astronomy/observing/conditions/、/astronomy/foundations/constellations/。`,
  },
  {
    path: 'astrophotography/capture/dso-basics.mdx',
    brief: `深空 DSO 拍摄。讲:长曝光 + 跟踪/导星的必要;子帧策略(很多张中等时长 light frames);抖动(dithering)消walking noise;为什么配校准帧;合焦(巴德膜/巴氏面具)、构图与板解;典型一晚流程。强调"不买器材可走远程平台"。`,
    visual: `用一个 <Capture name="m31-andromeda" target="仙女座星系 M31" .../> 做示例作品;用 <Steps> 写拍摄流程。
链接 /astrophotography/calibration/calibration-frames/、/astrophotography/processing/stacking/、/astrophotography/remote-platforms/overview/。`,
  },
  {
    path: 'astrophotography/capture/planetary.mdx',
    brief: `行星、月球与太阳。讲:与深空相反——用行星相机录**视频**、抽取上千帧;幸运成像(lucky imaging)挑最清晰帧叠加对抗 seeing;ROI 裁切提高帧率;巴罗镜增焦、大气色散改正(ADC);月球/太阳(需专用太阳滤镜)拍法。后期接 AutoStakkert+小波锐化。`,
    visual: `用 <div class="cols2"> 放 <Fig name="jupiter"/> 和 <Fig name="saturn"/>;<Aside type="danger"> 太阳观测安全。
链接 /astrophotography/processing/techniques/、/astronomy/solar-system/planets/、/astronomy/solar-system/sun/。`,
  },
  {
    path: 'astrophotography/capture/narrowband.mdx',
    brief: `窄带成像。讲:窄带滤镜(Hα/OIII/SII)只透特定发射线,**穿透光害**、突出星云结构、可在月夜拍;调色板:SHO(哈勃色,SII→R/Hα→G/OIII→B)、HOO(双窄,更自然);双窄/三窄滤镜让 OSC 也能玩窄带;采集策略与各通道曝光配比。`,
    visual: `必须用 <SHOPalette />。配 <Fig name="eagle-pillars" caption="鹰状星云——经典窄带目标"/> 或 carina。
链接 /astrophotography/fundamentals/sensors/(mono)、/astronomy/deep-sky/nebulae/、/astrophotography/processing/techniques/。`,
  },

  // ───────── 校准 ─────────
  {
    path: 'astrophotography/calibration/calibration-frames.mdx',
    brief: `校准帧。讲四种:暗场(Darks,校正暗电流与热噪声,同温同增益同曝光、盖盖子拍)、平场(Flats,校正暗角/灰尘暗斑,对均匀光源拍)、偏置/暗平场(Bias/Dark-flats,校正读出基底),以及各自"校正什么、怎么拍、拍几张";主帧(master frame)合成;校准在叠加流程中的位置。`,
    visual: `用表格逐一列出:校准帧 / 校正什么 / 怎么拍 / 数量。链接 /astrophotography/processing/stacking/、/astrophotography/fundamentals/snr/。`,
    source: `Darks=暗场校暗电流/热斑;Flats=平场校暗角与灰尘;Bias/Dark-flats=校读出基底。`,
  },

  // ───────── 后期处理 ─────────
  {
    path: 'astrophotography/processing/stacking.mdx',
    brief: `预处理与叠加。讲:从原始 light + 校准帧到一张干净叠加图的流程:校准→配准(register/对齐)→剔除(剔坏帧、sigma 裁剪去飞机/卫星/热点)→叠加(平均/中值/kappa-sigma)。常用软件:DeepSkyStacker(免费易上手)、Siril(免费强大、可脚本)、APP(AstroPixelProcessor)。输出32位线性图待拉伸。`,
    visual: `用 <Steps> 写叠加流程;可配 <Fig name="m42-orion"/>。
链接 /astrophotography/fundamentals/snr/、/astrophotography/calibration/calibration-frames/、/astrophotography/processing/workflow/、/astrophotography/remote-platforms/overview/。`,
  },
  {
    path: 'astrophotography/processing/workflow.mdx',
    brief: `后期处理流程(线性→非线性)。讲:叠加后的总流程:去渐变/背景抽取(GraXpert/DBE)→色彩校准(光度色校 SPCC)→拉伸(stretch,线性变非线性,GHS/Histogram)→降噪→锐化/反卷积→缩星(StarNet++/星星分离单独处理)→合成与微调。主力软件:PixInsight(专业)、Siril、Photoshop、配套工具 GraXpert/StarNet++。`,
    visual: `用 <Steps> 写"叠加图→成片"的有序流程;可配 <Fig name="m51-whirlpool"/>。
链接 /astrophotography/processing/stacking/、/astrophotography/processing/techniques/、/reference/software/。`,
  },
  {
    path: 'astrophotography/processing/techniques.mdx',
    brief: `关键后期技术(逐项详解)。讲:去渐变(removing gradients)、色彩校准、拉伸(stretch:为何线性图全黑、如何非线性提亮暗部保住高光)、反卷积(deconvolution,恢复细节)、降噪(noise reduction,与SNR的关系)、缩星(star reduction,让星云主角突出);以及行星后期(AutoStakkert 叠加 + RegiStax/小波锐化)。强调"少即是多、避免过处理"。`,
    visual: `可配 <Fig name="m51-whirlpool"/> 或 eagle-pillars。用 <Aside type="caution"> 提醒避免过度处理。
链接 /astrophotography/processing/workflow/、/astrophotography/capture/planetary/、/astrophotography/capture/narrowband/。`,
  },

  // ───────── 索引层 ─────────
  {
    path: 'reference/observatories.mdx',
    brief: `全球著名天文台(科研/地标)+ 所在半球 + 选址要素。这是"天文知识参考",与"天文摄影/远程平台"分开(消歧:中文"观测站"两义)。按北/南半球各列一张表(天文台 / 地点 / 纬度 / 招牌设备)。讲选址三要素:暗、稳、晴,以及为什么智利阿塔卡马集中了世界顶级大镜。`,
    visual: `用 <div class="cols2"> 放 <Fig name="vlt" caption="帕瑞纳尔 VLT"/> 和 <Fig name="alma" caption="ALMA 阵列"/>;可加 lasergstar。
用两张 Markdown 表格(北/南半球)。<Aside> 提示与远程平台的区别,链接 /astrophotography/remote-platforms/platforms-comparison/ 与 /astronomy/observing/hemisphere-visibility/。`,
    source: `北半球:莫纳克亚(夏威夷,+20°,Keck双10m/Subaru/Gemini North,海拔4200m);罗克德洛斯穆查丘斯(拉帕尔马,+29°,GTC 10.4m最大单口径);基特峰(亚利桑那,+32°);帕洛玛(加州,+33°,海尔200吋);阿帕奇点(新墨西哥,+33°,SDSS)。
南半球:帕瑞纳尔VLT(智利阿塔卡马,−24°,四台8.2m);ALMA(智利查南托,−23°,66台毫米波,海拔5000m);拉斯坎帕纳斯(智利,−29°,麦哲伦双6.5m+未来GMT);拉西拉(智利,−29°,ESO老牌系外行星);CTIO塞罗托洛洛(智利,−30°);赛丁泉(澳大利亚,−31°,AAT 3.9m);SAAO萨瑟兰(南非,−32°,SALT 11m)。
选址三要素:暗(低光污染)、稳(好seeing)、晴(多晴夜干燥)。阿塔卡马三者兼备。`,
  },
  {
    path: 'reference/glossary.mdx',
    brief: `术语表(中英对照)。按主题分组列出关键术语:坐标/时间(赤经RA、赤纬Dec、地平高度Alt、方位Az、恒星时、儒略日)、天体(星等、光度、视差、红移、赫罗图、光谱型)、观测(视宁度seeing、透明度、波特尔Bortle、消光、暗适应、余光视觉)、器材光学(焦距、口径、焦比f/、视场FoV、采样率、出瞳)、相机(CMOS/CCD、单色mono/彩色OSC、量子效率QE、读出噪声、增益gain、制冷)、拍摄(子帧sub、抖动dithering、导星、幸运成像、ROI)、滤镜(窄带Hα/OIII/SII、SHO/HOO、双窄)、后期(叠加stacking、配准、拉伸stretch、去渐变、反卷积、降噪、缩星、SNR)、校准(暗场Darks、平场Flats、偏置Bias)。每条一句话解释,并尽量链接到讲解该术语的页面。`,
    visual: `不配图。用带锚点的分组列表或多张小表格。多处链接到对应正文页(用上面的链接表)。`,
  },
  {
    path: 'reference/software.mdx',
    brief: `软件索引。分类列出常用工具,每个一句话用途 +(免费/付费):
规划/星图:Stellarium(免费)、SkySafari、Telescopius、Light Pollution Map、PhD2(导星)。
拍摄控制:N.I.N.A.(免费)、ASIAIR、SharpCap、FireCapture(行星)。
叠加:DeepSkyStacker(免费)、Siril(免费)、AstroPixelProcessor、AutoStakkert(行星,免费)。
后期:PixInsight(付费旗舰)、Photoshop、GraXpert(免费去渐变)、StarNet++(免费缩星)、RegiStax(行星小波,免费)。
社区/数据库:AstroBin。`,
    visual: `不配图。用分类 Markdown 表格(名称/用途/平台/免费付费)。链接 /astrophotography/processing/workflow/、/astrophotography/remote-platforms/platforms-comparison/、/astronomy/observing/planning/。`,
  },
  {
    path: 'reference/learning-paths.mdx',
    brief: `学习路径(解决"入门到精通"的引导)。把跨内容树的页面串成有序路线。给出5条路径,每条用 <Steps> 或有序列表列出依次该读的页面(带站内链接):
1) 🌱 零基础天文入门:认星座→视运动→星等→天球坐标→半球可见性→目视技巧。
2) 📷 你的第一张深空(远程版,无需器材)⭐:远程平台入门→平台对比→天体目录选目标→(SkyShare试拍)→预处理与叠加→后期流程。
3) 📷 第一张深空(自有器材版):光学基础→传感器→曝光增益→DSO拍摄→校准帧→叠加→后期。
4) 🪐 行星摄影进阶:光学(焦距/巴罗)→行星月球太阳拍摄→关键后期(AutoStakkert+小波)。
5) 🌌 窄带深空精通:信噪比→传感器(mono)→窄带成像→星云→后期关键技术。`,
    visual: `用 <CardGrid>/<Card> 概览5条路径,或每条一个 <Steps>。这页是导航中枢,务必链接齐全准确。`,
  },
  {
    path: 'reference/resources.mdx',
    brief: `外部资源。分类列出:书籍(如《The Backyard Astronomer's Guide》《Turn Left at Orion》《Making Every Photon Count》——天文摄影经典、《Annals of the Deep Sky》)、论坛社区(Cloudy Nights、AstroBin、Stargazers Lounge、国内牧夫天文等)、数据/巡天图库与计算器(SIMBAD、Aladin、SDSS、DSS、Telescopius视场计算、Light Pollution Map、Clear Outside天气)、公共版权图源(NASA 公有领域、ESO/ESA-Hubble CC BY)。说明版权署名规范(本站图片即来自这些来源)。`,
    visual: `不配图。用分类列表/表格。链接 /reference/software/、/astrophotography/remote-platforms/platforms-comparison/、/reference/catalog/。`,
  },
];

// ── 执行:每页一个 agent,直接写文件 ────────────────────────────────────────
const STATUS = {
  type: 'object',
  additionalProperties: false,
  required: ['path', 'written', 'note'],
  properties: {
    path: { type: 'string' },
    written: { type: 'boolean', description: '是否成功用 Write 覆盖了目标文件' },
    componentsUsed: { type: 'array', items: { type: 'string' } },
    imagesUsed: { type: 'array', items: { type: 'string' } },
    note: { type: 'string', description: '一句话说明写了什么 / 或失败原因' },
  },
};

function buildPrompt(p) {
  return [
    GUIDE,
    `\n# 你的任务:撰写 \`${ROOT}/${p.path}\``,
    `\n## 该页要点(必须覆盖)\n${p.brief}`,
    `\n## 视觉与链接要求\n${p.visual}`,
    p.source ? `\n## 可直接采用的事实/数据(请忠实使用,可整理成表格)\n${p.source}` : '',
    `\n现在:Read 目标文件 → 写出完整 MDX(保留 frontmatter 的 title/difficulty/pillar/sidebar,改好 description)→ Write 覆盖它。完成后用结构化输出报告。`,
  ].join('\n');
}

phase('撰写内容');
log(`开始撰写 ${PAGES.length} 个内容页…`);
const results = await parallel(
  PAGES.map((p) => () =>
    agent(buildPrompt(p), {
      label: p.path,
      phase: '撰写内容',
      schema: STATUS,
      agentType: 'general-purpose',
    })
  )
);

const ok = results.filter(Boolean).filter((r) => r.written);
const failed = results
  .map((r, i) => ({ r, p: PAGES[i] }))
  .filter(({ r }) => !r || !r.written);
log(`完成:${ok.length}/${PAGES.length} 页已写入。`);
return {
  total: PAGES.length,
  written: ok.length,
  failedPaths: failed.map(({ p }) => p.path),
  results,
};
