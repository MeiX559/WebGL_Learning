<template>
  <div class="canvas-wrapper" ref="canvasRef"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvasRef = ref(null)
let camera, renderer, scene, controls

function init() {
  const width = canvasRef.value?.offsetWidth || 800
  const height = canvasRef.value?.offsetHeight || 400
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 100)

  scene = new THREE.Scene() //创建场景
  renderer = new THREE.WebGLRenderer() //创建渲染器
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.6) //环境光
  let pointLight = new THREE.PointLight(0xffffff, 0.6) //点光源
  camera.position.set(0, 1, 6)
  scene.add(ambientLight)
  scene.add(camera)
  camera.add(pointLight)

  const loader = new OBJLoader()
  const MTLloader = new MTLLoader()
  renderer.setSize(width, height)
  canvasRef.value.appendChild(renderer.domElement)

  MTLloader.load('/models/Car/Car_Obj.mtl', function (materials) {
    loader.setMaterials(materials)
    loader.load(
      '/models/Car/Car Obj.obj',
      function (obj) {
        scene.add(obj)
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false
        controls.update()
        animate()
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      }
    )
  })
}

function animate() {
  requestAnimationFrame(animate)
  if (controls) controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  init()
})
</script>

<style lang="css" scoped>
.canvas-wrapper {
  margin: 0 auto;
  width: 100%;
  height: 500px;
}
</style>
