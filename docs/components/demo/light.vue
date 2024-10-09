<template>
  <el-switch v-model="envLight" active-text="开启环境光" />
  <div class="box">
    <canvas
      id="webgl"
      width="300"
      height="300"
      style="background-color: black"
      class="canvas"
    ></canvas>
    <div class="right">
      <p>调整平行光照射方向:</p>
      <el-form>
        <el-form-item label="光源x位置">
          <el-slider v-model="xLight" :max="3" :step="0.01" />
        </el-form-item>
        <el-form-item label="光源y位置">
          <el-slider v-model="yLight" :max="3" :step="0.01" />
        </el-form-item>
        <el-form-item label="光源z位置">
          <el-slider v-model="zLight" :max="3" :step="0.01" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { createNewBuffer, createProgram, createShader } from '../utils'
import { Matrix4, Vector3, Vector4 } from './cuon-matrix'
import { ElForm, ElFormItem, ElSlider, ElSwitch } from 'element-plus'
import 'element-plus/dist/index.css'
const props = defineProps(['type'])
let canvas: any = null
let gl: any = null
const envLight = ref(false) //是否开启环境光
const ENV_LIGHT_RGB = 0.36

const xLight = ref(3)
const yLight = ref(2)
const zLight = ref(1)

//顶点着色器源码
const vertexShaderSource = `
    attribute vec4 a_Position; //顶点位置
    attribute vec4 a_Color; //顶点颜色
    attribute vec3 a_Normal; // 顶点所处面对应的法向量
    varying vec4 v_Color; // 反射光颜色
    uniform mat4 u_MvpMatrix;
    uniform vec4 u_LightColor; // 定义入射光颜色
    uniform vec3 u_LightDirection; // 定义入射光的方向
    uniform vec4 u_AmbientColor; //环境光

    void main () {
    gl_Position = u_MvpMatrix * a_Position; //  MVP 变换
    vec3 normal = normalize(a_Normal); // 归一化顶点对应的法向量
    vec3 normalizeLightDirection = normalize(u_LightDirection); // 归一化光线方向
    float dotProduct = dot(normal, normalizeLightDirection); // 求光线、法向量点积
    vec4 ambient = a_Color * u_AmbientColor;
    vec3 colorRes = vec3(u_LightColor) * vec3(a_Color) * dotProduct; // 计算反射光的颜色
    v_Color= vec4(colorRes, a_Color.a) + ambient; // 将反射光的颜色传递给片元着色器
    }
  `
//片元着色器源码
const fragShaderSource = `
    precision mediump float;
    varying vec4 v_Color;

    void main () {
        gl_FragColor = v_Color;
    }
  `

let a_Position,
  a_Color,
  a_Normal,
  u_MvpMatrix,
  u_LightColor,
  u_LightDirection,
  indices,
  u_AmbientColor,
  u_LightPosition

// 平行光demo
function parallelLight() {
  // 创建顶点着色器对象和片元着色器对象
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource)
  //创建着色器程序
  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  a_Normal = gl.getAttribLocation(program, 'a_Normal')
  u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
  u_LightColor = gl.getUniformLocation(program, 'u_LightColor') //入射光颜色
  u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection') //入射光线方向
  u_AmbientColor = gl.getUniformLocation(program, 'u_AmbientColor') // 环境光

  const matrix = new Matrix4()
  matrix.perspective(60, 1, 1, 100).lookAt(1.3, 1.3, 1.3, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_MvpMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    // 蓝 1（前）
    // 顶点(x, y, z) 颜色(r, g, b, a) 法向量(xn, yn, zn)
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, 0, 1, 0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, 0, 1, 0.5, 0.5,
    0.5, 0.08, 0.5, 1, 1, 0, 0, 1, -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0, 0, 1,
    // 蓝 2
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, -1, 0, 0, -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, -1, 0, 0, -0.5,
    -0.5, -0.5, 0.08, 0.5, 1, 1, -1, 0, 0, -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, -1, 0, 0,
    // 蓝 3
    0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 1, 0, 0, 0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 1, 0, 0, 0.5, -0.5,
    -0.5, 0.08, 0.5, 1, 1, 1, 0, 0, 0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 1, 0, 0,
    // 蓝 4
    0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1, 0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1, -0.5,
    -0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1, -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1,
    // 蓝 5
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0, 1, 0, 0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0, 1, 0, 0.5, 0.5,
    -0.5, 0.08, 0.5, 1, 1, 0, 1, 0, -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0, 1, 0,
    // 蓝 6
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, -1, 0, -0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0, -1, 0, 0.5,
    -0.5, -0.5, 0.08, 0.5, 1, 1, 0, -1, 0, 0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, -1, 0
  ])

  const byte = vertices.BYTES_PER_ELEMENT

  indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16,
    18, 19, 20, 21, 22, 20, 22, 23
  ])

  addLight() //平行光
  ambientLight() //环境光

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 10, 0)
  // 颜色值
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 10, byte * 3)
  // 点的法向量
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Normal, 3, byte * 10, byte * 7)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

// 添加平行光
function addLight() {
  const lightColor = new Vector4(1.0, 1.0, 1.0, 1.0) //入射光颜色
  gl.uniform4fv(u_LightColor, lightColor.elements)

  const lightDirection = new Vector3(xLight.value, yLight.value, zLight.value) //入射光方向
  gl.uniform3fv(u_LightDirection, lightDirection.elements)
}

