import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: '../dist',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],

  lang: 'zh-CN',
  title: 'WebGL',
  description: 'WebGL学习文档',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'WebGL', link: '/webgl/concept' }
    ],

    sidebar: [
      {
        text: 'WebGL基础知识',
        items: [{ text: 'WebGL概念', link: '/webgl/concept' }]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/MeiX559/WebGL_Learning' }]
  }
})
