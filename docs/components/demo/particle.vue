<template>
  <el-radio-group v-model="transformType">
    <el-radio v-for="item in transformation" :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
  <el-button class="btn" type="primary" @click="toggleAnimation">{{
    running ? '停止' : '开始'
  }}</el-button>
  <canvas
    id="webgl"
    width="680"
    height="500"
    @mousedown="mousedown"
    @mouseleave="mouseleave"
    @mousemove="mousemove"
    @mouseup="mouseup"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { createNewBuffer, createProgram, createShader } from '../utils'
import { Mat4 } from './cuon-matrix/mat4'
import ViewMatrix from './matrix/ViewMatrix'
import PerspectiveMatrix from './matrix/PerspectiveMatrix'
import OrthographicMatrix from './matrix/OrthographicMatrix'
import { ElButton, ElRadioGroup, ElRadio } from 'element-plus'
import 'element-plus/dist/index.css'
import { useMouseCamera } from './hook/useMouseCamera'

// 顶点着色器源码
const vertexCode = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;

  void main () {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  }
`

// 片元着色器源码
const fragmentCode = `
  precision mediump float;
  uniform vec4 u_Color;

  void main () {
    gl_FragColor = u_Color;
  }
`

let gl,
  a_Position,
  canvas,
  program,
  u_Color,
  indices,
  u_ModelMatrix,
  u_ViewMatrix,
  u_ProjectionMatrix

const camera = [0, 0, 10] //相机
const target = [0, 0, -1] //目标点
const up = [0, 1, 0] //上方向
const maxCameraPosition = 8
let animationNum: number = 0
const fov = 80
const near = 1
const far = 100

const transformation = [
  { label: '透视投影', value: 'perspective' },
  { label: '正交投影', value: 'orthographic' }
]

const running = ref(false)
let triangularPyramids: any = []
let transformType = ref('perspective')

const getCameraPosition = (origin: number) => {
  if (origin > maxCameraPosition) return maxCameraPosition
  if (origin < -maxCameraPosition) return -maxCameraPosition
  return origin
}

// 模型矩阵
const createModelMatrix = (elements?: Float32Array) => {
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  let result = elements
  if (!result) {
    const modelMatrix = new Mat4()
    result = modelMatrix.elements
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, result)
}

// 视图矩阵
const createViewMatrix = (cameraArr: number[]) => {
  cameraArr[0] = getCameraPosition(cameraArr[0])
  cameraArr[1] = getCameraPosition(cameraArr[1])

  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const viewMatrix = new ViewMatrix()
  viewMatrix.lookAt.apply(viewMatrix, cameraArr)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)
}

// 投影矩阵
const createProjectionMatrix = () => {
  const canvasEl = gl.canvas as HTMLElement
  u_ProjectionMatrix = gl.getUniformLocation(program, 'u_ProjectionMatrix')
  const perspectiveMatrix = new PerspectiveMatrix()
  perspectiveMatrix.setPerspective(fov, canvasEl.clientWidth / canvasEl.clientHeight, near, far)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, perspectiveMatrix.elements)
}

// 初始化
function initGl() {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  u_Color = gl.getUniformLocation(program, 'u_Color')

  createModelMatrix()
  createViewMatrix([...camera, ...target, ...up])
  createProjectionMatrix()

  const vertices = new Float32Array([
    -0.25, 0.25, 0.25, -0.25, -0.25, 0.25, 0.25, -0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, -0.25,
    0.25, -0.25, -0.25, -0.25, -0.25, -0.25, -0.25, 0.25, -0.25
  ])
  indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, 3, 2, 5, 3, 5, 4, 4, 5, 6, 4, 6, 7, 7, 0, 6, 0, 1, 6, 0, 3, 4, 0, 4, 7, 1, 2,
    5, 1, 5, 6
  ])
  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, 0, 0)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

// 绘制
const draw = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  for (let i in triangularPyramids) {
    const item = triangularPyramids[i]
    gl.uniform4fv(u_Color, item.u_Color)
    gl.uniformMatrix4fv(u_ModelMatrix, false, item.u_ModelMatrix.elements)

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
  }

  running.value &&
    (triangularPyramids = triangularPyramids.filter(
      (_) => Date.now() - _.startTime < _.animationTime
    ))
}

const animation = () => {
  createTriangularPyramid()
  /**
   * 我们在triangularPyramids定义了8个粒子，并为这些粒子定义了不同的随机颜色，唯一值，旋转值等
   * 由于粒子动画是很多个立方体通过平移旋转动画时间等的不同组成的，因此可以只定义一个立方体，然后其他立方体可以通过平移旋转等变换实现
   */
  for (const triangularPyramid of triangularPyramids) {
    const translateMatrix = new Mat4()
    const translate = triangularPyramid.translate.map((_) => (_ / 100) * 1.5)
    translateMatrix.setTranslate.apply(translateMatrix, translate)

    const rotateMatrix = new Mat4()
    const rotate = triangularPyramid.rotate.map((_) => _ / 10)
    rotateMatrix.setRotate.apply(rotateMatrix, rotate)

    triangularPyramid.u_ModelMatrix.multiply(translateMatrix).multiply(rotateMatrix)
  }
  draw()

  animationNum = requestAnimationFrame(animation)
}

// 立方体随机参数
const randomCubeParams = () => {
  // 粒子颜色
  const u_Color = new Float32Array([Math.random(), Math.random(), Math.random(), 0.9])
  //   模型矩阵
  const u_ModelMatrix = new Mat4()
  //   定义随机位移值
  const translate = [createRandom(10), createRandom(10), createRandom(1)]
  // 定义随机旋转角度
  const rotate = [createRandom(30), createRandom(10), createRandom(10), createRandom(10)]
  //   定义开始时间
  const startTime = Date.now()
  //   定义动画时间
  const animationTime = Math.floor(Math.random() * 3000 + 4000) // 2-5s 动画时间

  return {
    translate,
    rotate,
    u_Color,
    u_ModelMatrix,
    startTime,
    animationTime
  }
}

const createRandom = (area: number = 1) => {
  const target = Math.floor(Math.random() * (area * 2) - area)
  return target
}

// 创建粒子
const createTriangularPyramid = () => {
  for (let i = 0; i < 10; i++) {
    triangularPyramids.push(randomCubeParams())
  }
}

const toggleAnimation = () => {
  running.value = !running.value
  if (!running.value) {
    cancelAnimationFrame(animationNum)
  } else {
    triangularPyramids = []
    animation()
  }
}

onMounted(() => {
  initGl()
})

// 监听投影方式（透视投影、正交投影）
watch(transformType, (type) => {
  const canvasEl = gl.canvas as HTMLElement
  u_ProjectionMatrix = gl.getUniformLocation(program, 'u_ProjectionMatrix')
  if (type === 'perspective') {
    const perspectiveMatrix = new PerspectiveMatrix()
    perspectiveMatrix.setPerspective(fov, canvasEl.clientWidth / canvasEl.clientHeight, near, far)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, perspectiveMatrix.elements)
  } else {
    const orthographicMatrix = new OrthographicMatrix()
    orthographicMatrix.setOrthographicPosition(-10, 10, 8, -8, -100, 100)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, orthographicMatrix.elements)
  }
  draw()
})

// ################# 鼠标相关 ##############
// 鼠标移动改变相机观察位置和上方向
const moveOption = (diffX: number, diffY: number) => {
  const moveX = camera[0] + diffX
  const moveY = camera[1] + diffY

  createViewMatrix([moveX, moveY, camera[2], ...target, ...up])
  draw()
}

const upOption = (endX: number, endY: number) => {
  camera[0] = getCameraPosition(camera[0] + endX)
  camera[1] = getCameraPosition(camera[1] + endY)

  createViewMatrix([...camera, ...target, ...up])
  draw()
}

const { mousedown, mousemove, mouseleave, mouseup } = useMouseCamera({ moveOption, upOption })
</script>

<style scoped lang="css">
.btn {
  margin: 20px;
}
</style>
