import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: '../dist',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],

  lang: 'zh-CN',
  title: 'WebGL',
  description: 'WebGL学习文档',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'WebGL', link: '/webgl/concept' }
    ],

    sidebar: [
      {
        text: 'WebGL基础知识',
        items: [
          { text: 'WebGL概念', link: '/webgl/concept' },
          { text: 'WebGL绘制点', link: '/webgl/point' },
          { text: 'WebGL动态绘制点', link: '/webgl/drawPoint' },
          // { text: 'WebGL动态绘制颜色', link: '/webgl/changeColor' },
          { text: 'WebGL动态绘制线', link: '/webgl/line' }
        ]
      },
      {
        text: 'WebGL纹理',
        items: [{ text: 'WebGL纹理基本概念', link: '/texture/index' }]
      },
      {
        text: '二维动画',
        items: [{ text: '几何变换', link: '/animation/2d' }]
      },
      {
        text: '三维动画',
        items: [{ text: '立方体', link: '/animation/3d' }]
      },
      {
        text: 'Three.js',
        items: [
          { text: 'Three.js基础知识', link: '/three/index' },
          { text: 'Three.js顶点概念', link: '/three/point' },
          { text: 'Three.js生成曲线、几何体', link: '/three/gen' },
          { text: 'Three.js绘制地图', link: '/three/map' }
        ]
      }
    ],
    /* 右侧大纲配置 */
    outline: {
      level: 'deep',
      label: '本页目录'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/MeiX559/WebGL_Learning' }],
    darkModeSwitchLabel: '外观',
    returnToTopLabel: '返回顶部',
    lastUpdatedText: '上次更新',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    footer: {
      message: '如有转载或 CV 的请标注本站原文地址',
      copyright: `Copyright © 2024  <a href="https://github.com/MeiX559/WebGL_Learning">meixiu</a>`
    },
    editLink: {
      pattern: 'https://github.com/MeiX559/WebGL_Learning',
      text: '在 GitHub 上编辑此页面'
    }
  }
});
