export const meta = {
  name: 'wiki-content-v2',
  description: '逐页研究开源资料并重写为严谨、全面的技术内容(含参考链接)',
  phases: [{ title: '研究与重写' }],
};

const ROOT = 'src/content/docs';

const GUIDE = `
你在为一个严谨的中文「天文 & 天文摄影」技术 wiki 重写**一个**页面(MDX),目标是**全面、准确、可查证**。
本站基于 Astro + Starlight。读者是中文天文/天文摄影学习者。

## 流程(必须做)
1. **先检索开源资料**:用 WebSearch 搜该主题(中英文皆可),重点查英文/中文 Wikipedia 与权威天文资料;
   用 WebFetch 抓取 2–4 个最相关页面,提炼其中**完整、准确**的知识点(定义、分类、公式、单位、典型数值、原理)。
2. **整合成我们自己的内容**:不要逐句翻译或照抄;融会贯通后用中文重新组织成结构清晰的条目。
3. 用 Read 读取目标文件(保留其 frontmatter 的 title/difficulty/pillar/sidebar 不变,只重写 description),
   再用 Write **整体覆盖**该文件。只写这一个文件,不要动别的文件,不要运行构建。
4. 结尾必须有「## 参考资料」小节,列出 3–6 条来源(标题 + 链接 + 半句说明)。

## 写作规范(严谨技术风格,务必遵守)
- **客观、严谨、准确**。不使用比喻、口号、营销腔;**小节标题用中性名词短语**(如「赤道坐标系」「坐标换算」),
  不要「天体的'经纬度'」这类俏皮标题,不要感叹号。
- 术语首次出现标注英文,如「赤纬(declination, Dec)」。给出**定义、单位、取值范围、典型数值、公式**。
- **公式禁止用 LaTeX/$$**(本站不渲染);用行内代码或代码块,如 \`cos h = (sin a − sin φ sin δ)/(cos φ cos δ)\`。
- **全面**:把该主题需要了解的知识尽量写全(概念、分类、机制、与观测/摄影的关系、常见误区、数值)。不限篇幅,越完整越好。
- 多用**表格**和**列表**组织信息。**表格列数必须严格匹配**:表头 N 列,分隔行就写 N 个「---」(如 3 列写 \`| --- | --- | --- |\`)。表格前后留空行。
- 适当用 Starlight 的 Aside(\`import { Aside } from '@astrojs/starlight/components';\`)放重要提示/误区/安全警告,**标题中性**。
- 正文不写一级标题(# 由系统据 title 生成),不手写难度徽章。

## 配图(用 <Fig>;只用下面列出的 key;放在相关小节)
\`import Fig from '@/components/Fig.astro';\` → \`<Fig name="KEY" alt="..." caption="客观说明" />\`;两图并排:\`<div class="cols2"><Fig.../><Fig.../></div>\`
本页可用的图(见各页"配图"项)。**只用指定 key**,不要编造。
若某概念有交互/示意组件更合适,也可用:\`@/components/diagrams/CoordSphere.astro\`(天球坐标)、\`HemisphereViz.astro\`(交互半球可见性)。

## 站内链接(绝对路径 + 结尾斜杠,自然嵌入 1–4 处)
基础: /astronomy/foundations/celestial-coordinates/ , .../time-systems/ , .../constellations/ , .../apparent-motion/ , .../magnitude/
其它: /astronomy/observing/hemisphere-visibility/ , /astronomy/observing/conditions/ , /reference/catalog/ , /reference/glossary/ , /astronomy/deep-sky/stellar-physics/
`;

