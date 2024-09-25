<template>
  <canvas ref="canvas" width="600" height="600"></canvas>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';

const canvas = ref(null);

function createGeometry() {
  return new THREE.BoxGeometry(100, 100, 100);
}

function createMaterial() {
  return new THREE.MeshLambertMaterial({ color: 0x0000ff });
}

function createMesh(geometry, material) {
  return new THREE.Mesh(geometry, material);
}

function addMeshToScene(scene, mesh) {
  scene.add(mesh);
}

function createPointLight() {
  const point = new THREE.PointLight(0xffffff);
  point.position.set(400, 200, 300);
  return point;
}

function addPointLightToScene(scene, pointLight) {
  scene.add(pointLight);
}

function createAmbientLight() {
  return new THREE.AmbientLight(0x444444);
}

function addAmbientLightToScene(scene, ambientLight) {
  scene.add(ambientLight);
}

function calculateCameraParameters(width, height) {
  const k = width / height;
  const s = 200;
  return { k, s };
}

function createCamera(k, s) {
  return new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
}

function setCameraPositionAndLookAt(camera, scene) {
  camera.position.set(200, 300, 200);
  camera.lookAt(scene.position);
}

function createRenderer(canvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas: canvasElement });
  renderer.setSize(600, 600);
  renderer.setClearColor(0xb9d3ff, 1);
  return renderer;
}

// 创建控件，鼠标控制
function setController(camera) {
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;
}

onMounted(() => {
  // 创建场景
  const scene = new THREE.Scene();
  // 创建几何体
  const geometry = createGeometry();
  // 创建材质;
  const material = createMaterial();

  // var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  // //类型数组创建顶点数据
  // var vertices = new Float32Array([
  //   0,
  //   0,
  //   0, //顶点1坐标
  //   50,
  //   0,
  //   0, //顶点2坐标
  //   0,
  //   100,
  //   0, //顶点3坐标

  //   0,
  //   0,
  //   10, //顶点4坐标
  //   0,
  //   0,
  //   100, //顶点5坐标
  //   50,
  //   0,
  //   10 //顶点6坐标
  // ]);
  // // 创建属性缓冲区对象
  // var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，作为一个顶点的xyz坐标
  // // 设置几何体attributes属性的位置position属性
  // geometry.attributes.position = attribue;
  // //类型数组创建顶点颜色color数据
  // var colors = new Float32Array([
  //   1,
  //   0,
  //   0, //顶点1颜色
  //   0,
  //   1,
  //   0, //顶点2颜色
  //   0,
  //   0,
  //   1, //顶点3颜色

  //   1,
  //   1,
  //   0, //顶点4颜色
  //   0,
  //   1,
  //   1, //顶点5颜色
  //   1,
  //   0,
  //   1 //顶点6颜色
  // ]);
  // // 设置几何体attributes属性的颜色color属性
  // geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
  // // 定义顶点法向量数据
  // var normals = new Float32Array([
  //   0,
  //   0,
  //   1, //顶点1法向量
  //   0,
  //   0,
  //   1, //顶点2法向量
  //   0,
  //   0,
  //   1, //顶点3法向量

  //   0,
  //   1,
  //   0, //顶点4法向量
  //   0,
  //   1,
  //   0, //顶点5法向量
  //   0,
  //   1,
  //   0 //顶点6法向量
  // ]);
  // // 设置几何体attributes属性的位置normal属性
  // geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

  // 三角面(网格)渲染模式
  // var material = new THREE.MeshBasicMaterial({
  //   color: 0x0000ff, //三角面颜色
  //   // vertexColors: true,
  //   side: THREE.DoubleSide //两面可见
  // }); //材质对象
  // // 场景网格对象
  const mesh = createMesh(geometry, material);
  addMeshToScene(scene, mesh);

  // 点渲染模式
  // var material = new THREE.PointsMaterial({
  //   // color: 0xff0000,
  //   vertexColors: true, //是否启用顶点颜色
  //   size: 10.0 //点对象像素尺寸
  // }); //材质对象
  // var points = new THREE.Points(geometry, material); //点模型对象
  // scene.add(points); //点对象添加到场景中

  // 线条渲染模式
  // var material = new THREE.LineBasicMaterial({
  //   // color: 0xff0000 //线条颜色
  //   vertexColors: true
  // }); //材质对象
  // var line = new THREE.Line(geometry, material); //线条模型对象
  // scene.add(line); //线条对象添加到场景中

  // 创建光源
  const pointLight = createPointLight();
  addPointLightToScene(scene, pointLight);
  const ambientLight = createAmbientLight();
  addAmbientLightToScene(scene, ambientLight);
  // 创建相机
  const { k, s } = calculateCameraParameters(600, 600);
  const camera = createCamera(k, s);
  setCameraPositionAndLookAt(camera, scene);

  setController(camera);

  // 创建渲染器
  const renderer = createRenderer(canvas.value);

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;
    renderer.render(scene, camera);
  }

  animate();
});
</script>
