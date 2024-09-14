# Three.js

:::tip 前言
`Three.js` 是一个开源的应用级 `3D JavaScript` 库，其底层是基于`WebGL`，它使浏览器能借助系统显卡在`canvas`中绘制 3D 画面。

`WebGL`自身只能绘制点（points）、线（lines）和三角形（triangles），而`Three.js`对`WebGL`进行了封装，使我们能够方便地创建 物体（objects）, 纹理（textures）, 进行 3D 计算等操作。
:::

刚开始接触`Three.js`,很多概念和 api 都不了解，在这里我们首先看一个案例，通过案例来学习，将可以更清晰的知道`Three.js`的使用。

## 示例

有过`WebGL`基础的人可以知道，`WebGL`只能绘制点、线、三角形，所有图形的基础都是三角形，而`Three.js`则提供了更丰富的功能，它内部封装了立方体、球体、圆柱体等，我们可以通过这些基础图形来创建更加复杂的图形。

### 场景 `Scene`

```js
// 创建场景
var scene = new THREE.Scene()
```

### 创建几何体

```js
var geometry = new THREE.SphereGeometry(60, 60, 60) //创建一个球体几何对象
var geometry = new THREE.BoxGeometry(100, 100, 100) //创建一个立方体几何对象Geometry
```

### 创建材质

```js
var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
}) //材质对象Material
var mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
scene.add(mesh) //网格模型添加到场景中
```

### 光源设置

```js
/**
 * 光源设置
 */
//点光源
var point = new THREE.PointLight(0xffffff)
point.position.set(400, 200, 300) //点光源位置
scene.add(point) //点光源添加到场景中
//环境光
var ambient = new THREE.AmbientLight(0x444444)
scene.add(ambient)
```

### 相机 `Camera`

```js
/**
 * 相机设置
 */
var width = window.innerWidth //窗口宽度
var height = window.innerHeight //窗口高度
var k = width / height //窗口宽高比
var s = 200 //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
camera.position.set(200, 300, 200) //设置相机位置
camera.lookAt(scene.position) //设置相机方向(指向的场景对象)
```

### 渲染器 `Renderer`

```js
/**
 * 创建渲染器对象
 */
var renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value })
renderer.setSize(500, 500) //设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1) //设置背景颜色
//执行渲染操作   指定场景、相机作为参数
renderer.render(scene, camera)
```

经过以上的步骤设置之后，我们将在页面中看到如下图形：

<Three01 />

<script setup>
    import Three01 from '../components/demo/three01.vue'
</script>

## 总结

1. 了解 `Three.js`的定义
2. 通过一个案例学习`Three.js`的使用

## 参考文档

[Three.js](http://www.webgl3d.cn/Three.js/)
