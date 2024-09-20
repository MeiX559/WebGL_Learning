<template>
  <div id="app">
    <canvas ref="canvas" width="1000" height="1000"></canvas>
    <!-- 文字提示 -->
    <div id="tooltip" :style="tooltipStyle">
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as d3 from 'd3'
import jsonData from '../json/china.json'

const canvas = ref<HTMLCanvasElement | null>(null)
const tooltipText = ref('')
const tooltipVisible = ref('hidden')
const tooltipPosition = ref({ x: 0, y: 0 })

const tooltipStyle: any = computed(() => ({
  visibility: tooltipVisible.value || 'hidden',
  left: `${tooltipPosition.value.x}px`,
  top: `${tooltipPosition.value.y}px`
}))

let scene: THREE.Scene, //场景
  camera: THREE.PerspectiveCamera, //相机
  renderer: THREE.WebGLRenderer, //渲染器
  map: THREE.Object3D, //地图，用于存储所有的省份对象
  raycaster: THREE.Raycaster, //光标射线
  mouse: THREE.Vector2, //光标位置
  lastPick: any

const init = () => {
  scene = new THREE.Scene() //创建场景
  setRenderer()
  setCamera()
  setController()
  setRaycaster()
  generateGeometry(jsonData)
  animate()
}

// 设置渲染器
const setRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value!
  })
  renderer.setSize(1000, 600)
}

// 设置相机
const setCamera = () => {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 120)
  camera.lookAt(scene.position)
}

const setController = () => {
  const controls = new OrbitControls(camera, canvas.value!)
  controls.enableDamping = true
}

const setRaycaster = () => {
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  const onMouseMove = (event: MouseEvent) => {
    // 获取canvas的边界框
    const canvasBounds = canvas.value!.getBoundingClientRect()
    // 计算相对于canvas的鼠标位置
    const mouseX = event.clientX - canvasBounds.left
    const mouseY = event.clientY - canvasBounds.top
    // 将相对位置转换为NDC坐标 (归一化设备坐标)
    mouse.x = (mouseX / canvasBounds.width) * 2 - 1
    mouse.y = -(mouseY / canvasBounds.height) * 2 + 1
    // 更新tooltip位置
    tooltipPosition.value = { x: mouseX + 10, y: mouseY + 10 }
  }

  window.addEventListener('mousemove', onMouseMove)

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
  })
}

const generateGeometry = (jsondata: any) => {
  map = new THREE.Object3D()
  // D3.js 的地理投影对象，用于将经纬度坐标转换为二维坐标
  const projection = d3.geoMercator().center([104.0, 37.5]).translate([0, 0])

  jsondata.features?.forEach((elem: any) => {
    // 省份
    const province: any = new THREE.Object3D()
    const coordinates = elem.geometry.coordinates //经纬度坐标

    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        const shape = new THREE.Shape() //创建几何的平面形状
        const points: THREE.Vector3[] = []

        for (let i = 0; i < polygon.length; i++) {
          const [x, y]: any = projection(polygon[i])
          if (i === 0) {
            shape.moveTo(x, -y) //使用 D3.js 转换后的坐标，将形状的顶点连接起来
          }
          shape.lineTo(x, -y)
          points.push(new THREE.Vector3(x, -y, 5))
        }
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

        const extrudeSettings = {
          depth: 10,
          bevelEnabled: false
        }
        // 将二维形状挤出到 3D 空间，生成带有深度的省份模型
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        // 为每个省份的几何形状应用基础材质，使其具有颜色和透明度。
        const material = new THREE.MeshBasicMaterial({
          color: '#2defff',
          transparent: true,
          opacity: 0.6
        })
        const material1 = new THREE.MeshBasicMaterial({
          color: '#3480C4',
          transparent: true,
          opacity: 0.5
        })

        const mesh = new THREE.Mesh(geometry, [material, material1])
        // 为省份的边界创建白色线框图
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 'white'
        })
        const line = new THREE.Line(lineGeometry, lineMaterial)
        province.properties = elem.properties
        // 将mesh和line添加到省份对象中
        province.add(mesh)
        province.add(line)
      })
    })
    map.add(province)
  })
  scene.add(map)
}

const animate = () => {
  requestAnimationFrame(animate)
  raycaster.setFromCamera(mouse, camera)
  const intersects: any = raycaster.intersectObjects(scene.children, true)

  // 恢复上一次清空的
  if (lastPick) {
    lastPick.object.material[0].color.set('#2defff')
    lastPick.object.material[1].color.set('#3480C4')
  }
  lastPick = null
  lastPick = intersects.find((item) => item.object.material && item.object.material.length === 2)
  if (lastPick) {
    lastPick.object.material[0].color.set(0xff0000)
    lastPick.object.material[1].color.set(0xff0000)
  }

  if (intersects.length > 0 && intersects[0]?.object?.parent?.properties) {
    tooltipText.value = intersects[0].object.parent.properties.name || ''
    tooltipVisible.value = 'visible'
  } else {
    tooltipVisible.value = 'hidden'
  }
  render()
}

const render = () => {
  renderer.render(scene, camera)
}

// 添加辅助线
function addHelper() {
  const helper = new THREE.CameraHelper(camera)
  scene.add(helper)
}

onMounted(() => {
  init()
})
</script>

<style scoped>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#tooltip {
  position: absolute;
  z-index: 2;
  background: white;
  color: #000000ff;
  padding: 10px;
  border-radius: 2px;
}
</style>