const PAGES = {
  'astronomy/foundations/celestial-coordinates': {
    title: '天球与坐标系',
    research: '天球(celestial sphere);赤道坐标系(赤经 RA / 赤纬 Dec、时角、春分点、J2000 历元与岁差导致的坐标变化);地平坐标系(地平高度 altitude / 方位 azimuth、天顶、子午线、上中天);黄道坐标系(黄经/黄纬、黄赤交角 23.44°);银道坐标系(简述);坐标换算关系与所需量(纬度 φ、地方恒星时 LST、时角 H);各坐标系适用场景。给出 RA(时分秒)与 Dec(度分秒)的记法与换算(1h=15°)。',
    figs: 'fig-equatorial(赤经赤纬/天球)、fig-altaz(地平高度方位)、fig-ecliptic(黄道与天赤道交角)。可并排展示;CoordSphere 组件可作补充。',
  },
  'astronomy/foundations/time-systems': {
    title: '时间系统',
    research: '恒星时(sidereal time,真/平恒星时、地方恒星时 LST、与时角和赤经关系 LST=H+RA)、恒星日 vs 太阳日(差约3分56秒,成因为地球公转)、视太阳时与平太阳时、均时差(equation of time,成因:轨道偏心率 + 黄赤交角,极值约 ±16/−14 分钟)与日行迹(analemma)、世界时(UT1/UTC)、协调世界时与闰秒、时区与地方时、儒略日(Julian Date)与简化儒略日(MJD)、历书时/力学时简述、TAI。说明如何由 LST + 赤经判断上中天。',
    figs: 'fig-sidereal-day(恒星日与太阳日之差)、fig-analemma(日行迹/均时差)。',
  },
  'astronomy/foundations/constellations': {
    title: '星图与星座',
    research: 'IAU 88 个现代星座与 1930 年精确边界划分;黄道十二星座与蛇夫座;拱极星座;中国古代星官体系(三垣:紫微垣/太微垣/天市垣;四象二十八宿)及与西方星座对照;恒星命名:Bayer 拜耳命名法(希腊字母+星座属格,如 α Orionis)、Flamsteed 数字编号、变星命名、专有名(IAU 恒星名);星图与星表简史(Messier、NGC/IC);星桥法(star hopping)与如何使用星图找目标;赤经赤纬网格在星图上的含义。',
    figs: 'fig-orion-chart(猎户座 IAU 官方星图,示范星座边界与亮星命名)、m45-pleiades(可选)。',
  },
  'astronomy/foundations/apparent-motion': {
    title: '天体的视运动',
    research: '周日运动(地球自转导致东升西落、绕天极旋转、周日弧、上/下中天)、周年运动(地球公转导致太阳沿黄道移动、季节星空变化)、行星的顺行与逆行(apparent retrograde motion,外行星冲日附近、几何成因)、岁差(precession,周期约 25772 年、北极星变迁、对赤道坐标的影响)、章动(nutation,周期 18.6 年)、周年视差(parallax,定义秒差距 parsec、测距原理、最近恒星约 0.77″)、自行(proper motion,巴纳德星最大约 10″/yr)、光行差(aberration)简述、视差与自行区分真实运动与视运动。',
    figs: 'fig-retrograde(火星逆行)、fig-precession(地轴岁差)、fig-parallax(周年视差/秒差距)、startrails(周日运动星轨)。',
  },
  'astronomy/foundations/magnitude': {
    title: '星等系统',
    research: '视星等(apparent magnitude)的对数定义与历史(喜帕恰斯 6 等制、Pogson 比率:每 5 等差 100 倍,单等 ≈2.512 倍);公式 m1−m2 = −2.5 log10(F1/F2);零点与参考(织女星/AB 星等系统);典型视星等锚点(太阳 −26.74、满月 −12.7、金星最亮 −4.6、天狼 −1.46、织女≈0、肉眼极限约 6、双筒约 9–10、大镜与长曝可达 20+);绝对星等(absolute magnitude,10 秒差距处定义)与距离模数 m−M=5log10(d/10);光度(luminosity)、热星等与热改正;颜色指数(B−V);面亮度(surface brightness,mag/arcsec²)及其对深空目视/摄影的意义(展源不因口径变亮)。',
    figs: 'fig-magnitude(视星等/绝对星等示意)、m45-pleiades 或 m31-andromeda(可选)。',
  },

  // ───────── 太阳系 ─────────
  'astronomy/solar-system/sun': {
    title: '太阳',
    research: '基本参数(质量、半径、表面温度约 5778K、光度);内部结构(核心/辐射区/对流区)与外层(光球 photosphere、色球 chromosphere、日冕 corona、过渡区);能量来源(质子-质子链核聚变);太阳黑子(sunspots,本影/半影、温度较低、磁场)、11 年太阳活动周期(蝴蝶图、太阳极大/极小)、太阳自转(较差自转);日珥(prominence)、耀斑(flare)、日冕物质抛射(CME)、太阳风与空间天气、极光;光谱与夫琅禾费谱线。',
    figs: 'fig-sun-structure(太阳分层结构)、fig-sunspot-cycle(黑子数/蝴蝶图)、sun(SDO 实拍)。',
    extra: '必须用 <Aside type="danger"> 强调太阳观测安全:绝不可裸眼或未加专用太阳滤镜的器材直视太阳。',
  },
  'astronomy/solar-system/moon': {
    title: '月球',
    research: '基本参数与轨道(平均距离约 38.4 万 km、潮汐锁定);月相成因与朔望月(29.53 天)、月相序列;天平动(libration,经度/纬度/周日天平动,可见约 59% 月面);月面地形(月海 maria、月陆、环形山、辐射纹、月溪);月食(本影/半影、血月成因)与日食区别;超级月亮(近地点);月龄/月光对深空摄影的影响(避开满月);潮汐与地月系统。',
    figs: 'fig-moon-phases(月相图)、moon(满月实拍)。',
  },
  'astronomy/solar-system/planets': {
    title: '行星',
    research: '类地行星(水金地火)与巨行星(木土天海)对比(成分、密度、卫星、环);内行星的大距(elongation)、相位与凌日;外行星的冲(opposition,最佳观测)、合(conjunction)、留与逆行;会合周期(synodic period);各行星观测看点(水星凌日、金星相位与盈亏、火星冲与极冠、木星条带/大红斑/伽利略卫星、土星环与卡西尼缝、天王星/海王星);行星亮度与视直径变化;行星合月、行星连珠。',
    figs: 'fig-solar-system(行星大小比较)、saturn、jupiter(并排 cols2)。',
  },
  'astronomy/solar-system/small-bodies': {
    title: '矮行星 · 彗星 · 流星',
    research: '矮行星定义(IAU 2006:谷神星、冥王星、阋神星、妊神星、鸟神星);小行星带与主要小行星;近地天体(NEO)与撞击风险;柯伊伯带(Kuiper belt)与离散盘、奥尔特云(Oort cloud);彗星结构(彗核 nucleus、彗发 coma、离子尾与尘埃尾、氢云)、轨道(短周期/长周期)、著名彗星与回归;流星体/流星/陨石区分、流星雨(辐射点、母彗星、ZHR;英仙座/双子座/象限仪座等)、火流星;黄道光与对日照。',
    figs: 'fig-comet-structure(彗星结构与彗尾)、fig-meteor-radiant(流星雨辐射点)、fig-solar-system(可选)。',
  },

  // ───────── 恒星与深空 ─────────
  'astronomy/deep-sky/stellar-physics': {
    title: '恒星物理与赫罗图',
    research: '恒星基本物理量(质量、半径、光度、有效温度、金属丰度);光谱分类 OBAFGKM(温度由高到低、颜色由蓝到红、特征谱线)与次型 0–9、光度型 I–V(超巨星到矮星);赫罗图(H-R diagram,横轴温度/光谱型、纵轴光度/绝对星等、主序/巨星支/水平支/白矮星);恒星演化(原恒星→主序→红巨星/超巨星→白矮星 或 超新星→中子星/黑洞,按质量分岔);核合成(氢燃烧、氦闪、CNO 循环、重元素来源);质光关系、主序寿命。',
    figs: 'fig-hr-real(含真实恒星的赫罗图)、fig-stellar-evolution(恒星演化路径)。HRDiagram 组件可作补充示意。',
  },
  'astronomy/deep-sky/variable-multiple-stars': {
    title: '双星 · 聚星 · 变星',
    research: '光学双星 vs 物理双星(目视双星、分光双星、食双星、天体测量双星);聚星与多星系统;双星定轨与测质量;变星分类:几何变星(食变星 Algol 型、椭球);脉动变星(造父变星 Cepheid 的周光关系作标准烛光、天琴 RR、长周期 Mira、半规则);爆发/激变变星(新星、再发新星、矮新星);超新星(Ia 型热核、II/Ib/Ic 型核坍缩)及遗迹;变星命名与光变曲线、星等-相位。',
    figs: 'fig-eclipsing-binary(光变曲线)、m13-hercules(可选)。',
  },
  'astronomy/deep-sky/star-clusters': {
    title: '星团',
    research: '疏散星团(open cluster,年轻、成员几十到几千、位于银盘、化学同源,如昴星团/毕星团/蜂巢/双星团)vs 球状星团(globular cluster,年老、成员数十万、球对称、分布于银晕,如 M13/ω 星团/47 Tuc);星协(OB/T 星协);赫罗图主序拐点(turnoff)定年龄;作为距离阶梯(主序拟合、RR 变星);成员判定(自行/视向速度);拍摄要点(疏散用中焦、球状用长焦+控制星点)。',
    figs: 'cols2 并排 m45-pleiades(疏散) 与 omega-cen(球状);可加 m13-hercules、47tuc。',
  },
  'astronomy/deep-sky/nebulae': {
    title: '星云',
    research: '星际介质与星云分类:发射星云(emission/HII 区,氢被恒星紫外电离后复合发出 Hα 等谱线,如 M42/礁湖/北美);反射星云(reflection,尘埃散射蓝光,如昴星团周围);行星状星云(planetary,中小质量恒星晚期抛射电离气壳,如环状 M57/哑铃);暗星云(dark,致密尘埃遮挡背景,如马头/煤袋);超新星遗迹(SNR,如蟹状/面纱);发射机制与谱线(Hα/OIII/SII)、对应窄带滤镜与拍摄要点。',
    figs: 'm42-orion(发射)、m57-ring(行星状)、horsehead(暗)、eagle-pillars(恒星形成);用两组 cols2。',
  },
  'astronomy/deep-sky/galaxies': {
    title: '星系',
    research: '星系类型与哈勃序列/音叉图(椭圆 E0–E7、透镜 S0、旋涡 Sa–Sc、棒旋 SBa–SBc、不规则 Irr);星系结构(核球、盘、旋臂、晕、暗物质晕);银河系结构与本星系群(银河、仙女 M31、三角 M33、麦哲伦云等);活动星系核(AGN)、塞弗特星系、射电星系、类星体(quasar)、星暴星系;星系群/星系团/超星系团与宇宙网;星系旋转曲线与暗物质证据;红移与哈勃定律(引出宇宙学);拍摄要点(多为小而暗、需长焦+暗空+长总曝光)。',
    figs: 'fig-tuning-fork(哈勃分类音叉图)、m31-andromeda、m51-whirlpool、m104-sombrero、lmc;用 cols2。',
  },

  // ───────── 宇宙学 ─────────
  'astronomy/cosmology/overview': {
    title: '宇宙学概览',
    research: '宇宙学原理(均匀各向同性);大尺度结构(星系团、纤维、空洞、宇宙网、斯隆长城);哈勃-勒梅特定律(Hubble–Lemaître law,v=H0 D、H0≈67–73 km/s/Mpc 与哈勃张力)与红移(宇宙学红移 vs 多普勒);宇宙微波背景(CMB,2.725K、各向异性、复合时期);大爆炸模型与时间线(暴胀、太初核合成、复合/最后散射、黑暗时代、再电离、恒星与星系形成);暗物质(旋转曲线、引力透镜、子弹星系团)与暗能量(Ia 超新星、加速膨胀);ΛCDM 模型与宇宙组成比例;宇宙年龄约 138 亿年、可观测宇宙尺度。',
    figs: 'fig-cmb(微波背景全天图)、fig-hubble-law(红移-距离)、fig-cosmic-timeline(宇宙历史时间线);m31 可选。',
  },

  // ───────── 观测天文学 ─────────
  'astronomy/observing/conditions': {
    title: '大气与观测条件',
    research: '视宁度(seeing,大气湍流导致星点抖动/弥散,Fried 参数 r0、角秒度量、对行星与高分辨影响最大)与透明度(transparency,气溶胶/云/水汽对暗弱展源影响);区分二者;光污染与波特尔暗空分级(Bortle 1–9)、天空亮度(mag/arcsec²、SQM);大气消光与气团(airmass,地平高度越低消光越强、地平折射);月光、湿度与露水/结露、风、冻结;海拔与喷流;什么条件适合拍什么(行星看 seeing、深空看透明度与暗空)。',
    figs: 'BortleScale 组件(暗空分级)、fig-extinction(气团/消光)、startrails(可选)。',
  },
  'astronomy/observing/planning': {
    title: '选址与观测计划',
    research: '选址要素(暗、稳 seeing、晴、地平开阔、湿度低、可达、海拔);光污染地图(Light Pollution Map、SQM 数据);天气与云图、晴空钟(Clear Sky Chart/Clear Outside)、喷流预报;规划工具(Stellarium、SkySafari、Telescopius、Cartes du Ciel)查可见性与上中天时刻;月相与晨昏蒙影(民用/航海/天文昏影);制定目标清单(高度优先、过子午线翻转 meridian flip);记录与复盘。',
    figs: 'vlt(选址典范)、milkyway(可选)。用 <Steps> 写"规划一晚"。',
  },
  'astronomy/observing/visual-techniques': {
    title: '目视观测技巧',
    research: '暗适应(dark adaptation,视杆细胞、约 20–40 分钟、红光护眼、避免强光);余光视觉(averted vision,利用视杆密集区看暗弱目标);双筒望远镜(规格 7x50/10x50、出瞳、稳定)与天文望远镜的取舍与新手建议;放大率=物镜焦距/目镜焦距、出瞳=口径/放大率、真实视场=表观视场/放大率;选目镜与滤镜(UHC/OIII 目视滤镜);寻星(星桥法、寻星镜、Telrad);目视记录与素描;影响目视的因素(口径、视宁、光污染)。',
    figs: 'm13-hercules 或 moon(目视目标示例)。',
  },

  // ───────── 远程平台(用户要求:补全其它平台为子小节)─────────
  'astrophotography/remote-platforms/overview': {
    title: '远程成像入门',
    research: '远程成像(remote imaging)定义:租用架设在优质暗空、由专业团队维护的远程望远镜,通过网络选目标、排程拍摄、下载数据(FITS);适合无器材/无暗空/时间有限者;优势(省去赤道仪/极轴/天气/光污染/大额投入、可用南北半球与顶级台址)与局限(按时间/按夜计费、目标排队、缺少亲手操作的学习);两种模式(实时控制 vs 委托/排程);完整流程:选平台→选目标→排程/拍摄→获取原始数据→校准叠加后期。',
    figs: 'm42-orion 或 vlt;用 <Steps> 写完整流程。重点链接 platforms-comparison、/reference/catalog/、/astrophotography/processing/stacking/。',
  },
  'astrophotography/remote-platforms/platforms-comparison': {
    title: '远程平台对比',
    research: '研究并整理各主流远程成像/图库平台,**每个平台一个子小节(###)**,说明类别、设备、半球/台址、计费模式、适合人群、优缺点。必须涵盖:AstroBin(图床+社区+器材/天体数据库,不出租望远镜;Free/Premium/Ultimate)、iTelescope(老牌远程网络,澳/西/美多镜、双半球、月订阅+机时)、SkyShare Astro(按夜包干、550mm 广角、Bortle 1、交付 FITS+天气保证)、Telescope Live(智利/西班牙/澳洲多镜、订阅+One-Click/高级请求、可下载数据集)、Slooh(面向教育与新手、在线社区、特内里费/智利)、ChileScope(智利、大口径、亚弧秒视宁)、Deep Sky Chile(智利、托管+远程)、Insight Observatory(教育+远程)、Sky-Watcher/ZWO 类自建无关的排除。最后给一张总览对比表与"先用哪个"的建议。',
    figs: '无强制配图;可用表格为主。可链接 /reference/catalog/、/astrophotography/processing/stacking/。',
    extra: '这是用户特别要求补全的页:务必把上述平台**逐一作为 ### 子小节**写全,并补一张总览对比表(列数严格匹配)。',
  },

  // ───────── 摄影基础 ─────────
  'astrophotography/fundamentals/optics': {
    title: '光学基础',
    research: '焦距(focal length,决定放大率与视场)、口径(aperture,集光力 ∝ 面积、分辨率 ∝ 口径,道斯极限 Dawes/瑞利判据)、焦比(focal ratio f/=焦距/口径,影响展源面亮度与"曝光速度");视场(FoV=传感器尺寸/焦距);采样率(arcsec/px = 206.265 × 像元(µm)/焦距(mm))与过采样/欠采样、与视宁度匹配;望远镜类型(折射 APO/ED、牛顿反射、施密特-卡塞格林 SCT、RC、马克苏托夫)及像差(色差/彗差/场曲)与改正镜(平场/减焦);焦距区间与适合目标。',
    figs: 'FocalFOV 组件、fig-telescopes(望远镜光学结构)。用表格列焦距区间→目标。',
  },
  'astrophotography/fundamentals/exposure': {
    title: '曝光、增益与 ISO',
    research: '天文曝光与白天摄影差异(焦比固定、长时间积分);单张曝光时长的限制(跟踪/导星精度、光害背景饱和、饱和星点)与"多张短曝叠加 vs 一张长曝"的权衡;增益(gain)与 ISO 的关系、单位增益(unity gain)、动态范围与读出噪声随增益变化;背景受限曝光(sky-limited,单张需让背景噪声压过读出噪声);直方图判读(背景峰值位置)、ADU 与位深;子帧数量与总积分时间;ISO 不变性(ISO-invariance)。',
    figs: '可用一个 <Capture> 示例展示典型参数(如 60×300s)。无强制示意图。',
  },
  'astrophotography/fundamentals/sensors': {
    title: '传感器',
    research: 'CMOS vs CCD(原理、当前 CMOS 主流的原因);单色(mono)+滤镜轮 vs 彩色(OSC,拜耳阵列 Bayer + 去马赛克)取舍;量子效率(QE)、读出噪声(read noise)、暗电流(dark current)与制冷(冷冻相机、ΔT);满阱容量(full well)与动态范围;像元尺寸(与焦距决定采样率)、像元合并(binning);坏点/热点、固定模式噪声;ADC 位深与增益模式(HCG/LCG);专用天文相机 vs 改机单反/微单 vs 行星相机的区别。',
    figs: 'fig-bayer(拜耳滤镜阵列)。用表格对比 mono vs OSC、CMOS vs CCD。',
  },
  'astrophotography/fundamentals/snr': {
    title: '噪声与信噪比',
    research: '信号与噪声来源(光子散粒噪声 shot noise ∝ √信号、读出噪声、暗电流噪声、天光背景噪声、热噪声);信噪比(SNR)定义与对成片细腻度的决定作用;叠加 N 张:随机噪声按 √N 下降、SNR ∝ √N(16 张≈4 倍、回报递减);总积分时间是关键;为何多子帧 + 抖动(dithering)消除固定模式噪声/walking noise;暗空与窄带如何提升 SNR;子帧时长与读出噪声的关系。',
    figs: 'SNRChart 组件(SNR∝√N 曲线)。',
  },

  // ───────── 拍摄技术 ─────────
  'astrophotography/capture/widefield': {
    title: '星野与广角',
    research: '器材(相机+广角/标准镜头+三脚架,可选星野赤道仪如 Star Adventurer/GTi);固定三脚架的星点拖线极限:500 法则与更精确的 NPF 规则(考虑像元、光圈、赤纬);曝光设置(高 ISO、大光圈、白平衡、RAW);银河季节与方位、月相与光污染;构图与前景、光绘;堆叠降噪(多张平均)、星轨(连续拍摄堆叠)、延时;后期(去光害渐变、提银河)。',
    figs: 'cols2 并排 milkyway 与 startrails。',
  },
  'astrophotography/capture/dso-basics': {
    title: '深空 DSO 拍摄',
    research: '长曝光 + 精确跟踪/导星(主镜导星 vs 离轴导星 OAG、导星软件 PHD2、RMS 误差);子帧策略(多张中等时长 light、总积分时间);抖动(dithering)与帧间偏移消 walking noise;校准帧配套(暗/平/偏置);合焦(巴氏面具、HFR/FWHM)、构图与板解(plate solving)、过子午线翻转;一晚典型流程与序列自动化(N.I.N.A./ASIAIR);无器材可走远程平台。',
    figs: 'Capture 示例(name="m31-andromeda" 给出合理参数);用 <Steps> 写流程。',
  },
  'astrophotography/capture/planetary': {
    title: '行星 · 月球 · 太阳',
    research: '与深空相反:用行星相机录高帧率视频、抽帧叠加;幸运成像(lucky imaging)挑最清晰帧对抗 seeing;ROI 裁切提帧率、增益/曝光设置;巴罗镜增焦到合适采样、大气色散改正器(ADC);月球(地形/月面摄影/月相)与太阳(需专用太阳滤镜或 Hα,安全第一);自转去除(WinJUPOS derotation);后期接 AutoStakkert(叠加)+ RegiStax/小波锐化。',
    figs: 'cols2 并排 jupiter 与 saturn;moon 可加。必须用 <Aside type="danger"> 提示太阳观测安全。',
  },
  'astrophotography/capture/narrowband': {
    title: '窄带成像',
    research: '窄带滤镜(narrowband:Hα 656nm、OIII 500.7nm、SII 672nm,带宽 3–7nm)只透特定发射线,**强力抑制光污染**、突出电离气体结构、可在月夜/城市拍发射星云与超新星遗迹;调色板:SHO(哈勃色,SII→R、Hα→G、OIII→B)、HOO(Hα→R、OIII→G/B,更接近自然色);双窄带/三窄带滤镜让 OSC 也能玩;各通道曝光配比与合成、星点处理(窄带星点偏色);窄带不适合反射星云与星系连续谱。',
    figs: 'SHOPalette 组件、fig-emission-lines(发射线/光谱)、eagle-pillars 或 carina。',
  },

  // ───────── 校准 ─────────
  'astrophotography/calibration/calibration-frames': {
    title: '校准帧',
    research: '校准帧原理与四类:暗场(Darks,校正暗电流与热噪声/热点,需同温/同增益/同曝光、盖光);平场(Flats,校正暗角 vignetting、灰尘暗斑、光路不均,对均匀光源拍、目标 ADU 约半满阱);偏置/零秒(Bias/Offset,读出基底)与暗平场(Dark-flats,用于平场的偏置);主帧(master)合成(中值/平均);校准数学(light−dark)/(flat−biasflat) 的标准化;各帧拍摄数量建议;在叠加流程中的位置。',
    figs: '无强制配图;用表格逐一列出 校准帧/校正什么/怎么拍/数量。',
  },

  // ───────── 后期处理 ─────────
  'astrophotography/processing/stacking': {
    title: '预处理与叠加',
    research: '从原始 light + 校准帧到一张干净线性叠加图:校准(减暗/除平场)→ 去马赛克(OSC)→ 配准/对齐(star registration)→ 帧质量筛选 → 像素剔除(sigma/kappa-sigma clipping 去飞机/卫星/宇宙线/热点)→ 积分(平均/中值/加权);抖动配合剔除;Drizzle 与超分辨;常用软件(DeepSkyStacker、Siril 含脚本、AstroPixelProcessor、PixInsight WBPP);输出 32 位线性图待拉伸。',
    figs: 'm42-orion 或 Capture 示例;用 <Steps> 写叠加流程。',
  },
  'astrophotography/processing/workflow': {
    title: '后期处理流程',
    research: '叠加后线性→非线性总流程:裁剪与背景中和 → 去渐变/背景抽取(DBE/ABE/GraXpert)→ 光谱光度色彩校准(SPCC/PCC)→ 去噪(线性阶段)→ 反卷积/锐化(BlurXTerminator)→ 拉伸(stretch:GHS/Histogram/STF,线性变非线性)→ 缩星与星点分离(StarNet++/StarXTerminator)→ 局部对比/HDR/饱和 → 最终降噪与重组;主力软件(PixInsight、Siril、Photoshop、GraXpert、StarNet);窄带合成(SHO/HOO);避免过处理。',
    figs: 'm51-whirlpool 或 eagle-pillars;用 <Steps> 写流程。',
  },
  'astrophotography/processing/techniques': {
    title: '关键后期技术',
    research: '逐项详解:去渐变(梯度来源:光污染/月光/暗角;DBE/ABE 取样);色彩校准(基于恒星光度/白平衡);拉伸(为何线性图近黑、非线性拉伸提暗部保高光、masked stretch/GHS);反卷积(deconvolution,恢复被 seeing 模糊的细节、需 PSF 与星点掩膜);降噪(与 SNR 的关系、多尺度、AI 降噪);缩星/星点处理(star reduction、分离星点单独处理);锐化与局部对比(小波、HDRMT);行星后期(AutoStakkert 叠加 + RegiStax/AstroSurface 小波);避免过度处理(伪影、暗环、缩星过度)。',
    figs: 'eagle-pillars 或 m51-whirlpool;用 <Aside type="caution"> 提示避免过处理。',
  },

  // ───────── 索引层 ─────────
  'reference/observatories': {
    title: '著名天文台',
    research: '全球主要地面光学/射电天文台(科研地标),按北/南半球分别列表(名称/地点/纬度/海拔/招牌设备)。北半球:莫纳克亚(夏威夷,Keck 双 10m、Subaru、Gemini North)、拉帕尔马罗克天文台(GTC 10.4m)、基特峰、帕洛玛(海尔 5m)、阿帕奇点(SDSS)。南半球:帕瑞纳尔(VLT 四台 8.2m、未来 ELT 39m)、ALMA(查南托 66 天线毫米波)、拉斯坎帕纳斯(麦哲伦双 6.5m、未来 GMT)、拉西拉(ESO)、CTIO、赛丁泉(AAT)、SAAO(SALT 11m)。选址三要素(暗/稳/晴)与阿塔卡马为何集中顶级大镜;与"远程成像平台"的区别(消歧)。',
    figs: 'cols2 并排 vlt 与 alma;lasergstar 可加。用两张表(北/南半球,列数严格匹配)。链接 /astrophotography/remote-platforms/platforms-comparison/、/astronomy/observing/hemisphere-visibility/。',
  },
  'reference/glossary': {
    title: '术语表',
    research: '编纂一份较完整的中英对照天文/天文摄影术语表,按主题分组(坐标与时间、天体与物理量、观测条件、光学与器材、相机与传感器、拍摄、滤镜、后期、校准、宇宙学)。每条:中文(英文 缩写)— 一句话定义,并尽量链接到讲解该术语的正文页。覆盖正文出现的主要术语。',
    figs: '不配图。用分组小标题 + 表格或紧凑列表(表格列数匹配)。多处链接正文页。',
  },
  'reference/software': {
    title: '软件索引',
    research: '分类整理常用软件,每项:名称 — 用途 —(免费/付费)— 平台。类别:规划/星图(Stellarium、SkySafari、Cartes du Ciel、Telescopius、Light Pollution Map、Clear Outside);拍摄控制与导星(N.I.N.A.、ASIAIR、SharpCap、APT、PHD2、FireCapture);叠加(DeepSkyStacker、Siril、AstroPixelProcessor、AutoStakkert、PixInsight WBPP);后期(PixInsight、Photoshop、GraXpert、StarNet++/StarXTerminator、BlurXTerminator、RegiStax、AstroSurface);社区/数据库(AstroBin、Telescopius)。',
    figs: '不配图。每类一张表(名称/用途/平台/免费付费,列数匹配)。链接 processing/workflow、remote-platforms/platforms-comparison、observing/planning。',
  },
  'reference/learning-paths': {
    title: '学习路径',
    research: '把跨内容树的页面串成有序学习路线(导航中枢)。给出 5 条路径,每条用 <Steps> 或有序列表列出依次阅读的页面(带站内链接):1) 零基础天文入门(认星座→视运动→星等→天球坐标→半球可见性→目视技巧);2) 第一张深空(远程版,无器材:远程平台入门→平台对比→天体目录选目标→预处理叠加→后期流程);3) 第一张深空(自有器材:光学→传感器→曝光增益→DSO 拍摄→校准帧→叠加→后期);4) 行星摄影进阶(光学/巴罗→行星月球太阳→关键后期 AutoStakkert+小波);5) 窄带深空精通(信噪比→传感器 mono→窄带成像→星云→后期关键技术)。',
    figs: '可用 <CardGrid>/<Card> 概览 5 条路径,每条配 <Steps>。链接务必齐全准确。',
  },
  'reference/resources': {
    title: '外部资源',
    research: '分类整理优质外部资源:书籍(《Turn Left at Orion》《The Backyard Astronomer’s Guide》《Making Every Photon Count》《Annals of the Deep Sky》《Astrophotography》by Thierry Legault 等);论坛/社区(Cloudy Nights、Stargazers Lounge、AstroBin、r/astrophotography、牧夫天文论坛);数据库/巡天/计算器(SIMBAD、Aladin、SDSS、DSS、Telescopius 视场计算、Light Pollution Map、Clear Outside、Stellarium Web、heavens-above 过境预报);公共版权图源(NASA 公有领域、ESO/ESA-Hubble CC BY、APOD);软件官网入口。给出链接与署名规范说明。',
    figs: '不配图。分类列表/表格。链接 /reference/software/、/reference/catalog/、/astrophotography/remote-platforms/platforms-comparison/。',
  },
};

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['path', 'written', 'sources', 'note'],
  properties: {
    path: { type: 'string' },
    written: { type: 'boolean' },
    sources: { type: 'array', items: { type: 'string' }, description: '实际引用的参考链接' },
    figsUsed: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
};

