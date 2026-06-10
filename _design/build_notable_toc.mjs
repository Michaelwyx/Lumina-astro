// 在「常见深空天体导览」中/英页顶部生成:编号体系说明 + 为什么是彩色(详解)+ 星体导览目录(可跳转)。
import { readFileSync, writeFileSync } from 'node:fs';

const NAMING_ZH = `## 天体编号与命名

深空天体往往同时拥有多套目录编号。**M** 指梅西耶目录(Messier Catalogue),由 18 世纪法国天文学家梅西耶整理,共 110 个明亮、适合业余观测的天体;**NGC** 是《星云星团新总表》(New General Catalogue,1888 年),收录约 7840 个天体,是目前使用最广的编号;**IC** 是其后续补编(Index Catalogue,约 5386 个);**Caldwell(C)** 由 Patrick Moore 补充梅西耶未收录的亮天体。此外还有按类型划分的专项目录,如 **Sh2**(Sharpless 发射星云表)、**B**(Barnard 暗星云表)、**Cr / Mel**(Collinder、Melotte 疏散星团表)。同一天体常有多个编号,例如猎户座大星云 = M42 = NGC 1976。`;

const COLOR_ZH = `## 为什么这些天体是彩色的

肉眼通过望远镜看深空天体,大多只能看到灰白色的轮廓——这并不是因为它们没有颜色,而是它们的**面亮度太低**。视网膜里负责颜色的视锥细胞(cone)需要较强的光才能工作;弱光下只剩对颜色不敏感的视杆细胞(rod)还在响应(暗视觉,scotopic vision),于是一切都呈灰白。照片则不同:相机在几分钟到几十小时的曝光里**持续累积光子**,把肉眼无法察觉的微弱色彩一点点记录下来。这些颜色对应真实的物理过程,主要有以下几类来源。

### 发射星云:电离气体的发射线

发射星云(如猎户、礁湖、北美)本质是**电离氢区(H II 区)**。星云内部炽热的 O / B 型恒星发出大量紫外光,把氢等原子**电离**;当自由电子重新与离子复合、并逐级跃迁回低能级时,会按量子化的能级差放出**特定波长**的光子——这就是发射线。最主要的几条:

| 发射线 | 波长 | 颜色 | 物理成因 |
| --- | --- | --- | --- |
| Hα | 656.3 nm | 深红 | 氢原子电子 n=3→2 跃迁(巴尔末系),发射星云最强的红色 |
| Hβ | 486.1 nm | 青蓝 | 氢原子 n=4→2 跃迁 |
| OIII | 495.9 / 500.7 nm | 青绿 | **两次电离氧 O²⁺** 的禁线,行星状星云与高激发区的标志色 |
| SII | 671.6 / 673.1 nm | 更深的红 | 一次电离硫 S⁺ 的发射 |

不同元素、不同电离态各自发出固定波长的光,叠加起来就是星云照片里红、粉、青的来源。

### 反射星云:尘埃散射

反射星云(如昴星团周围的蓝雾)本身不发光,而是**尘埃颗粒散射**附近亮星的光。与地球天空偏蓝同理(散射对短波更有效),散射后的星云偏**蓝**。

### 行星状星云与超新星遗迹

行星状星云(环状、哑铃)是中小质量恒星晚年抛出的电离气壳,OIII 往往很强,因而常呈青绿;超新星遗迹(面纱、蟹状)既有 Hα / OIII 发射线,也有高速电子在磁场中产生的**同步辐射**。

### 星系:恒星族群与尘埃

星系的颜色来自其中的**恒星族群**:核球里年老恒星偏黄红,旋臂上年轻的大质量恒星与 H II 区偏蓝,夹杂的尘埃带呈暗褐。这是接近"真实"的宽带色彩。单颗**恒星**的颜色则由表面温度决定(近似黑体,维恩定律):蓝白最热(O / B 型,数万度),黄色居中(如太阳约 5800 K),橙红最冷(K / M 型)。

### 颜色是怎么"拍"出来的

真实信号变成成片,取决于采集与处理方式,常见三条路线:

1. **单次彩色(OSC)相机**:传感器前覆盖拜耳(Bayer)红绿蓝滤镜阵列,一次曝光即得彩色,接近自然色,门槛最低。
2. **单色相机 + RGB 滤镜**:分别拍红、绿、蓝三组再合成,配合恒星光度做**色彩校准(SPCC)**,得到尽量接近真实的色彩,细节也更好。
3. **单色相机 + 窄带滤镜(Hα / OIII / SII)**:每片滤镜只放行一条发射线,极大压制光污染、突出气体结构,城市与月夜也能拍。由于只有三条线,需要把它们**映射**到 RGB 通道,得到「代表色」而非真实色——最常见的 **SHO(哈勃配色)**把 SII→红、Hα→绿、OIII→蓝,**HOO** 则更接近自然。

最后,叠加好的原始数据是"线性"的、几乎全黑,必须经过**拉伸(stretch)**把暗弱信号提亮才看得见,再做色彩校准与降噪。所以深空照片的颜色都对应真实的物理信号,但经过了拉伸与配色,与肉眼直接所见并不相同。窄带与配色的细节见〔[窄带成像](/astrophotography/capture/narrowband/)〕与〔[后期处理流程](/astrophotography/processing/workflow/)〕。`;

