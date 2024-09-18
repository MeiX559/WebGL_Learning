import * as THREE from 'three';
import d3 from '../js/d3';

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
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
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
    this.ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
    this.scene.add(this.ambientLight);
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

  // loadMapData() {
  //   const loader = new THREE.FileLoader();
  //   loader.load('../json/china.json', (data) => {
  //     const jsonData = JSON.parse(JSON.stringify(data));
  //     // this.generateGeometry(jsonData);
  //   });
  // }

  // generateGeometry(jsonData) {
  //   // 初始化一个地图对象
  //   this.map = new THREE.Object3D();
  //   // 墨卡托投影转换
  //   const projection = d3.geoMercator().center([104.0, 37.5]).translate([0, 0]);

  //   jsonData.features.forEach((elem) => {
  //     // 定一个省份3D对象
  //     const province = new THREE.Object3D();
  //     // 每个的 坐标 数组
  //     const coordinates = elem.geometry.coordinates;
  //     // 循环坐标数组
  //     coordinates.forEach((multiPolygon) => {
  //       multiPolygon.forEach((polygon) => {
  //         const shape = new THREE.Shape();
  //         const lineMaterial = new THREE.LineBasicMaterial({
  //           color: 'white'
  //         });
  //         const lineGeometry = new THREE.Geometry();

  //         for (let i = 0; i < polygon.length; i++) {
  //           const [x, y] = projection(polygon[i]);
  //           if (i === 0) {
  //             shape.moveTo(x, -y);
  //           }
  //           shape.lineTo(x, -y);
  //           lineGeometry.vertices.push(new THREE.Vector3(x, -y, 5));
  //         }

  //         const extrudeSettings = {
  //           depth: 10,
  //           bevelEnabled: false
  //         };

  //         const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  //         const material = new THREE.MeshBasicMaterial({
  //           color: '#2defff',
  //           transparent: true,
  //           opacity: 0.6
  //         });
  //         const material1 = new THREE.MeshBasicMaterial({
  //           color: '#3480C4',
  //           transparent: true,
  //           opacity: 0.5
  //         });

  //         const mesh = new THREE.Mesh(geometry, [material, material1]);
  //         const line = new THREE.Line(lineGeometry, lineMaterial);
  //         // 将省份的属性 加进来
  //         province.properties = elem.properties;
  //         province.add(mesh);
  //         province.add(line);
  //       });
  //     });
  //     this.map.add(province);
  //   });
  //   this.scene.add(this.map);
  // }
}
