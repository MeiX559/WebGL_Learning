<template>
  <button type="button" @click="drawLine" class="btns left">单独线</button>
  <button type="button" @click="drawLineStrip" class="btns left">连续线</button>
  <button type="button" @click="drawLineLoop" class="btns left">连续线（首尾相连）</button>
  <button type="button" @click="drawTriangle" class="btns left">三角形</button>
  <button type="button" @click="drawTriangleStrip" class="btns left">组合三角形</button>
  <button type="button" @click="drawTriangleFan" class="btns">组合扇形</button>
  <canvas
    id="webgl"
    width="500"
    height="200"
    style="background-color: black"
    class="canvas"
  ></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createBuffer, createShader, createProgram } from '../utils'
let canvas: any = null
let gl: any = null

//顶点着色器源码
var vertexShaderSource = `
            // 待分配缓冲区的 attribute 变量
            attribute vec4 a_Position;
            attribute vec4 a_Color;
            varying vec4 v_Color;

            void main () {
                gl_Position = a_Position;
                v_Color= a_Color;
            }
            `
//片元着色器源码
var fragShaderSource = `
                precision mediump float;
                varying vec4 v_Color;
                void main () {
                // 顶点颜色 (R, G, B, A)
                // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
                gl_FragColor = v_Color;
            }
          `
let a_Position, a_Color

//声明初始化着色器函数
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
  // 创建顶点着色器对象和片元着色器对象
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  //创建着色器程序
  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')

  //   创建缓冲区
  //   const vertices = new Float32Array([0, 0.8, -0.6, -0.6, 0.6, -0.6])
  const vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0, 0.5, 0, -0.5, 0.5, 0.5, 0.5, -0.5]) //   顶点坐标
  //   创建顶点缓冲区
  createBuffer(gl, vertices, { attribute: a_Position, size: 2 })
  const verticesColors = new Float32Array([
    -0.5, 0.5, 1, 0, 0, 1, -0.5, -0.5, 1, 0, 0, 1, 0, 0.5, 0, 1, 0, 1, 0, -0.5, 0, 1, 0, 1, 0.5,
    0.5, 0, 0, 1, 1, 0.5, -0.5, 0, 0, 1, 1
  ]) //  颜色数据
  //   创建颜色缓冲区
  createBuffer(gl, verticesColors, { attribute: a_Color, size: 4 })

  gl.clearColor(0, 0, 0, 0.9)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 绘制直线
  //   gl.drawArrays(gl.LINES, 0, 3)
  // 绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

onMounted(() => {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')
  //初始化着色器
  initShader(gl, vertexShaderSource, fragShaderSource)
})

// 绘制直线
// gl.LINES 绘制单独的线段
function drawLine() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.LINES, 0, 3)
}

// gl.LINE_STRIP 绘制连接的线段
function drawLineStrip() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.LINE_STRIP, 0, 3)
}

// gl.LINE_LOOP 绘制连接的线段，最后一个点会和第一个点连接
function drawLineLoop() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.LINE_LOOP, 0, 3)
}

// 绘制三角形
// gl.TRIANGLES 绘制多个单独的三角形
function drawTriangle() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

// gl.TRIANGLE_STRIP 绘制组合的三角形，从第二个点开始，每三个点构成一个三角形。比如下文逆时针绘制的图片 v1（就是第二个点） 跟 v2、v3 就组成一个新的三角形。
function drawTriangleStrip() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
}

// gl.TRIANGLE_FAN 绘制组合的三角形（扇形），全部三角共用同一个点，每下一个点和前一个三角形的最后一条边组成新的三角形
function drawTriangleFan() {
  const vertices = new Float32Array([
    0,
    0,
    -0.5,
    0.3, // v0, v1
    -0.3,
    0.6,
    0,
    0.8, // v2, v3
    0.3,
    0.6,
    0.5,
    0.3 // v4, v5
  ])
  //   创建缓冲区
  createBuffer(gl, vertices, { attribute: a_Position, size: 2 })
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6)
}
</script>

<style lang="css" scoped>
.btns {
  width: fit-content;
  border: 1px solid #409eff;
  background-color: #409eff;
  border-radius: 10%;
  padding: 5px 10px;
}
.left {
  margin-right: 10px;
}
.canvas {
  margin-top: 10px;
}
</style>
