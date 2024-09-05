<template>
  <!-- 平移 -->
  <el-form label-position="top" style="width: 600px" v-if="props.optType === OptTypes.TRANSLATION">
    <el-form-item label="x偏移值：">
      <el-slider v-model="xVal" :min="-1" :max="1" :step="0.01" />
    </el-form-item>
    <el-form-item label="y偏移值：">
      <el-slider v-model="yVal" :min="-1" :max="1" :step="0.01" />
    </el-form-item>
  </el-form>
  <el-form label-position="top" style="width: 600px" v-if="props.optType === OptTypes.ZOOM">
    <el-form-item label="scale缩放比例">
      <el-slider v-model="scaleVal" :min="-1" :max="1" :step="0.01" />
    </el-form-item>
  </el-form>
  <canvas id="webgl" width="400" height="200" style="background-color: black"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { createBuffer, createProgram, createShader } from '../utils'
import { ElForm, ElFormItem, ElSlider } from 'element-plus'
import 'element-plus/dist/index.css'
import { OptTypes } from '../types'

let canvas: any = null
let gl: any = null

const xVal = ref(0) //平移时x轴偏移量
const yVal = ref(0) //平移时y轴偏移量
const defaultOrigin = 50.0
const scaleVal = ref(defaultOrigin) //缩放比例

// 从父组件接收的 prop
const props = defineProps<{
  optType: number
}>()

//顶点着色器源码
var vertexShaderSource = `
        // 定义了一个名为 a_Position，类型为 vec4 的 attribute 变量
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        uniform vec4 u_Position; // 定义平移位置变量
        uniform float u_Scale; // 定义缩放变量
        void main () {
            gl_Position = a_Position + u_Position; // 顶点坐标
            v_Color= a_Color;
        }
        `
//片元着色器源码
var fragShaderSource = `
            precision mediump float;
            varying vec4 v_Color;
            void main () {
            gl_FragColor = v_Color;// 顶点颜色 (R, G, B, A)
        }
      `

let a_Position, a_Color, program

function initShader(gl, vertexShaderSource, fragmentShaderSource) {
  // 创建顶点着色器对象和片元着色器对象
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  //创建着色器程序
  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')

  const vertices = new Float32Array([-0.3, -0.3, 0, 0.6, 0.3, -0.3])
  const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1])

  createBuffer(gl, vertices, { attribute: a_Position, size: 2 })
  createBuffer(gl, colors, { attribute: a_Color, size: 4 })

  gl.clearColor(0, 0, 0, 0.9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  //   画一个三角形
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

watch(xVal, (x) => {
  const u_Position = gl.getUniformLocation(program, 'u_Position')
  const xMoveVertices = new Float32Array([x, yVal.value, 0, 0])
  gl.uniform4fv(u_Position, xMoveVertices)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})

watch(yVal, (y) => {
  const u_Position = gl.getUniformLocation(program, 'u_Position')
  const xMoveVertices = new Float32Array([xVal.value, y, 0, 0])
  gl.uniform4fv(u_Position, xMoveVertices)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})

watch(scaleVal, (x) => {
  const u_Position = gl.getUniformLocation(program, 'u_Scale')
  const scale = scaleVal.value / defaultOrigin
  gl.uniform1f(u_Position, scale)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})

function initGl() {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')
  //初始化着色器
  if (props.optType === OptTypes.ZOOM) {
    vertexShaderSource = `
    // 定义了一个名为 a_Position，类型为 vec4 的 attribute 变量
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        uniform vec4 u_Position; // 定义平移位置变量
        uniform float u_Scale; // 定义缩放变量
        void main () {
            gl_Position = vec4(a_Position.x * u_Scale, a_Position.y * u_Scale, 0., 1.); // 顶点坐标
            v_Color= a_Color;
        }
    `
  }
  initShader(gl, vertexShaderSource, fragShaderSource)
}

onMounted(() => {
  initGl()
})
</script>
