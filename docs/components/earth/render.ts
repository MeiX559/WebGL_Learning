import { PCFShadowMap, WebGLRenderer } from 'three'

/**
 *
 * @param width 创建渲染器
 * @param height
 */
export const initRenderer = (width: number, height: number, canvas) => {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true, // 抗锯齿
    alpha: true // 是否开启透明
  })
  renderer.shadowMap.enabled = false // 开启阴影
  renderer.shadowMap.type = PCFShadowMap // 阴影类型
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  return renderer
}
