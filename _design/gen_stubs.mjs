// 生成所有内容页骨架(正确 frontmatter),供工作流逐页扩写。
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = join(process.cwd(), 'src', 'content', 'docs');

// [path(相对 docs), title, difficulty, order, extra(season 等)]
const pages = [
  // ── 开始 ──
  ['start.mdx', '欢迎来到星海', 'beginner', 0, {}],

  // ── A 天文基础 ──
  ['astronomy/foundations/celestial-coordinates.mdx', '天球与坐标系', 'beginner', 1, {}],
  ['astronomy/foundations/time-systems.mdx', '时间系统', 'beginner', 2, {}],
  ['astronomy/foundations/constellations.mdx', '星图与星座', 'beginner', 3, {}],
  ['astronomy/foundations/apparent-motion.mdx', '天体的视运动', 'beginner', 4, {}],
  ['astronomy/foundations/magnitude.mdx', '星等系统', 'beginner', 5, {}],

  // ── A 太阳系 ──
  ['astronomy/solar-system/sun.mdx', '太阳', 'beginner', 1, {}],
  ['astronomy/solar-system/moon.mdx', '月球', 'beginner', 2, {}],
  ['astronomy/solar-system/planets.mdx', '行星', 'beginner', 3, {}],
  ['astronomy/solar-system/small-bodies.mdx', '矮行星 · 彗星 · 流星', 'intermediate', 4, {}],

  // ── A 恒星与深空 ──
  ['astronomy/deep-sky/stellar-physics.mdx', '恒星物理与赫罗图', 'intermediate', 1, {}],
  ['astronomy/deep-sky/variable-multiple-stars.mdx', '双星 · 聚星 · 变星', 'intermediate', 2, {}],
  ['astronomy/deep-sky/star-clusters.mdx', '星团', 'intermediate', 3, {}],
  ['astronomy/deep-sky/nebulae.mdx', '星云', 'intermediate', 4, {}],
  ['astronomy/deep-sky/galaxies.mdx', '星系', 'advanced', 5, {}],

  // ── A 宇宙学 ──
  ['astronomy/cosmology/overview.mdx', '宇宙学概览', 'advanced', 1, {}],

  // ── A 观测天文学 ──
  ['astronomy/observing/conditions.mdx', '大气与观测条件', 'beginner', 1, {}],
  ['astronomy/observing/hemisphere-visibility.mdx', '半球可见性原理', 'beginner', 2, {}],
  ['astronomy/observing/planning.mdx', '选址与观测计划', 'intermediate', 3, {}],
  ['astronomy/observing/visual-techniques.mdx', '目视观测技巧', 'beginner', 4, {}],

  // ── B 远程平台 ──
  ['astrophotography/remote-platforms/overview.mdx', '远程成像入门', 'beginner', 1, {}],
  ['astrophotography/remote-platforms/platforms-comparison.mdx', '平台对比:AstroBin / iTelescope / SkyShare', 'beginner', 2, {}],

  // ── B 摄影基础 ──
  ['astrophotography/fundamentals/optics.mdx', '光学基础', 'beginner', 1, {}],
  ['astrophotography/fundamentals/exposure.mdx', '曝光、增益与 ISO', 'beginner', 2, {}],
  ['astrophotography/fundamentals/sensors.mdx', '传感器:CMOS / CCD / 单色 / OSC', 'intermediate', 3, {}],
  ['astrophotography/fundamentals/snr.mdx', '噪声与信噪比:为什么要叠加', 'intermediate', 4, {}],

  // ── B 拍摄技术 ──
  ['astrophotography/capture/widefield.mdx', '星野与广角', 'beginner', 1, {}],
  ['astrophotography/capture/dso-basics.mdx', '深空 DSO 拍摄', 'intermediate', 2, {}],
  ['astrophotography/capture/planetary.mdx', '行星 · 月球 · 太阳', 'intermediate', 3, {}],
  ['astrophotography/capture/narrowband.mdx', '窄带成像', 'advanced', 4, {}],

  // ── B 校准帧 ──
  ['astrophotography/calibration/calibration-frames.mdx', '校准帧:暗场 / 平场 / 偏置', 'intermediate', 1, {}],

  // ── B 后期处理 ──
  ['astrophotography/processing/stacking.mdx', '预处理与叠加', 'intermediate', 1, {}],
  ['astrophotography/processing/workflow.mdx', '后期处理流程', 'intermediate', 2, {}],
  ['astrophotography/processing/techniques.mdx', '关键后期技术', 'advanced', 3, {}],

  // ── 索引层 ──
  ['reference/observatories.mdx', '著名天文台', 'beginner', 2, {}],
  ['reference/glossary.mdx', '术语表', 'beginner', 3, {}],
  ['reference/software.mdx', '软件索引', 'beginner', 4, {}],
  ['reference/learning-paths.mdx', '学习路径', 'beginner', 5, {}],
  ['reference/resources.mdx', '外部资源', 'beginner', 6, {}],
];

const PILLAR = (p) =>
  p.startsWith('astronomy') ? 'astronomy' : p.startsWith('astrophotography') ? 'astrophotography' : 'index';

let count = 0;
for (const [rel, title, difficulty, order, extra] of pages) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  const fm = [
    '---',
    `title: ${title}`,
    `description: ${title} —— 待扩写。`,
    `difficulty: ${difficulty}`,
    `pillar: ${PILLAR(rel)}`,
    ...(extra.season ? [`season: ${extra.season}`] : []),
    'sidebar:',
    `  order: ${order}`,
    '---',
    '',
    `> 🚧 本页待扩写(${title})。`,
    '',
  ].join('\n');
  // 不覆盖已存在的真实页面
  if (existsSync(full)) {
    console.log('skip existing', rel);
    continue;
  }
  writeFileSync(full, fm);
  count++;
}
console.log('generated', count, 'stubs');
