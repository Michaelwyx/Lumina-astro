import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { file } from 'astro/loaders';

/**
 * 难度三档:🟢入门 / 🟡进阶 / 🔴精通(对应设计文档 §2 的标签维度)
 */
const difficulty = z
  .enum(['beginner', 'intermediate', 'advanced'])
  .optional();

export const collections = {
  // ── Starlight 文档集合 + 自定义 frontmatter ──────────────────────────────
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // 难度徽章 & 标签索引的驱动字段
        difficulty,
        pillar: z.enum(['astronomy', 'astrophotography', 'index']).optional(),
        season: z
          .enum(['spring', 'summer', 'autumn', 'winter', 'all'])
          .optional(),
        objectId: z.string().optional(), // 关联天体目录条目
        prerequisites: z.array(z.string()).optional(), // 建议先读
      }),
    }),
  }),

  // ── 数据驱动的天体目录(新增天体只改 YAML,不写页面)────────────────────────
  objects: defineCollection({
    loader: file('src/data/objects.yaml'),
    schema: z.object({
      id: z.string(), // M42 / NGC7000 …
      name: z.string(), // 中文俗名
      nameEn: z.string(),
      catalog: z.string(), // Messier / NGC / IC / Caldwell / Other
      type: z.string(), // galaxy / emission-nebula / …(用于筛选,宽松校验)
      typeLabel: z.string(), // 中文类型名:发射星云…
      constellation: z.string(), // 仙女座 And
      ra: z.string(), // 00h43m
      dec: z.number(), // 赤纬(度),用于半球可见性计算
      decLabel: z.string(), // +41° / −05°
      magnitude: z.number().nullable(), // 视星等(未知为 null)
      hemisphere: z.enum(['north', 'south', 'both']),
      season: z.enum(['spring', 'summer', 'autumn', 'winter', 'all']),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      summary: z.string(), // 卡片用一句话简介
      summaryEn: z.string().optional(), // 英文一句话简介
      description: z.string().optional(), // 详情页较完整的介绍
      descriptionEn: z.string().optional(), // 英文详情介绍
      focal: z.string().optional(), // 推荐焦距区间
      image: z.string().optional(), // 远程/本地图 URL
      imageCredit: z.string().optional(),
    }),
  }),
};