const NAMING_EN = `## Designations and naming

Deep-sky objects often carry several catalogue designations at once. **M** denotes the Messier Catalogue, compiled by the 18th-century French astronomer Charles Messier — 110 bright objects well suited to amateur observing; **NGC** is the New General Catalogue (1888), with about 7,840 objects and the most widely used numbering; **IC** is its later Index Catalogue supplement (~5,386 objects); **Caldwell (C)**, compiled by Patrick Moore, adds bright objects Messier omitted. There are also specialised catalogues by type, such as **Sh2** (Sharpless emission nebulae), **B** (Barnard dark nebulae) and **Cr / Mel** (Collinder, Melotte open clusters). One object may carry several numbers — for example the Orion Nebula = M42 = NGC 1976.`;

const COLOR_EN = `## Why these objects are colourful

Viewed through a telescope by eye, most deep-sky objects look greyish — not because they lack colour, but because their **surface brightness is too low**. The retina's colour-sensing cone cells need a fair amount of light to work; in faint light only the colour-blind rod cells respond (scotopic vision), so everything looks grey. A camera is different: over exposures of minutes to tens of hours it **accumulates photons**, recording faint colour the eye cannot perceive. Those colours correspond to real physical processes.

### Emission nebulae: emission lines from ionised gas

Emission nebulae (Orion, Lagoon, North America) are **ionised-hydrogen regions (H II regions)**. Hot O/B stars inside flood the gas with ultraviolet light and **ionise** it; when free electrons recombine with the ions and cascade down through the energy levels, they emit photons at **specific wavelengths** — the emission lines:

| Line | Wavelength | Colour | Physical cause |
| --- | --- | --- | --- |
| Hα | 656.3 nm | deep red | hydrogen n=3→2 transition (Balmer series); the dominant red of emission nebulae |
| Hβ | 486.1 nm | cyan-blue | hydrogen n=4→2 transition |
| OIII | 495.9 / 500.7 nm | teal-green | forbidden lines of **doubly ionised oxygen (O²⁺)**; signature of planetary nebulae |
| SII | 671.6 / 673.1 nm | deeper red | emission from singly ionised sulphur (S⁺) |

Different elements and ionisation states each emit fixed wavelengths; together they produce the reds, pinks and teals of nebula images.

### Reflection nebulae: dust scattering

Reflection nebulae (the blue haze around the Pleiades) do not glow themselves; **dust grains scatter** the light of nearby bright stars. As with Earth's blue sky (scattering favours short wavelengths), the result is **blue**.

### Planetary nebulae and supernova remnants

Planetary nebulae (Ring, Dumbbell) are ionised shells shed by dying low-to-intermediate-mass stars; OIII is often strong, giving a teal cast. Supernova remnants (Veil, Crab) combine Hα/OIII emission with **synchrotron radiation** from fast electrons in magnetic fields.

### Galaxies: stellar populations and dust

A galaxy's colour comes from its **stellar populations**: old stars in the bulge look yellow-red, young massive stars and H II regions in the arms look blue, and dust lanes appear dark brown — a near-"true" broadband colour. A single **star's** colour is set by its surface temperature (approximately blackbody, Wien's law): blue-white is hottest (O/B, tens of thousands of K), yellow is intermediate (the Sun, ~5800 K), orange-red is coolest (K/M).

### How the colour is actually captured

Turning real signal into a finished image depends on how it is acquired and processed — three common routes:

1. **One-shot colour (OSC) cameras**: a Bayer red-green-blue filter array over the sensor yields colour in a single exposure, close to natural colour and the lowest barrier to entry.
2. **Mono camera + RGB filters**: shoot red, green and blue separately and combine, with **colour calibration (SPCC)** against stellar photometry for the truest colour and best detail.
3. **Mono camera + narrowband filters (Hα / OIII / SII)**: each filter passes only one emission line, strongly suppressing light pollution and isolating gas structure — usable even from cities and under moonlight. With only three lines, they are **mapped** to the RGB channels, giving a representative rather than true colour: the common **SHO (Hubble palette)** maps SII→R, Hα→G, OIII→B, while **HOO** looks more natural.

Finally, the stacked raw data is "linear" and nearly black; it must be **stretched** to reveal faint signal, then colour-calibrated and denoised. So the colours in deep-sky images all correspond to real physical signal, but are stretched and remapped, and differ from what the eye sees directly. See 〔[narrowband imaging](/en/astrophotography/capture/narrowband/)〕 and 〔[the processing workflow](/en/astrophotography/processing/workflow/)〕 for details.`;

