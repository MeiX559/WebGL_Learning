---
layout: home
layoutClass: 'mei-home-layout'

hero:
  name: WebGL
  text: WebGL知识指南
  tagline: 知识是进步的阶梯，渐进式学习WebGL
  image:
    src: /logo.png
    alt: meixiu
  actions:
    - text: WebGL基础知识
      link: /webgl/concept
    - text: 前言
      link: /webgl/concept
      theme: alt

features:
  - icon: 📖
    title: WebGL基础知识
    details: 整理WebGL的基础知识点 <br /> 如有异议按你的理解为主，不接受反驳
  - icon: 🧰
    title: 实战化
    details: 提供在线的演示案例 <br /> 通过实战案例帮助学习理解
  - icon: 💡
    title: 学习记录
    details: 记录学习WebGL的琐碎 <br /> 日常摸鱼必备
---

<style>

.mei-home-layout .VPHomeHero .name .clip{
  background:linear-gradient(120deg, #10b981 20%, #facc15);
  background-clip:text;
  -webkit-text-fill-color:transparent;
}  
.mei-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.mei-home-layout .details small {
  opacity: 0.8;
}
</style>
