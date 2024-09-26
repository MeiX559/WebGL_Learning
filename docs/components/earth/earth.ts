import { Group, Mesh, MeshStandardMaterial, Object3D, SphereGeometry, TextureLoader } from 'three'
// @ts-ignore
import earthImg from './images/earth.jpg'
// @ts-ignore
import earthLight from './images/earth_1.jpg'
import { createChinaMapStroke } from './chinaMap'
import { createEarthOutLine } from './outline'
import { createCityPoints } from './cityPoints'
import { createCityLight } from './cityLight'
import { createFlyLine } from './cityFlyLine'
import { createCityLigature } from './ligature'

export const createEarthMesh = (cityList: any, relationList: any[]) => {
  const earthObj = new Object3D()
  // 地球纹理
  const texture = new TextureLoader().load(earthImg)
  // 光照贴图
  const lightMap = new TextureLoader().load(earthLight)
  let earthOutLine: Object3D | null = null
  let flyManager: any = null
  let waveMeshObj: Group | null = null

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
  // 创建外边框
  earthOutLine = createEarthOutLine()
  earthObj.add(earthOutLine)

  // 创建中国城市的点集
  const { waveMeshArr, pointMeshArr } = createCityPoints(cityList)
  waveMeshObj = waveMeshArr
  earthObj.add(waveMeshArr)
  earthObj.add(pointMeshArr)

  // 创建城市光线
  const { waveLightMeshArr, lightWeshArr } = createCityLight(cityList)
  earthObj.add(waveLightMeshArr)
  earthObj.add(lightWeshArr)

  // 创建城市飞线
  flyManager = createFlyLine(earthObj, cityList, relationList)

  // 城市连线
  const cityLineArr = createCityLigature(cityList, relationList)
  earthObj.add(cityLineArr)

  return { earthObj }
}
