<template>
  <div v-if="props.type === 'arc'">
    <el-button type="primary" @click="drawPoint" class="btns">点模型</el-button>
    <el-button type="primary" @click="drawLine" class="btns">线模型</el-button>
    <el-button type="primary" @click="drawMesh" class="btns">网格模型</el-button>
  </div>
  <div v-if="props.type === 'besselCurve'">
    <el-button type="primary" @click="besselCurve" class="btns">二维二次贝塞尔曲线</el-button>
    <el-button type="primary" @click="besselCurve3" class="btns">三维二次贝塞尔曲线</el-button>
    <el-button type="primary" @click="threeBbesselCurve3" class="btns"
      >三维三次贝塞尔曲线</el-button
    >
    <el-button type="primary" @click="flightPath" class="btns">飞线轨迹</el-button>
  </div>

  <canvas ref="canvas" width="600" height="600"></canvas>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, ref } from 'vue'
import { ElButton } from 'element-plus'
import 'element-plus/dist/index.css'

const canvas = ref(null)
const renderType = ref('Point')
let geometry = null
let scene = null

const props = defineProps(['type'])

function createMesh(geometry, material) {
  return new THREE.Mesh(geometry, material)
}

// 添加到场景
function addToScene(obj) {
  scene.add(obj)
}

// 设置点光源
function createPointLight() {
  const point = new THREE.PointLight(0xffffff)
  point.position.set(400, 200, 300)
  return point
}

// 设置环境光
function createAmbientLight() {
  return new THREE.AmbientLight(0x444444)
}

/**
 * 计算相机参数
 * @param {*} width  canvas画布宽
 * @param {*} height canvas画布高
 */
function calculateCameraParameters(width, height) {
  const k = width / height
  const s = 200
  return { k, s }
}

// 设置相机
function createCamera(k, s) {
  return new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
}

function setCameraPositionAndLookAt(camera, scene) {
  camera.position.set(200, 300, 200)
  camera.lookAt(scene.position)
}

// 创建渲染器
function createRenderer(canvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas: canvasElement })
  renderer.setSize(600, 600)
  renderer.setClearColor(0xb9d3ff, 1)
  return renderer
}

// 创建控件，鼠标控制
function setController(camera) {
  const controls = new OrbitControls(camera, canvas.value)
  controls.enableDamping = true
}

// 点模型
function drawPoint() {
  scene.clear()
  var material = new THREE.PointsMaterial({
    // color: 0xff0000,
    vertexColors: true, //是否启用顶点颜色
    size: 10.0 //点对象像素尺寸
  }) //材质对象
  var points = new THREE.Points(geometry, material) //点模型对象
  scene.add(points) //点对象添加到场景中
  addHelp()
}

// 线模型
function drawLine() {
  scene.clear()
  var material = new THREE.LineBasicMaterial({
    color: 0xff0000 //线条颜色
    // vertexColors: true
  }) //材质对象
  var line = new THREE.LineLoop(geometry, material) //线条模型对象
  scene.add(line) //线条对象添加到场景中
  addHelp()
}

// 网格模型
function drawMesh() {
  scene.clear()
  var material = new THREE.MeshBasicMaterial({
    color: 0x0000ff, //三角面颜色
    // vertexColors: true,
    side: THREE.DoubleSide //两面可见
  }) //材质对象
  // 场景网格对象
  const mesh = createMesh(geometry, material)
  addToScene(mesh)
  addHelp()
}

// 添加辅助坐标
function addHelp() {
  const axesHelper = new THREE.AxesHelper(500)
  scene.add(axesHelper)
}

// 生成圆弧
function genArc() {
  //创建一个Buffer类型几何体对象
  geometry = new THREE.BufferGeometry()
  const R = 100 //圆弧半径
  const N = 50 //分段数量
  const sp = (2 * Math.PI) / N //两个相邻点间隔弧度
  // 批量生成圆弧上的顶点数据
  const arr = []
  for (let i = 0; i < N; i++) {
    const angle = sp * i //当前点弧度
    // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    const x = R * Math.cos(angle)
    const y = R * Math.sin(angle)
    // arr.push(x, y, 0);
    arr.push(new THREE.Vector3(x, y, 0))
  }
  geometry.setFromPoints(arr)
  //类型数组创建顶点数据
  // const vertices = new Float32Array(arr);
  // // 创建属性缓冲区对象
  // var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，作为一个顶点的xyz坐标
  // // 设置几何体attributes属性的位置position属性
  // geometry.attributes.position = attribue;
}

// 二维二次贝塞尔曲线
function besselCurve() {
  scene.clear()
  const p1 = new THREE.Vector2(-80, 0)
  const p2 = new THREE.Vector2(20, 100)
  const p3 = new THREE.Vector2(80, 0)
  // 二维二次贝赛尔曲线
  const curve = new THREE.QuadraticBezierCurve(p1, p2, p3)
  const pointsArr = curve.getPoints(100) //曲线上获取点
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(pointsArr) //读取坐标数据赋值给几何体顶点
  const material = new THREE.LineBasicMaterial({ color: 0x00fffff })
  const line = new THREE.Line(geometry, material)
  scene.add(line)
  addHelp()
}

