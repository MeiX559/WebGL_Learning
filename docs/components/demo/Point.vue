<template>
  <canvas id="webgl" width="500" height="200" style="background-color: black"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
let canvas: any = null
let gl: any = null

//顶点着色器源码
var vertexShaderSource = `
          // 定义了一个名为 a_Position，类型为 vec4 的 attribute 变量
          void main () {
              // 顶点坐标
              gl_Position = vec4(0.0,0.0,0.0,1.0);
              // 顶点渲染像素大小
              gl_PointSize = 24.0;
          }
          `
//片元着色器源码
var fragShaderSource = `
              void main () {
              // 顶点颜色 (R, G, B, A)
              gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
          }
        `

//声明初始化着色器函数
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER) //创建顶点着色器对象
  gl.shaderSource(vertexShader, vertexShaderSource) //引入顶点着色器源代码
  gl.compileShader(vertexShader) //编译顶点着色器

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) //创建片元着色器对象
  gl.shaderSource(fragmentShader, fragmentShaderSource) //引入片元着色器源代码
  gl.compileShader(fragmentShader) //编译片元着色器

  //创建着色器程序
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader) //为程序program添加顶点着色器
  gl.attachShader(program, fragmentShader) //为程序program添加片元着色器
  gl.linkProgram(program) // 连接 顶点着色器 和 片元着色器，也就是组合成对
  gl.useProgram(program) // 应用着色器程序，告诉 WebGL 绘制的时候使用这个着色程序

  // 开始绘制，显示器显示结果
  gl.drawArrays(gl.POINTS, 0, 1)
}

onMounted(() => {
  //通过getElementById()方法获取canvas画布
  canvas = document.getElementById('webgl')
  //通过方法getContext()获取WebGL上下文
  gl = canvas?.getContext('webgl')
  //初始化着色器
  initShader(gl, vertexShaderSource, fragShaderSource)
})
</script>
