<template>
  <el-radio-group v-model="transformType">
    <el-radio v-for="item in transformation" :label="item.value" size="large">{{
      item.label
    }}</el-radio>
  </el-radio-group>
  <div class="box">
    <el-icon class="icon" @click="handleUp"><ArrowUp /></el-icon>
    <div class="mid">
      <el-icon class="icon" @click="handleLeft"><ArrowLeft /></el-icon>
      <el-icon class="icon"><Camera /></el-icon>
      <el-icon class="icon" @click="handleRight"><ArrowRight /></el-icon>
    </div>
    <el-icon class="icon" @click="handleDown"><ArrowDown /></el-icon>
  </div>

  <canvas id="webgl" width="600" height="400" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createShader, createProgram, createNewBuffer } from '../utils'
import { Camera, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { Matrix4, Vector3 } from 'three'
import { ElRadioGroup, ElRadio } from 'element-plus'
import 'element-plus/dist/index.css'

const MOVE = 0.2

const transformation = [
  { label: '相机和目标点位置同时改变', value: 'translate' },
  { label: '仅改变相机位置', value: 'rotate' }
]

const transformType = ref('translate')

const vertexCode = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_ViewMatrix;
  
    void main () {
      gl_Position = u_ViewMatrix * a_Position;
      v_Color= a_Color;
    }
  `

const fragmentCode = `
    precision mediump float;
    varying vec4 v_Color;
  
    void main () {
      gl_FragColor = v_Color;
    }
  `

let gl, a_Position, canvas, a_Color, program, u_ViewMatrix, indices

const camera = new Vector3(0.2, 0.2, 0)
const target = new Vector3(0, 0, -1)
const up = new Vector3(0, 1, 0)

const initGl = () => {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)

  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  const matrix = new Matrix4()
  matrix.lookAt(camera, target, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    // 黄
    -0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1, 0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1, 0.5, 0.5, 0.5,
    0.98, 0.86, 0.078, 1, -0.5, 0.5, 0.5, 0.98, 0.86, 0.078, 1,
    // 绿
    -0.5, 0.5, 0.5, 0.45, 0.82, 0.24, 1, -0.5, 0.5, -0.5, 0.45, 0.82, 0.24, 1, -0.5, -0.5, -0.5,
    0.45, 0.82, 0.24, 1, -0.5, -0.5, 0.5, 0.45, 0.82, 0.24, 1,
    // 蓝
    0.5, 0.5, 0.5, 0.086, 0.53, 1, 1, 0.5, -0.5, 0.5, 0.086, 0.53, 1, 1, 0.5, -0.5, -0.5, 0.086,
    0.53, 1, 1, 0.5, 0.5, -0.5, 0.086, 0.53, 1, 1,
    // 橙
    0.5, 0.5, -0.5, 0.98, 0.68, 0.078, 1, 0.5, -0.5, -0.5, 0.98, 0.68, 0.078, 1, -0.5, -0.5, -0.5,
    0.98, 0.68, 0.078, 1, -0.5, 0.5, -0.5, 0.98, 0.68, 0.078, 1,
    // 红
    -0.5, 0.5, 0.5, 1, 0.3, 0.31, 1, 0.5, 0.5, 0.5, 1, 0.3, 0.31, 1, 0.5, 0.5, -0.5, 1, 0.3, 0.31,
    1, -0.5, 0.5, -0.5, 1, 0.3, 0.31, 1,
    // 紫色
    -0.5, -0.5, 0.5, 0.7, 0.5, 0.92, 1, -0.5, -0.5, -0.5, 0.7, 0.5, 0.92, 1, 0.5, -0.5, -0.5, 0.7,
    0.5, 0.92, 1, 0.5, -0.5, 0.5, 0.7, 0.5, 0.92, 1
  ])
  const byte = vertices.BYTES_PER_ELEMENT

  indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16,
    18, 19, 20, 21, 22, 20, 22, 23
  ])

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)
  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0)
  // 颜色值
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3)
  gl.clearColor(0, 0, 0, 0.9)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // gl.drawArrays(gl.TRIANGLES, 0, 6)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

const reDrawCamera = () => {
  const matrix = new Matrix4()
  matrix.lookAt(camera, target, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, matrix.elements)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

const handleUp = () => {
  if (transformType.value === 'translate') {
    const targetRes = target.y + MOVE > 1 ? 1 : target.y + MOVE
    target.setY(targetRes)
  }
  const result = camera.y + MOVE > 1 ? 1 : camera.y + MOVE
  camera.setY(result)
  reDrawCamera()
}

const handleDown = () => {
  if (transformType.value === 'translate') {
    const targetRes = target.y - MOVE < -1 ? -1 : target.y - MOVE
    target.setY(targetRes)
  }
  const result = camera.y - MOVE < -1 ? -1 : camera.y - MOVE
  camera.setY(result)
  reDrawCamera()
}

const handleLeft = () => {
  if (transformType.value === 'translate') {
    const targetRes = target.x - MOVE < -1 ? -1 : target.x - MOVE
    target.setX(targetRes)
  }
  const result = camera.x - MOVE < -1 ? -1 : camera.x - MOVE
  camera.setX(result)
  reDrawCamera()
}

const handleRight = () => {
  if (transformType.value === 'translate') {
    const targetRes = target.x + MOVE > 1 ? 1 : target.x + MOVE
    target.setX(targetRes)
  }
  const result = camera.x + MOVE > 1 ? 1 : camera.x + MOVE
  camera.setX(result)
  reDrawCamera()
}

onMounted(() => {
  initGl()
})
</script>

<style scoped lang="css">
.box {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
.icon {
  cursor: pointer;
  box-sizing: content-box;
  padding: 4px;
  width: 18px;
  height: 18px;
}
.mid {
  display: flex;
}
</style>
