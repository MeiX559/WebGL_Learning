<template>
  <canvas ref="canvas" width="600" height="600"></canvas>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';
import { jiangxiData } from '../js/jiangxi';

const canvas = ref(null);
let geometry = null;
let scene = null;

const props = defineProps(['type']);

const x = 113.94,
  y = 29.04;

function createMesh(geometry, material) {
  return new THREE.Mesh(geometry, material);
}

// 添加到场景
function addToScene(obj) {
  scene.add(obj);
}

// 设置点光源
function createPointLight() {
  const point = new THREE.PointLight(0xffffff);
  point.position.set(400, 200, 300);
  return point;
}

// 设置环境光
function createAmbientLight() {
  return new THREE.AmbientLight(0x444444);
}

/**
 * 计算相机参数
 * @param {*} width  canvas画布宽
 * @param {*} height canvas画布高
 */
function calculateCameraParameters(width, height) {
  const k = width / height;
  const s = 200;
  return { k, s };
}

// 设置相机
function createCamera(k, s) {
  return new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
}

function setCameraPositionAndLookAt(camera, scene) {
  camera.position.set(x, y, 300);
  camera.lookAt(x, y, 300);
}

// 创建渲染器
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
  controls.target.set(x, y, 0); //与lookAt参数保持一致
  controls.update();
}

// 网格模型
function drawMesh() {
  var material = new THREE.MeshBasicMaterial({
    color: 0x0000ff, //三角面颜色
    // vertexColors: true,
    side: THREE.DoubleSide //两面可见
  }); //材质对象
  // 场景网格对象
  const mesh = createMesh(geometry, material);
  addToScene(mesh);
  addHelp();
}

// 添加辅助坐标
function addHelp() {
  const axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);
}

function genBox() {
  const pointsArr = []; // 一组二维向量表示一个多边形轮廓坐标
  jiangxiData.forEach(function (e) {
    // data坐标数据转化为Vector2构成的顶点数组
    const v2 = new THREE.Vector2(e[0], e[1]);
    pointsArr.push(v2);
  });
  // Shape表示一个平面多边形轮廓,参数是二维向量构成的数组pointsArr
  const shape = new THREE.Shape(pointsArr);
  // 多边形shape轮廓作为ShapeGeometry参数，生成一个多边形平面几何体
  geometry = new THREE.ShapeGeometry(shape);

  var material = new THREE.MeshBasicMaterial({
    color: 0x0000ff, //三角面颜色
    side: THREE.DoubleSide //两面可见
  }); //材质对象
  // 场景网格对象
  const mesh = createMesh(geometry, material);

  const box3 = new THREE.Box3();
  box3.expandByObject(mesh); // 计算模型包围盒
  const size = new THREE.Vector3();
  box3.getSize(size); // 计算包围盒尺寸
  const center = new THREE.Vector3();
  box3.getCenter(center); // 计算包围盒中心坐标

  drawMesh();
}

onMounted(() => {
  // 创建场景
  scene = new THREE.Scene();
  genBox();

  addHelp();

  // 创建光源
  const pointLight = createPointLight();
  addToScene(pointLight);
  const ambientLight = createAmbientLight();
  addToScene(ambientLight);

  // 创建相机
  const { k, s } = calculateCameraParameters(600, 600);
  const camera = createCamera(k, s);
  setCameraPositionAndLookAt(camera, scene);

  setController(camera);

  // 创建渲染器
  const renderer = createRenderer(canvas.value);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
});
</script>

<style scoped>
.btns {
  margin: 10px 10px 10px 0;
}
</style>