// 三维二次贝塞尔曲线
function besselCurve3() {
  scene.clear()
  // p1、p2、p3表示三个点坐标
  const p1 = new THREE.Vector3(-80, 0, 0)
  const p2 = new THREE.Vector3(20, 100, 0)
  const p3 = new THREE.Vector3(80, 0, 100)
  // 三维二次贝赛尔曲线
  const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3)
  const pointsArr = curve.getPoints(100) //曲线上获取点
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(pointsArr) //读取坐标数据赋值给几何体顶点
  const material = new THREE.LineBasicMaterial({ color: 0x00fffff })
  const line = new THREE.Line(geometry, material)
  scene.add(line)
  addHelp()
}

// 三维三次贝塞尔曲线
function threeBbesselCurve3() {
  scene.clear()
  const p1 = new THREE.Vector3(-80, 0, 0)
  const p2 = new THREE.Vector3(-40, 50, 0)
  const p3 = new THREE.Vector3(50, 50, 0)
  const p4 = new THREE.Vector3(80, 0, 100)
  // 三维三次贝赛尔曲线
  const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4)
  const pointsArr = curve.getPoints(80) //曲线上获取点
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(pointsArr) //读取坐标数据赋值给几何体顶点
  const material = new THREE.LineBasicMaterial({ color: 0x00fffff })
  const line = new THREE.Line(geometry, material)
  scene.add(line)
  addHelp()
}

function flightPath() {
  scene.clear()
  // p1、p3轨迹线起始点坐标
  const p1 = new THREE.Vector3(-100, 0, -100)
  const p3 = new THREE.Vector3(100, 0, 100)
  // 计算p1和p3的中点坐标
  const x2 = (p1.x + p3.x) / 2
  const z2 = (p1.z + p3.z) / 2
  const h = 100
  const p2 = new THREE.Vector3(x2, h, z2)
  // 三维二次贝赛尔曲线
  const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3)
  const pointsArr = curve.getPoints(100) //曲线上获取点
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(pointsArr) //读取坐标数据赋值给几何体顶点
  const material = new THREE.LineBasicMaterial({ color: 0x00fffff })
  const line = new THREE.Line(geometry, material)
  scene.add(line)
  addHelp()
}

// 拉伸
function extrudeGeometry() {
  // Shape表示一个平面多边形轮廓
  const shape = new THREE.Shape([
    // 按照特定顺序，依次书写多边形顶点坐标
    new THREE.Vector3(-50, -50, 5), //多边形起点
    new THREE.Vector3(-50, 50, 5),
    new THREE.Vector3(50, 50, 5),
    new THREE.Vector3(50, -50, 5)
  ])
  //拉伸造型
  geometry = new THREE.ExtrudeGeometry(
    shape, //二维轮廓
    {
      bevelSegments: 1,
      depth: 60 //拉伸长度
    }
  )
  var material = new THREE.MeshBasicMaterial({
    color: 0x0000ff, //三角面颜色
    side: THREE.DoubleSide //两面可见
  }) //材质对象
  // 场景网格对象
  const mesh = createMesh(geometry, material)
  scene.add(mesh)
}

// 扫描
function sExtrudeGeometry() {
  // 扫描轮廓：Shape表示一个平面多边形轮廓
  const shape = new THREE.Shape([
    // 按照特定顺序，依次书写多边形顶点坐标
    new THREE.Vector2(0, 0), //多边形起点
    new THREE.Vector2(0, 10),
    new THREE.Vector2(10, 10),
    new THREE.Vector2(10, 0)
  ])
  // 扫描轨迹：创建轮廓的扫描轨迹(3D样条曲线)
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-10, -50, -50),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(8, 50, 50),
    new THREE.Vector3(-5, 0, 100)
  ])

  //扫描造型：扫描默认没有倒角
  geometry = new THREE.ExtrudeGeometry(
    shape, //扫描轮廓
    {
      extrudePath: curve, //扫描轨迹
      steps: 10000 //沿着路径细分精度，越大越光滑
    }
  )
  var material = new THREE.MeshBasicMaterial({
    color: 0x0000ff, //三角面颜色
    side: THREE.DoubleSide //两面可见
  }) //材质对象
  // 场景网格对象
  const mesh = createMesh(geometry, material)
  scene.add(mesh)
}

onMounted(() => {
  // 创建场景
  scene = new THREE.Scene()
  switch (props.type) {
    case 'arc':
      genArc()
      // 线渲染模式
      drawLine(geometry, scene)
      break
    case 'besselCurve':
      besselCurve()
      break
    case 'extrudeGeometry':
      extrudeGeometry()
      break
    case 'sExtrudeGeometry':
      sExtrudeGeometry()
      break
    default:
      genArc()
      break
  }
  addHelp()

  // 创建光源
  const pointLight = createPointLight()
  addToScene(pointLight)
  const ambientLight = createAmbientLight()
  addToScene(ambientLight)

  // 创建相机
  const { k, s } = calculateCameraParameters(600, 600)
  const camera = createCamera(k, s)
  setCameraPositionAndLookAt(camera, scene)

  setController(camera)

  // 创建渲染器
  const renderer = createRenderer(canvas.value)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  animate()
})
</script>

<style scoped>
.btns {
  margin: 10px 10px 10px 0;
}
</style>
