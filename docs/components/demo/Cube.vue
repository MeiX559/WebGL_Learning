<template>
  <canvas
    id="webgl"
    style="background-color: black"
    width="640"
    height="500"
    @mousedown="mousedown"
    @mousemove="mousemove($event, gl, u_ModelMatrix, indices)"
    @mouseleave="mouseleave"
    @mouseup="mouseup"
  ></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { createNewBuffer, createProgram, createShader, useMouseMatrixRotate } from '../utils'
import { Matrix4 } from 'three'

let gl, a_Position, canvas, a_Color, program, u_ModelMatrix, indices

let baseRotateX = 0
let baseRotateY = 0

const { mousemove, mousedown, mouseleave, mouseup } = useMouseMatrixRotate(baseRotateX, baseRotateY)

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;

  void main () {
    gl_Position = u_ModelMatrix * a_Position;
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

function initGl() {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
  program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  const matrix = new Matrix4()
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    -0.5,
    0.5,
    0.5, // v0
    -0.5,
    -0.5,
    0.5, // v1
    0.5,
    -0.5,
    0.5, // v2
    0.5,
    0.5,
    0.5, // v3
    0.5,
    0.5,
    -0.5, // v4
    0.5,
    -0.5,
    -0.5, // v5
    -0.5,
    -0.5,
    -0.5, // v6
    -0.5,
    0.5,
    -0.5 // v7
  ])
  const colors = new Float32Array([
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1
  ])

  indices = new Uint8Array([
    0,
    1,
    2,
    0,
    2,
    3, // 前
    3,
    2,
    5,
    3,
    5,
    4, // 右
    4,
    5,
    6,
    4,
    6,
    7, // 后
    7,
    0,
    6,
    0,
    1,
    6, // 左
    0,
    3,
    4,
    0,
    4,
    7, // 上
    1,
    2,
    5,
    1,
    5,
    6 // 下
  ])

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, 0, 0)
  // 颜色值
  createNewBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4, 0, 0)

  gl.clearColor(0, 0, 0, 0.9)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

onMounted(() => {
  initGl()
})
</script>
