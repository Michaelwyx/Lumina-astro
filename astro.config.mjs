// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
  // 部署站点 URL(用于 sitemap / canonical)
  site: 'https://lumina-astro-3xe.pages.dev',
  // 显式启用 GFM:@astrojs/mdx 默认不对 .mdx 应用 remark-gfm,
  // 不加这行,.mdx 里的表格不会渲染成 <table>(会变成字面 | --- | 文本)。
  markdown: {
    remarkPlugins: [remarkGfm],
  },
  // `@` 别名指向 src/,让任意深度的页面都能用 @/components/... 稳定引用
  vite: {
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  },
  image: {
    // 允许将来按 URL 引用并优化 NASA/ESO 远程图(本地图仍走 src/assets)
    domains: ['upload.wikimedia.org', 'cdn.esahubble.org', 'cdn.eso.org'],
  },
  integrations: [
    starlight({
      title: {
        'zh-CN': '拾光记',
        en: 'Lumina',
      },
      tagline: '拾光成像 · 天文与天文摄影知识库',
      // 站点图标(浏览器标签/收藏夹):望远镜
      favicon: '/favicon.svg',
      description:
        '面向中文读者的天文与天文摄影知识库,覆盖天球坐标、深空天体、观测规划、远程成像、校准与后期处理。',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
        en: { label: 'English', lang: 'en' },
      },
      head: [
        // 图标兜底:手机主屏(apple-touch)与不支持 SVG 图标的浏览器(SVG 由 favicon 选项注入)
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
        // 优质西文字体 Inter(中日韩走系统字体)
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
          },
        },
        // 首页标题与打字标语字体:霞鹜文楷 LXGW WenKai(屏幕版,CDN 按需子集加载)
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' } },
        {
          tag: 'link',
          attrs: { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css' },
        },
        // 提前应用收起偏好,避免刷新闪烁
        {
          tag: 'script',
          content:
            "try{var s=JSON.parse(localStorage.getItem('wikiUI')||'{}');var q=new URLSearchParams(location.search).get('ui');if(q){q.split(',').forEach(function(p){if(p==='nosb')s.hideSidebar=true;else if(p==='notoc')s.hideToc=true;});}var r=document.documentElement;if(s.hideSidebar)r.setAttribute('data-hide-sidebar','');if(s.hideToc)r.setAttribute('data-hide-toc','');}catch(e){}",
        },
        // 侧栏收起/展开按钮
        { tag: 'script', attrs: { src: '/ui-controls.js', defer: true } },
        // 首页标语打字机动画
        { tag: 'script', attrs: { src: '/typewriter.js', defer: true } },
      ],
      plugins: [starlightImageZoom()],
      customCss: ['./src/styles/theme.css'],
      components: {
        PageTitle: './src/components/PageTitle.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        ThemeSelect: './src/components/ThemeToggle.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Michaelwyx/Lumina-astro',
        },
      ],
      // 难度徽章和分类由 frontmatter 驱动。
      sidebar: [
        {
          label: '开始',
          translations: { en: 'Start Here' },
          items: [
            { label: '欢迎', translations: { en: 'Welcome' }, link: '/start/' },
            {
              label: '学习路径',
              translations: { en: 'Learning Paths' },
              link: '/reference/learning-paths/',
            },
          ],
        },
        {
          label: '天文知识',
          translations: { en: 'Astronomy' },
          items: [
            {
              label: '天文基础',
              translations: { en: 'Foundations' },
              items: [{ autogenerate: { directory: 'astronomy/foundations' } }],
            },
            {
              label: '太阳系',
              translations: { en: 'Solar System' },
              items: [{ autogenerate: { directory: 'astronomy/solar-system' } }],
            },
            {
              label: '恒星与深空',
              translations: { en: 'Stars & Deep Sky' },
              items: [{ autogenerate: { directory: 'astronomy/deep-sky' } }],
            },
            {
              label: '宇宙学',
              translations: { en: 'Cosmology' },
              items: [{ autogenerate: { directory: 'astronomy/cosmology' } }],
            },
            {
              label: '观测天文学',
              translations: { en: 'Observing' },
              items: [{ autogenerate: { directory: 'astronomy/observing' } }],
            },
          ],
        },
        {
          label: '天文摄影',
          translations: { en: 'Astrophotography' },
          items: [
            {
              label: '远程平台',
              translations: { en: 'Remote Platforms' },
              items: [{ autogenerate: { directory: 'astrophotography/remote-platforms' } }],
            },
            {
              label: '摄影基础',
              translations: { en: 'Fundamentals' },
              items: [{ autogenerate: { directory: 'astrophotography/fundamentals' } }],
            },
            {
              label: '拍摄技术',
              translations: { en: 'Capture' },
              items: [{ autogenerate: { directory: 'astrophotography/capture' } }],
            },
            {
              label: '校准帧',
              translations: { en: 'Calibration' },
              items: [{ autogenerate: { directory: 'astrophotography/calibration' } }],
            },
            {
              label: '后期处理',
              translations: { en: 'Processing' },
              items: [{ autogenerate: { directory: 'astrophotography/processing' } }],
            },
          ],
        },
        {
          label: '索引',
          translations: { en: 'Index' },
          items: [
            {
              label: '天体目录',
              translations: { en: 'Object Catalog' },
              link: '/reference/catalog/',
            },
            {
              label: '著名天文台',
              translations: { en: 'Observatories' },
              link: '/reference/observatories/',
            },
            {
              label: '术语表',
              translations: { en: 'Glossary' },
              link: '/reference/glossary/',
            },
            {
              label: '软件索引',
              translations: { en: 'Software' },
              link: '/reference/software/',
            },
            {
              label: '外部资源',
              translations: { en: 'Resources' },
              link: '/reference/resources/',
            },
          ],
        },
      ],
    }),
  ],
});
