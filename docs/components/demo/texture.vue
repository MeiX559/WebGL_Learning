<template>
  <el-switch v-model="isY" active-text="开启Y轴反转" />
  <canvas id="webgl" width="400" height="200" style="background-color: black"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { createShader, createProgram } from '../utils'
import { ElSwitch } from 'element-plus'
import 'element-plus/dist/index.css'

const imageUrl = '/public/logo.png'
const isY = ref(true)
let canvas: any = null
let gl: any = null

// 顶点着色器
const vertexCode = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;

  void main () {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`
// 片元着色器
const fragmentCode = `
  precision mediump float;
  varying vec2 v_TexCoord;
  uniform sampler2D u_Sampler;

  void main () {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }
`

let a_Position, a_TexCoord, img, program
//声明初始化着色器函数
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
  // 创建顶点着色器对象和片元着色器对象
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  //创建着色器程序
  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord')

  //   创建缓冲区
  const verticesTexCoords = new Float32Array([
    -0.5, 0.5, 0, 1, -0.5, -0.5, 0, 0, 0.5, 0.5, 1, 1, 0.5, -0.5, 1, 0
  ])
  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(a_Position)

  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(a_TexCoord)

  gl.clearColor(0, 0, 0, 0.9)
  gl.clear(gl.COLOR_BUFFER_BIT)

  drawPicture()
}

const drawPicture = () => {
  const texture = gl.createTexture()

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isY.value)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)

  const u_Sampler = gl.getUniformLocation(program, 'u_Sampler')
  gl.uniform1i(u_Sampler, 0)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

watch(isY, () => {
  drawPicture()
})

const initImage = () => {
  img = new Image()
  img.src = imageUrl
  img.onload = function () {
    initGl()
  }
}

function initGl() {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')
  //初始化着色器
  initShader(gl, vertexCode, fragmentCode)
}

onMounted(() => {
  initImage()
})
</script>
