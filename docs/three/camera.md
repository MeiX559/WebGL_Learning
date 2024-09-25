# 相机

:::tip 相机
在`three.js`中，相机是一个非常重要的概念，当我们把几何体放到场景中后，我们还需要设置相机，相机相当于"人的眼睛 👁"，有了相机，我们才能看到放在场景中的物体。

比较常用的相机有两种，分别是：透视投影相机`PerspectiveCamera`和正投影相机`OrthographicCamera`。
:::

## 正投影相机`OrthographicCamera`

正投影相机构造函数格式：

```js
// 构造函数格式
OrthographicCamera(left, right, top, bottom, near, far)
```

### 参数

| 参数(属性) | 含义                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------- |
| left       | 渲染空间的左边界                                                                                   |
| right      | 渲染空间的右边界                                                                                   |
| top        | 渲染空间的上边界                                                                                   |
| bottom     | 渲染空间的下边界                                                                                   |
| near       | near 属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 默认值 0.1 。          |
| far        | far 属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小小，会有部分场景看不到。 默认值 2000。 |

### 设置渲染范围

```js
/**
 * 计算相机参数
 * @param {*} width  canvas画布宽
 * @param {*} height canvas画布高
 */
function calculateCameraParameters(width, height) {
  const k = width / height
  const s = 200
  return { k, s }
}
const { k, s } = calculateCameraParameters(600, 600)
const camera = THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
```

### 设置相机位置和观察目标

```js
camera.position.set(200, 300, 200) //设置相机位置
camera.lookAt(scene.position) //观察目标(指向原点)
```

:::warning 注意
需要注意 camera.position 和 far 参数设置的值，确保 camera.position 能够在 far 参数之内，因为超出 far 的将不会渲染。

你可以测试一下：当减小 far 的值，物体不在可视范围内，将看不到物体。
:::

## 透视投影相机`PerspectiveCamera`

透视投影相机和正投影相机类似，参数也是一样的，只不过`PerspectiveCamera`可以模拟人眼观察世界的视觉效果，近大远小，而正投影相机`OrthographicCamera`无论物体距离相机远或近，在最终渲染的图片中物体的大小都保持不变。

使用`OrthographicCamera`渲染江西省地图边界

<script setup>
    import ThreeCamera from '../components/demo/three/threeCamera.vue'
</script>

<ThreeCamera />
