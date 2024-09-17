<template>
  <el-button type="primary" @click="drawCube" class="btns">立方体</el-button>
  <el-button type="primary" @click="drawCubeColor" class="btns">纯色立方体</el-button>
  <el-button type="primary" @click="drawCubeLine" class="btns">线立方体</el-button>
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
import { onMounted, ref, watch } from 'vue';
import { createNewBuffer, createProgram, createShader, useMouseMatrixRotate } from '../utils';
import { Matrix4 } from 'three';
import { ElButton } from 'element-plus';
import 'element-plus/dist/index.css';

let gl, a_Position, canvas, a_Color, program, u_ModelMatrix, indices;

let baseRotateX = 70;
let baseRotateY = -30;

const { mousemove, mousedown, mouseleave, mouseup } = useMouseMatrixRotate(baseRotateX, baseRotateY);

const vertexCode = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;

  void main () {
    gl_Position = u_ModelMatrix * a_Position;
    v_Color= a_Color;
  }
`;

const fragmentCode = `
  precision mediump float;
  varying vec4 v_Color;

  void main () {
    gl_FragColor = v_Color;
  }
`;

function initGl() {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl');
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl');

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode);
  program = createProgram(gl, vertexShader, fragmentShader);

  a_Position = gl.getAttribLocation(program, 'a_Position');
  a_Color = gl.getAttribLocation(program, 'a_Color');
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
  const matrix = new Matrix4();
  const radian = ((baseRotateX % 360) * Math.PI) / 180;
  matrix.makeRotationY(radian);
  const matrix2 = new Matrix4();
  const radian2 = ((baseRotateY % 360) * Math.PI) / 180;
  matrix2.makeRotationX(radian2);
  matrix2.multiply(matrix);
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrix2.elements);

  drawCube();
}

function drawCube() {
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
  ]);
  const colors = new Float32Array([1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1]);

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
  ]);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);

  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, 0, 0);
  // 颜色值
  createNewBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4, 0, 0);
  gl.clearColor(0, 0, 0, 0.9);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function drawCubeColor() {
  const vertices = new Float32Array([
    // 黄
    -0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1, 0.5, -0.5, 0.5, 0.98, 0.86, 0.078, 1, 0.5, 0.5, 0.5, 0.98, 0.86, 0.078, 1, -0.5, 0.5, 0.5, 0.98, 0.86,
    0.078, 1,
    // 绿
    -0.5, 0.5, 0.5, 0.45, 0.82, 0.24, 1, -0.5, 0.5, -0.5, 0.45, 0.82, 0.24, 1, -0.5, -0.5, -0.5, 0.45, 0.82, 0.24, 1, -0.5, -0.5, 0.5, 0.45, 0.82,
    0.24, 1,
    // 蓝
    0.5, 0.5, 0.5, 0.086, 0.53, 1, 1, 0.5, -0.5, 0.5, 0.086, 0.53, 1, 1, 0.5, -0.5, -0.5, 0.086, 0.53, 1, 1, 0.5, 0.5, -0.5, 0.086, 0.53, 1, 1,
    // 橙
    0.5, 0.5, -0.5, 0.98, 0.68, 0.078, 1, 0.5, -0.5, -0.5, 0.98, 0.68, 0.078, 1, -0.5, -0.5, -0.5, 0.98, 0.68, 0.078, 1, -0.5, 0.5, -0.5, 0.98, 0.68,
    0.078, 1,
    // 红
    -0.5, 0.5, 0.5, 1, 0.3, 0.31, 1, 0.5, 0.5, 0.5, 1, 0.3, 0.31, 1, 0.5, 0.5, -0.5, 1, 0.3, 0.31, 1, -0.5, 0.5, -0.5, 1, 0.3, 0.31, 1,
    // 紫色
    -0.5, -0.5, 0.5, 0.7, 0.5, 0.92, 1, -0.5, -0.5, -0.5, 0.7, 0.5, 0.92, 1, 0.5, -0.5, -0.5, 0.7, 0.5, 0.92, 1, 0.5, -0.5, 0.5, 0.7, 0.5, 0.92, 1
  ]);
  const byte = vertices.BYTES_PER_ELEMENT;

  indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
  ]);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);
  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 7, 0);
  // 颜色值
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 7, byte * 3);
  gl.clearColor(0, 0, 0, 0.9);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

// 线立方体
function drawCubeLine() {
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
  ]);

  indices = new Uint8Array([
    0,
    1,
    2,
    3, // 前
    3,
    2,
    5,
    4, // 右
    4,
    5,
    6,
    7, // 后
    0,
    1,
    6,
    7, // 左
    0,
    3,
    4,
    7, // 上
    6,
    1,
    2,
    5 // 下
  ]);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);

  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, 0, 0);

  gl.clearColor(0, 0, 0, 0.9);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);
}

onMounted(() => {
  initGl();
});
</script>

<style scoped>
.btns {
  margin-bottom: 10px;
}
</style>
