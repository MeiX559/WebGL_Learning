import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  Vector3
} from 'three'
// @ts-ignore
import gradient from './images/gradient.png'
/**
 * 创建星空背景
 * 使用了一张白色光点的图片作为贴图，配合点材质`PointsMaterial`来作为星空的材质
 * 使用`BufferGeometry`来减少数据开销，随机生成大小、颜色、位置这些数据
 * @param scene
 */
export const initStarBg = (scene: Scene) => {
  // 加载纹理图片
  const texture = new TextureLoader().load(gradient)
  // 创建几何体
  const geometry = new BufferGeometry()
  // 创建随机点集
  const positions: any[] = []
  const colors: number[] = []
  const sizes: number[] = []
  for (let i = 0; i < 10000; i++) {
    const vertex = new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
    positions.push(vertex.x, vertex.y, vertex.z)
    // 设置随机颜色
    let color = new Color() // 设置随机颜色
    color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55)
    colors.push(color.r, color.g, color.b)
    // 设置随机大小
    sizes.push(Math.random() * 10)
  }
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3)) //设置顶点位置
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3)) //设置顶点颜色
  geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1).setUsage(DynamicDrawUsage)) //设置像素大小
  // 创建材质
  const shaderMaterial = new PointsMaterial({
    map: texture, // 贴图
    size: 12, // 大小
    vertexColors: true, // 顶点颜色
    transparent: true, // 透明
    opacity: 1, // 透明度
    blending: AdditiveBlending, // 混合模式
    sizeAttenuation: true // 大小衰减
  })
  //   创建点模型
  const stars = new Points(geometry, shaderMaterial)
  stars.scale.set(2400, 2400, 2400)
  scene.add(stars)
  return stars
}