// args 可传要处理的 path 列表;不传则处理全部已登记页面
const targets = Array.isArray(args) && args.length ? args : Object.keys(PAGES);

function prompt(path) {
  const p = PAGES[path];
  return [
    GUIDE,
    `\n# 任务:研究并重写 \`${ROOT}/${path}.mdx\`(标题:${p.title})`,
    `\n## 需要覆盖/查证的知识点(尽量全面)\n${p.research}`,
    `\n## 本页可用配图\n${p.figs}`,
    `\n步骤:先 WebSearch + WebFetch 查证上面的知识点(至少抓 2 个权威来源,优先 Wikipedia 中/英)→ 整合 → Read 目标文件 → Write 覆盖(保留 frontmatter,重写 description,正文全面严谨,结尾加「## 参考资料」)→ 结构化报告。`,
  ].join('\n');
}

phase('研究与重写');
log(`处理 ${targets.length} 页:${targets.map((t) => t.split('/').pop()).join(', ')}`);
const results = await parallel(
  targets.map((path) => () =>
    agent(prompt(path), { label: path.split('/').slice(-2).join('/'), phase: '研究与重写', schema: STATUS, agentType: 'general-purpose' })
  )
);
const ok = results.filter(Boolean).filter((r) => r.written);
return { processed: targets.length, written: ok.length, results };
