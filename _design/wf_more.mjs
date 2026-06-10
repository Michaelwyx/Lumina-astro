export const meta = {
  name: 'catalog-more',
  description: '再精选一批好看的热门天文摄影目标(避开已有),含中英介绍与配图检索词',
  phases: [{ title: '新增精选' }],
};

const EXISTING = `B33,C99,IC434,LMC,SMC,C49,C92,IC405,IC410,IC1396,IC1805,IC5070,M8,M16,M17,M20,M42,M43,NGC281,NGC1499,NGC2024,NGC2174,NGC3372,NGC6188,NGC6334,NGC6357,NGC6820,NGC7000,NGC7380,Sh2-101,Sh2-155,M31,M33,M49,M51,M63,M64,M65,M74,M77,M81,M82,M83,M101,M104,M106,M108,NGC55,NGC247,NGC253,NGC891,NGC925,NGC1097,NGC1232,NGC1300,NGC1365,NGC2403,NGC2841,NGC3190,NGC3628,NGC4038,NGC4038B,NGC4216,NGC4486,NGC4490,NGC4565,NGC5194,NGC6744,NGC6946,NGC7320,NGC7331,C80,C106,M3,M13,M15,M22,C13,C14,C50,C94,M6,M7,M37,M44,M45,NGC2244,M27,M57,M97,NGC40,NGC6302,NGC6826,NGC7293,M78,Sh2-279,C33,C34,IC443,M1,NGC6979`;

const GUIDE = `
你在为天文 wiki **再精选一批视觉效果出众、业余天文摄影热门**的深空目标(参考 AstroBin / Telescope Live / APOD 反复出现的明星目标)。
**只收录确有漂亮彩色照片**的目标,避免暗弱平淡、拍出来只是灰白散点的冷门小目标。

**不要重复**以下已收录的天体(按编号去重):
${EXISTING}

## 产出
用 Write 把一个 **JSON 数组**写入指定文件(只含 JSON,无围栏无其它文字)。每个元素字段:
{
  "id": "NGC6888",                 // 唯一编号;Messier=M#, NGC=NGC####, IC=IC####, Caldwell=C#, Sharpless=Sh2-###, Barnard=B##; 不得与上面已有重复
  "name": "新月星云",
  "nameEn": "Crescent Nebula",
  "catalog": "NGC",                // Messier/NGC/IC/Caldwell/Other
  "type": "emission-nebula",       // galaxy/dwarf-galaxy/emission-nebula/reflection-nebula/planetary-nebula/dark-nebula/supernova-remnant/open-cluster/globular-cluster/star-cloud
  "typeLabel": "发射星云",
  "constellation": "天鹅座 Cyg",
  "ra": "20h12m",
  "dec": 38,                        // 整数度
  "decLabel": "+38°",
  "magnitude": 7.4,                 // 数字或 null
  "hemisphere": "north",            // dec>20→north, dec<-20→south, 否则 both
  "season": "summer",               // ra 21h–3h→autumn,3h–9h→winter,9h–15h→spring,15h–21h→summer
  "difficulty": "intermediate",     // mag<=6→beginner, 6–9→intermediate, >9或null→advanced
  "focal": "中—长焦 700–1200mm",
  "summary": "天鹅座的沃尔夫-拉叶星风泡。",        // 中文卡片简介,≤24字
  "summaryEn": "A Wolf–Rayet wind bubble in Cygnus.",  // 英文卡片简介,≤90字符
  "description": "新月星云是……(中文 4–6 句:是什么、距离尺度、特征、拍摄看点;可联网核对)",
  "descriptionEn": "The Crescent Nebula is …… (English, 4–6 sentences, matching description)",
  "imageQuery": "Crescent Nebula NGC 6888"   // 能在 Wikimedia Commons 搜到该天体高质量【彩色】照片的英文检索词
}

## 要点
- 目标数量约 **50–70 个**,覆盖:更多发射星云(蝙蝠/乌贼 Sh2-129、海鸥 IC2177、奔跑的鸡 IC2944、对虾 IC4628、鹈鹕 IC5070 已排除则换、圣诞树/锥状 NGC2264、气泡 NGC7635、巫师 NGC7380 已排除则换、加州 NGC1499 已排除、新月 NGC6888、郁金香 Sh2-101 已排除、天鹅环、蜘蛛 30 Dor)、反射星云(鸢尾 NGC7023、马卡良 IC2118 女巫头、NGC1333、跑人 NGC1977)、行星状星云(土星 NGC7009、木魂 NGC3242、爱斯基摩 NGC2392、猫眼 NGC6543、小哑铃 M76、螺旋已排除、亥姆赫兹)、星系(鲸鱼 NGC4631、裂片 NGC5907、M94/M95/M96/M88/M90/M85/M64已排除、NGC3521、Arp273、车轮 ESO/NGC、M77已排除)、星团(野鸭 M11、M35/M36/M38、ET/猫头鹰 NGC457、M52、M67、M4/M5已排除、M10/M12、M92、M55、双星团已排除)、超新星遗迹(天鹅环/西面纱已含则换、IC443已含、Simeis147 Sh2-240、SNR)。以上仅为提示,**最终以确有漂亮彩色 Commons 图为准**,不要硬塞。
- description / descriptionEn 要有信息量(距离、尺度、为何上镜、一个拍摄要点)。
- imageQuery 要能搜到该天体本身的彩色实拍。
- hemisphere/season/difficulty 按规则由 dec/ra/magnitude 推出。坐标/星等以 Wikipedia/SIMBAD 为准(可 WebFetch)。
`;

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['file', 'written', 'count'],
  properties: { file: { type: 'string' }, written: { type: 'boolean' }, count: { type: 'number' }, note: { type: 'string' } },
};

phase('新增精选');
const results = await parallel([
  () => agent(GUIDE + `\n# 任务:精选 **星云 + 星团 + 超新星遗迹** 约 35–45 个,写入 \`src/data/_more_neb.json\`。`,
    { label: 'more-neb', phase: '新增精选', schema: STATUS, agentType: 'general-purpose' }),
  () => agent(GUIDE + `\n# 任务:精选 **星系 + 行星状星云** 约 25–35 个,写入 \`src/data/_more_gal.json\`。`,
    { label: 'more-gal', phase: '新增精选', schema: STATUS, agentType: 'general-purpose' }),
]);
return { results };