// 添加环境光
function ambientLight() {
  const ambientColor = envLight.value
    ? new Vector4(ENV_LIGHT_RGB, ENV_LIGHT_RGB, ENV_LIGHT_RGB, 1)
    : new Vector4(0, 0, 0, 1)
  gl.uniform4fv(u_AmbientColor, ambientColor.elements)
}

// 点光源
function pointLight() {
  //顶点着色器源码
  const vertexShaderSource = `
    attribute vec4 a_Position; //顶点位置
    attribute vec4 a_Color; //顶点颜色
    attribute vec3 a_Normal; // 顶点所处面对应的法向量
    varying vec4 v_Color; // 反射光颜色
    uniform mat4 u_MvpMatrix;
    uniform vec4 u_LightColor; // 定义入射光颜色
    uniform vec3 u_LightPosition; // 点光源位置
    uniform vec4 u_AmbientColor; //环境光

    void main () {
    gl_Position = u_MvpMatrix * a_Position; //  MVP 变换
    vec3 normal = normalize(a_Normal); // 归一化顶点对应的法向量
    // 求出当前顶点对应的光线方向（两向量相减）
    vec3 lightDirection = normalize(u_LightPosition - vec3(a_Position));
    float dotProduct = dot(normal, lightDirection); // 求光线、法向量点积
    vec4 ambient = a_Color * u_AmbientColor;
    vec3 colorRes = vec3(u_LightColor) * vec3(a_Color) * dotProduct; // 计算反射光的颜色
    v_Color= vec4(colorRes, a_Color.a) + ambient; // 将反射光的颜色传递给片元着色器
    }
  `
  //片元着色器源码
  const fragShaderSource = `
    precision mediump float;
    varying vec4 v_Color;

    void main () {
        gl_FragColor = v_Color;
    }
  `

  // 创建顶点着色器对象和片元着色器对象
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource)
  //创建着色器程序
  const program = createProgram(gl, vertexShader, fragmentShader)

  a_Position = gl.getAttribLocation(program, 'a_Position')
  a_Color = gl.getAttribLocation(program, 'a_Color')
  a_Normal = gl.getAttribLocation(program, 'a_Normal')
  u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
  u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
  u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition')
  u_AmbientColor = gl.getUniformLocation(program, 'u_AmbientColor')

  const matrix = new Matrix4()
  matrix.perspective(60, 1, 1, 100).lookAt(1.3, 1.3, 1.3, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_MvpMatrix, false, matrix.elements)

  const vertices = new Float32Array([
    // 蓝 1（前）
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, 0, 1, 0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, 0, 1, 0.5, 0.5,
    0.5, 0.08, 0.5, 1, 1, 0, 0, 1, -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0, 0, 1,
    // 蓝 2
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, -1, 0, 0, -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, -1, 0, 0, -0.5,
    -0.5, -0.5, 0.08, 0.5, 1, 1, -1, 0, 0, -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, -1, 0, 0,
    // 蓝 3
    0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 1, 0, 0, 0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 1, 0, 0, 0.5, -0.5,
    -0.5, 0.08, 0.5, 1, 1, 1, 0, 0, 0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 1, 0, 0,
    // 蓝 4
    0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1, 0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1, -0.5,
    -0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1, -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0, 0, -1,
    // 蓝 5
    -0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0, 1, 0, 0.5, 0.5, 0.5, 0.08, 0.5, 1, 1, 0, 1, 0, 0.5, 0.5,
    -0.5, 0.08, 0.5, 1, 1, 0, 1, 0, -0.5, 0.5, -0.5, 0.08, 0.5, 1, 1, 0, 1, 0,
    // 蓝 6
    -0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, -1, 0, -0.5, -0.5, -0.5, 0.08, 0.5, 1, 1, 0, -1, 0, 0.5,
    -0.5, -0.5, 0.08, 0.5, 1, 1, 0, -1, 0, 0.5, -0.5, 0.5, 0.08, 0.5, 1, 1, 0, -1, 0
  ])

  const byte = vertices.BYTES_PER_ELEMENT

  indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16,
    18, 19, 20, 21, 22, 20, 22, 23
  ])
  const lightColor = new Vector4(1.0, 1.0, 1.0, 1.0)
  gl.uniform4fv(u_LightColor, lightColor.elements)

  const lightPosition = new Vector3(xLight.value, yLight.value, zLight.value)
  gl.uniform3fv(u_LightPosition, lightPosition.elements)

  ambientLight()

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)

  // 顶点坐标
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 3, byte * 10, 0)
  // 颜色值
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Color, 4, byte * 10, byte * 3)
  // 点的法向量
  createNewBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Normal, 3, byte * 10, byte * 7)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

watch([xLight, yLight, zLight], () => {
  const lightDirection = new Vector3(xLight.value, yLight.value, zLight.value)
  gl.uniform3fv(u_LightDirection, lightDirection.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
})

// 监听环境光是否开启
watch(envLight, (light) => {
  const ambientColor = light
    ? new Vector4(ENV_LIGHT_RGB, ENV_LIGHT_RGB, ENV_LIGHT_RGB, 1)
    : new Vector4(0, 0, 0, 1)
  gl.uniform4fv(u_AmbientColor, ambientColor.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
})

onMounted(() => {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')
  switch (props.type) {
    // 平行光
    case 'parallelLight':
      parallelLight()
      break
    // 环境光
    case 'ambientLight':
      ambientLight()
      break
    case 'pointLight':
      pointLight()
      break
    default:
      break
  }
})
</script>

<style lang="css" scoped>
.box {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.right {
  flex: 1;
  margin-left: 10px;
}
</style>