const FILES = [
  { path: 'src/content/docs/astronomy/deep-sky/notable-objects.mdx', label: '星体导览目录', naming: NAMING_ZH, color: COLOR_ZH },
  { path: 'src/content/docs/en/astronomy/deep-sky/notable-objects.mdx', label: 'Object Guide Index', naming: NAMING_EN, color: COLOR_EN },
];

const START = '{/* dso-guide:start */}';
const END = '{/* dso-guide:end */}';
const esc = (s) => s.replace(/[{}*/]/g, '\\$&');

function build(text, label, naming, color) {
  for (const tag of ['dso-guide', 'dso-toc']) {
    const re = new RegExp(esc(`{/* ${tag}:start */}`) + '[\\s\\S]*?' + esc(`{/* ${tag}:end */}`) + '\\n*', 'g');
    text = text.replace(re, '');
  }
  const lines = text.split('\n');
  const groups = [];
  let cur = null;
  for (const ln of lines) {
    const h = ln.match(/^##\s+(.+?)\s*$/);
    if (h) { cur = { title: h[1], items: [] }; groups.push(cur); continue; }
    const tag = ln.match(/<ObjectEntry\b[^>]*>/);
    if (tag && cur) {
      const img = (tag[0].match(/\bimg="([^"]+)"/) || [])[1];
      let name = (tag[0].match(/\bname="([^"]+)"/) || [])[1];
      if (img && name) { name = name.replace(/\s*[(（][^)）]*[)）]\s*$/, '').trim(); cur.items.push({ img, name }); }
    }
  }
  const withItems = groups.filter((g) => g.items.length);
  if (!withItems.length) return text;
  const groupHtml = withItems
    .map((g) => {
      const lis = g.items.map((it) => `<li><a href="#obj-${it.img}">${it.name}</a></li>`).join('');
      return `<div class="dso-toc__group"><div class="dso-toc__cat">${g.title}</div><ul class="dso-toc__list">${lis}</ul></div>`;
    })
    .join('\n');
  const nav = `<nav class="dso-toc" aria-label="${label}">\n<div class="dso-toc__title">${label}</div>\n${groupHtml}\n</nav>`;
  const block = `${START}\n\n${naming}\n\n${color}\n\n${nav}\n\n${END}`;
  const idx = text.search(/^##\s+/m);
  if (idx === -1) return text;
  return text.slice(0, idx) + block + '\n\n' + text.slice(idx);
}

for (const { path, label, naming, color } of FILES) {
  const out = build(readFileSync(path, 'utf8'), label, naming, color);
  writeFileSync(path, out);
  const n = (out.match(/dso-toc__group/g) || []).length;
  console.log(`${path.includes('/en/') ? 'EN' : 'ZH'}: 目录 ${n} 组 + 命名 + 彩色详解`);
}
