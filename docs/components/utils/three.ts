import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ChinaMap {
  scene: any;
  camera: any;
  renderer: any;
  ambientLight: any;
  canvas: any;
  cube: any;
  map: any;
  constructor(canvasRef) {
    this.init();
    this.canvas = canvasRef;
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    // 设置相机
    this.setCamera();
    // 设置渲染器
    this.setRenderer();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.setController();
    this.render();
    this.animate();
  }

  setCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 3); //设置相机位置
    this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
  }

  // 设置渲染器
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    // 设置画布的大小
    this.renderer.setSize(500, 500); //设置渲染区域尺寸
    this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
  }

  // 设置环境光
  setLight() {
    const point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300);
    this.scene.add(point);
    this.ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
    this.scene.add(this.ambientLight);
  }

  // 创建控件
  setController() {
    const controls = new OrbitControls(this.camera, this.canvas!);
    controls.enableDamping = true;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.render();
  }
}
