# 生成曲线、几何体

<script setup>
    import Three04 from '../components/demo/three/three04.vue'
</script>

## 生成圆弧

### 生成圆弧顶点数据并创建

以坐标原点为中点，生成圆弧所有的顶点数据

```js
const R = 100 //圆弧半径
const N = 50 //分段数量
const sp = (2 * Math.PI) / N //两个相邻点间隔弧度
// 批量生成圆弧上的顶点数据
const arr = []
// N控制圆弧精度：就是创建多少个顶点
for (let i = 0; i < N; i++) {
  const angle = sp * i //当前点弧度
  // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
  const x = R * Math.cos(angle)
  const y = R * Math.sin(angle)
  arr.push(x, y, 0) //xyz坐标
}

//类型数组创建顶点数据
const vertices = new Float32Array(arr)
```

### 使用线模型渲染弧线

```js
var material = new THREE.LineBasicMaterial({
  color: 0xff0000 //线条颜色
}) //材质对象
var line = new THREE.LineLoop(geometry, material) //线条模型对象
scene.add(line) //线条对象添加到场景中
```

:::details 完整代码

```js
const R = 100 //圆弧半径
const N = 50 //分段数量
const sp = (2 * Math.PI) / N //两个相邻点间隔弧度
// 批量生成圆弧上的顶点数据
const arr = []
for (let i = 0; i < N; i++) {
  const angle = sp * i //当前点弧度
  // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
  const x = R * Math.cos(angle)
  const y = R * Math.sin(angle)
  arr.push(x, y, 0)
}
//类型数组创建顶点数据
const vertices = new Float32Array(arr)
// 创建属性缓冲区对象
var attribue = new THREE.BufferAttribute(vertices, 3) //3个为一组，作为一个顶点的xyz坐标
// 设置几何体attributes属性的位置position属性
geometry.attributes.position = attribue
```

:::

如果想绘制半圆弧，可以修改

```js
const sp = (2 * Math.PI) / N //完整圆弧
const sp = (1 * Math.PI) / N //半圆弧
```

### `setFromPoints`

使用三维向量 Vector3 表示顶点的 x,y,z 坐标，作为数组元素创建的一组顶点坐标。

```js
new THREE.Vector3(x, y, 0)
```

使用几何体方法`setFromPoints`赋值给几何体

```js
geometry.setFromPoints(arr)
```

完整代码：
:::details 完整代码

```js
const R = 100 //圆弧半径
const N = 50 //分段数量
const sp = (2 * Math.PI) / N //两个相邻点间隔弧度
// 批量生成圆弧上的顶点数据
const arr = []
for (let i = 0; i < N; i++) {
  const angle = sp * i //当前点弧度
  // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
  const x = R * Math.cos(angle)
  const y = R * Math.sin(angle)
  // arr.push(x, y, 0);
  arr.push(new THREE.Vector3(x, y, 0))
}
geometry.setFromPoints(arr)
```

:::

<Three04 type="arc" />

## 贝塞尔曲线

<Three04 type="besselCurve" />

## 拉伸`ExtrudeGeometry`

定义多边形轮廓

```js
const shape = new THREE.Shape([
  // 按照特定顺序，依次书写多边形顶点坐标
  new THREE.Vector3(-50, -50, 5), //多边形起点
  new THREE.Vector3(-50, 50, 5),
  new THREE.Vector3(50, 50, 5),
  new THREE.Vector3(50, -50, 5)
])
```

拉伸

```js
geometry = new THREE.ExtrudeGeometry(
  shape, //二维轮廓
  {
    bevelSegments: 1,
    depth: 60 //拉伸长度
  }
)
```

<Three04 type="extrudeGeometry" />

## 扫描`ExtrudeGeometry`

定义扫描轮廓

```js
// 扫描轮廓：Shape表示一个平面多边形轮廓
const shape = new THREE.Shape([
  // 按照特定顺序，依次书写多边形顶点坐标
  new THREE.Vector2(0, 0), //多边形起点
  new THREE.Vector2(0, 10),
  new THREE.Vector2(10, 10),
  new THREE.Vector2(10, 0)
])
```

定义扫描轨迹

```js
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, -50, -50),
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(8, 50, 50),
  new THREE.Vector3(-5, 0, 100)
])
```

扫描

```js
geometry = new THREE.ExtrudeGeometry(
  shape, //扫描轮廓
  {
    extrudePath: curve, //扫描轨迹
    steps: 10000 //沿着路径细分精度，越大越光滑
  }
)
```

<Three04 type="sExtrudeGeometry" />
