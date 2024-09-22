# Three.js 几何体顶点概念

:::tip
在上一小节我们通过 three.js 的`BoxGeometry`绘制了一个立方体，three.js 封装了一些几何体的方法，其实它底层都是基于`BufferGeometry`类构建的。

`BufferGeometry`是一个没有任何形状的空几何体，我们可以通过定义顶点数据来自定义任何的几何体形状。对于顶点数据，相信看了之前`WebGL`应该已经了解了，这里的顶点数据跟`WebGL`是类似的。
:::

## 缓冲类型几何体`BufferGeometry`

### 创建空的几何体对象

```js
//创建一个空的几何体对象
const geometry = new THREE.BufferGeometry();
```

### 通过类型化数组创建几何体的顶点坐标

```js
//类型化数组创建顶点数据
const vertices = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  50,
  0,
  0, //顶点2坐标
  0,
  100,
  0, //顶点3坐标
  0,
  0,
  10, //顶点4坐标
  0,
  0,
  100, //顶点5坐标
  50,
  0,
  10 //顶点6坐标
]);
```

使用`BufferAttribute`缓冲区对象表示几何体的顶点数据

```js
const attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
geometry.attributes.position = attribue; // 设置几何体attributes属性的位置属性
```

:::warning 注意
`three.js` 的坐标和 `WebGL` 类似，坐标原点都位于中心点，不同的是`WebGL`的坐标范围是(-1,1)，而 three.js 的范围是画布的大小。

在`three.js`中定义顶点数据其实可以和`WebGL`做类比，方便理解。
:::

### 点模型

点模型和 Mesh 模型都是 three.js 的一种模型对象，类似的，点模型也有自己对应的材质`PointsMaterial`

```js
var material = new THREE.PointsMaterial({
  vertexColors: true, //是否启用顶点颜色
  size: 10.0 //点对象像素尺寸
}); //材质对象
var points = new THREE.Points(geometry, material); //点模型对象
scene.add(points); //点对象添加到场景中
```

### 线模型

线模型的渲染效果是从第一个点开始到最后一个点，依次连接成线。

```js
var material = new THREE.LineBasicMaterial({
  // color: 0xff0000 //线条颜色
  vertexColors: true
}); //材质对象
var line = new THREE.Line(geometry, material); //线条模型对象
scene.add(line); //线条对象添加到场景中
```

除了有`Line`，`three.js`还提供了`LineLoop`,`LineSegments`，和`Line`的区别就是绘制线条的规则不同。

```js
// 闭合线条
const line = new THREE.LineLoop(geometry, material);

//非连续的线条
const line = new THREE.LineSegments(geometry, material);
```

### 网格模型

在学习`WebGL`中我们已经知道，绘制图形的基础是三角形，`three.js`的网格模型 Mesh 其实也是有一个个三角形面构成。

```js
var material = new THREE.MeshBasicMaterial({
  color: 0x0000ff, //三角面颜色
  // vertexColors: true,
  side: THREE.DoubleSide //两面可见
}); //材质对象
// 场景网格对象
const mesh = createMesh(geometry, material);
scene.add(mesh);
```

以下是通过`BufferGeometry`创建的几何体，分别使用点模型、线模型、网格模型展示不同的效果。大家可以切换选择查看。

<Three03 />

<script setup>
    import Three03 from '../components/demo/three03.vue'
</script>
