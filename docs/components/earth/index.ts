import { initCamera } from './camera'
import { initControls } from './controls'
import { createEarthMesh } from './earth'
import { initLight } from './light'
import { initRenderer } from './render'
import { initScene } from './scene'
import { initStarBg } from './star'

class Earth {
  canvas: any
  width: number
  height: number
  scene: any
  renderer: any
  camera: any
  orbitControl: any
  stars: any
  cityList: any
  relationList: any[]
  constructor(canvasRef, cityList, relationList) {
    this.canvas = canvasRef
    // 获取canvas的边界框
    const canvasBounds = canvasRef!.getBoundingClientRect()
    this.width = canvasBounds.width
    this.height = canvasBounds.height
    this.cityList = cityList
    this.relationList = relationList
    this.init()
  }
  /**
   * 初始化3D场景
   */
  init() {
    // 初始化场景
    this.scene = initScene()
    // 初始化渲染器
    this.renderer = initRenderer(this.width, this.height, this.canvas)
    // 初始化相机
    this.camera = initCamera(this.width, this.height)
    // 初始化光源
    initLight(this.scene)
    // 初始化轨道控制
    this.orbitControl = initControls(this.camera, this.renderer)
  }
  /**
   * 加载模型
   */
  load() {
    // 显示星星
    this.stars = initStarBg(this.scene)
    this.animate()
    // 加载地球
    const { earthObj } = createEarthMesh(this.cityList, this.relationList)
    this.scene.add(earthObj)
  }
  /**
   * 场景渲染
   */
  animate() {
    if (this.stars) {
      this.stars.rotation.y += 0.0001
    }
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }
}

export default Earth
