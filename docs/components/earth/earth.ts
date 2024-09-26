import { Mesh, MeshStandardMaterial, Object3D, SphereGeometry, TextureLoader } from 'three'
// @ts-ignore
import earthImg from './images/earth.jpg'
// @ts-ignore
import earthLight from './images/earth_1.jpg'
import { createChinaMapStroke } from './chinaMap'

export const createEarthMesh = (cityList: any, relationList: any[]) => {
  const earthObj = new Object3D()
  // 地球纹理
  const texture = new TextureLoader().load(earthImg)
  // 光照贴图
  const lightMap = new TextureLoader().load(earthLight)
  //   let earthOutLine: Object3D | null = null
  //   let flyManager: InitFlyLine | null = null
  //   let waveMeshObj: Group | null = null

  // 创建一个球体几何体
  const globeGgeometry: SphereGeometry = new SphereGeometry(300, 100, 100)
  // 创建材质
  const globeMaterial: MeshStandardMaterial = new MeshStandardMaterial({
    map: texture, // 纹理贴图
    lightMap: lightMap, // 光照贴图
    flatShading: true,
    fog: false
  })

  const globeMesh = new Mesh(globeGgeometry, globeMaterial)
  globeMesh.name = 'earth'
  // earthObj.rotation.set(0.5, 2.9, 0.1);
  earthObj.add(globeMesh)
  //   创建中国地图描边
  const { cityStroke } = createChinaMapStroke()
  earthObj.add(cityStroke)
  return { earthObj }
}
