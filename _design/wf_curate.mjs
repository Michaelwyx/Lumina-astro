export const meta = {
  name: 'catalog-curate',
  description: '精选「视觉效果好的热门天文摄影目标」,带中文介绍与配图检索词,写入 JSON',
  phases: [{ title: '精选目标' }],
};

const GUIDE = `
你在为一个天文 wiki 精选**视觉效果出众、业余天文摄影最受欢迎**的深空目标。参考 AstroBin、Telescope Live、NASA APOD 等收藏里反复出现的"明星目标":
明亮/大视场的发射星云、彩色旋涡星系、上镜的行星状星云与超新星遗迹、漂亮的星团等。
**避免**那些拍出来只是"灰白一坨散点"或暗弱无细节的冷门小目标(很多暗弱小球状星团、小而平淡的椭圆星系不要)。

## 产出
用 Write 把一个 **JSON 数组**写入指定文件(只含 JSON,无其它文字、无代码围栏)。每个元素一个目标,字段如下:
{
  "id": "M42",                      // 编号:Messier 用 M#、NGC 用 NGC####、IC 用 IC####、Caldwell 可用 C#;务必唯一
  "name": "猎户座大星云",            // 中文常用名
  "nameEn": "Orion Nebula",         // 英文常用名
  "catalog": "Messier",             // Messier / NGC / IC / Caldwell / Other
  "type": "emission-nebula",        // galaxy/dwarf-galaxy/emission-nebula/reflection-nebula/planetary-nebula/dark-nebula/supernova-remnant/open-cluster/globular-cluster/star-cloud 之一
  "typeLabel": "发射星云",
  "constellation": "猎户座 Ori",
  "ra": "05h35m",
  "dec": -5,                         // 整数度
  "decLabel": "−05°",
  "magnitude": 4.0,                  // 数字或 null
  "hemisphere": "both",              // dec>20→north, dec<-20→south, 否则 both
  "season": "winter",                // ra 21h–3h→autumn, 3h–9h→winter, 9h–15h→spring, 15h–21h→summer
  "difficulty": "beginner",          // mag<=6→beginner, 6–9→intermediate, >9或null→advanced
  "focal": "中焦 400–800mm",
  "summary": "全天最亮的弥漫星云,新手首选。",   // 卡片用,≤24字
  "description": "猎户座大星云是距地球约 1340 光年的恒星诞生地……(2–4 句,介绍它是什么、有何特征、拍摄/观测看点;可联网核对距离/星等等)",
  "imageQuery": "Orion Nebula Hubble"   // 一个能在 Wikimedia Commons 搜到该天体高质量【彩色】照片的英文检索词(用天体名 + 可加 Hubble/ESO/nebula/galaxy)
}

## 要点
- 只收录**确有漂亮彩色照片**的目标(发射/反射星云、彩色星系、亮行星状星云、面纱/蟹状等遗迹、昴星团/双星团/ω星团/杜鹃47/M13 等上镜星团、麦哲伦云等)。
- description 要**有信息量**(距离、尺度、为何上镜、拍摄要点之一),可联网搜索核对关键数据,但不要堆砌。
- imageQuery 要尽量能搜到该天体本身的彩色实拍(不是星图/示意图)。
- 数据(坐标/星等/类型)以 Wikipedia/SIMBAD 为准,可 WebFetch 核对。
- hemisphere/season/difficulty 按上面规则由 dec/ra/magnitude 推出。
`;

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['file', 'written', 'count'],
  properties: { file: { type: 'string' }, written: { type: 'boolean' }, count: { type: 'number' }, note: { type: 'string' } },
};

phase('精选目标');
const results = await parallel([
  () => agent(
    GUIDE + `\n# 任务:精选 **星云、星团、银河系内目标** 共约 70–85 个(发射星云、反射星云、暗星云、行星状星云、超新星遗迹、疏散/球状星团、麦哲伦云等)。优先最上镜最热门的。写入 \`src/data/_targets_neb.json\`。`,
    { label: 'nebulae+clusters', phase: '精选目标', schema: STATUS, agentType: 'general-purpose' }
  ),
  () => agent(
    GUIDE + `\n# 任务:精选 **星系** 共约 45–60 个(旋涡、棒旋、星暴、相互作用星系、著名星系群如狮子三重奏/马卡良链/史蒂芬五重奏、近邻 M31/M33/M81/82/NGC253/Cen A、南天 M83 等)。只收录有漂亮彩色照片的。写入 \`src/data/_targets_gal.json\`。`,
    { label: 'galaxies', phase: '精选目标', schema: STATUS, agentType: 'general-purpose' }
  ),
]);
return { results };
