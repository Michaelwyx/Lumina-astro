export const meta = {
  name: 'catalog-expand',
  description: '抓取 Messier 110 + Caldwell 109 全集,产出天体目录 YAML 数据',
  phases: [{ title: '抓取目录数据' }],
};

const GUIDE = `
你在为一个天文 wiki 的「天体目录」生成结构化数据(YAML)。数据需覆盖一个完整的星表,字段统一、可被程序解析。

## 步骤
1. 用 WebFetch 抓取权威数据表(英文 Wikipedia 的星表列表页,含每个天体的编号、类型、星座、赤经、赤纬、视星等)。可多次抓取/分页。
2. 为该星表的**每一个**天体产出一条 YAML 记录(见模板)。坐标/星等以表格为准(近似值可)。
3. 用 Write 把**整份 YAML 列表**写入指定文件(只含列表,不要额外文字、不要代码围栏、不要 markdown)。只写这一个文件。

## 每条记录模板(严格字段名与缩进,2 空格)
- id: M1
  name: 蟹状星云
  nameEn: Crab Nebula
  catalog: Messier
  type: supernova-remnant
  typeLabel: 超新星遗迹
  constellation: 金牛座 Tau
  ra: 05h35m
  dec: 22
  decLabel: "+22°"
  magnitude: 8.4
  hemisphere: north
  season: winter
  difficulty: intermediate
  summary: 金牛座的超新星遗迹,1054 年超新星爆发的残骸。
  focal: 长焦 1000mm+

## 字段规则
- id:Messier 用 M1…M110;Caldwell 用 C1…C109。
- name:中文常用名;没有常用中文名时,用「星座名+类型」(如「天鹅座行星状星云」)或直接用编号。nameEn:英文常用名或 NGC/IC 编号。
- catalog:固定为 Messier 或 Caldwell。
- type(英文,用于筛选,从这些里选最接近的):galaxy / dwarf-galaxy / emission-nebula / reflection-nebula / planetary-nebula / dark-nebula / supernova-remnant / open-cluster / globular-cluster / star-cloud。
- typeLabel(中文):星系 / 矮星系 / 发射星云 / 反射星云 / 行星状星云 / 暗星云 / 超新星遗迹 / 疏散星团 / 球状星团 / 星云团(与 type 对应)。
- constellation:中文星座名 + 三字母缩写(如「天鹅座 Cyg」)。
- ra:形如 "05h35m"。dec:**整数度数**(北纬正/南纬负,如 +22 写 22,−05 写 -5)。decLabel:带符号度数字符串,**必须加引号**(如 "+22°"、"−05°";负号用 −)。
- magnitude:数字(如 8.4);未知写 null。
- hemisphere(由 dec 定):dec>20 → north;dec<-20 → south;否则 both。
- season(由 ra 定,北半球晚间最佳):ra 在 21h–翌3h → autumn;3h–9h → winter;9h–15h → spring;15h–21h → summer。
- difficulty(由 magnitude 定):mag≤6 → beginner;6<mag≤9 → intermediate;mag>9 或 null → advanced。
- summary:一句中文简介(≤30 字),点明类型+所在星座+一个特征。
- focal(推荐焦距,按类型给):大星云/疏散星团→「广角—中焦 135–600mm」;星系/球状星团→「长焦 1000mm+」;行星状星云→「长焦 1500mm+」;其它酌情。
- image:**仅当**下方映射表里有该编号时,加一行 \`  image: <key>\`;否则不要写 image 字段。

## image 映射(只有这些编号配图,其余不写 image)
{IMAGE_MAP}

## 输出
只把 YAML 列表写入文件。确保每条都有全部必填字段、缩进正确、decLabel 加引号、enum 值合法(hemisphere/season/difficulty)。不要写任何解释文字或代码围栏。
`;

const MESSIER_IMG = `M1=m1-crab, M8=m8-lagoon, M13=m13-hercules, M16=eagle-pillars, M20=m20-trifid, M27=m27-dumbbell, M31=m31-andromeda, M33=m33-triangulum, M42=m42-orion, M44=m44-beehive, M45=m45-pleiades, M51=m51-whirlpool, M57=m57-ring, M63=m63-sunflower, M64=m64-blackeye, M65=leo-triplet, M81=m81-bode, M82=m82-cigar, M97=m97-owl, M101=m101-pinwheel, M104=m104-sombrero`;
const CALDWELL_IMG = `C14=double-cluster, C20=ngc7000-namerica, C34=veil, C49=rosette, C63=helix, C65=ngc253-sculptor, C77=centaurus-a, C80=omega-cen, C92=carina, C106=47tuc`;

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['file', 'written', 'count'],
  properties: { file: { type: 'string' }, written: { type: 'boolean' }, count: { type: 'number' }, note: { type: 'string' } },
};

phase('抓取目录数据');
const results = await parallel([
  () => agent(
    GUIDE.replace('{IMAGE_MAP}', MESSIER_IMG) +
      `\n\n# 任务:生成 **Messier 全部 110 个天体**(M1–M110)的 YAML,写入 \`src/data/_messier.yaml\`。\n建议抓取 https://en.wikipedia.org/wiki/List_of_Messier_objects 的数据表。务必 110 条齐全。`,
    { label: 'messier', phase: '抓取目录数据', schema: STATUS, agentType: 'general-purpose' }
  ),
  () => agent(
    GUIDE.replace('{IMAGE_MAP}', CALDWELL_IMG) +
      `\n\n# 任务:生成 **Caldwell 全部 109 个天体**(C1–C109)的 YAML,写入 \`src/data/_caldwell.yaml\`。\n建议抓取 https://en.wikipedia.org/wiki/Caldwell_catalogue 的数据表。务必 109 条齐全。catalog 字段固定为 Caldwell。`,
    { label: 'caldwell', phase: '抓取目录数据', schema: STATUS, agentType: 'general-purpose' }
  ),
]);
return { results };
