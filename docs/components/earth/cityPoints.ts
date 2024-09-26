import {
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Texture,
  TextureLoader,
  Vector3
} from 'three'
import { lglt2xyz } from './utils'
//   @ts-ignore
import biaozhu from './images/biaozhu.png'
//   @ts-ignore
import bzguangquan from './images/bzguangquan.png'

export const createCityPoints = (cityList: any) => {
  const waveMeshArr: Group = new Group()
  waveMeshArr.name = 'cityPointWaveGroup'
  const pointMeshArr: Group = new Group()
  pointMeshArr.name = 'cityPointGroup'
  let texture = new TextureLoader().load(biaozhu)
  let texture2 = new TextureLoader().load(bzguangquan)
  for (const cityName in cityList) {
    let city = cityList[cityName]
    let lon = city.longitude
    let lat = city.latitude
    let position = lglt2xyz(lon, lat)
    let waveMesh = createWaveMesh(position, texture2)
    let pointMesh = createPointMesh(position, texture)
    waveMeshArr.add(waveMesh)
    pointMeshArr.add(pointMesh)
  }
  return { waveMeshArr, pointMeshArr }
}

/**
 * @description 创建标记点-波纹
 * @param position
 * @param texture
 */
export const createWaveMesh = (position: Vector3, texture: Texture) => {
  const planeGeometry = new PlaneGeometry(1, 1)
  const material: MeshBasicMaterial = new MeshBasicMaterial({
    color: '#6edade',
    map: texture,
    transparent: true,
    opacity: 1.0,
    depthWrite: false
  })

  let mesh: Mesh = new Mesh(planeGeometry, material)
  let size = 300 * 0.045
  //   @ts-ignore
  mesh.size = size
  mesh.scale.set(size, size, size)
  //   @ts-ignore
  mesh._s = Math.random() * 1.0 + 1.0
  mesh.position.set(position.x, position.y, position.z)
  //   @ts-ignore
  mesh.privateType = 'cityPointWave'
  //   @ts-ignore
  mesh.layerType = 'city'
  let coordVec3 = new Vector3(position.x, position.y, position.z).normalize()
  let meshNormal = new Vector3(0, 0, 1)
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)

  return mesh
}

/**
 * @description 创建标记点
 * @param position
 * @param texture
 */
export const createPointMesh = (position: Vector3, texture: Texture) => {
  const planeGeometry: PlaneGeometry = new PlaneGeometry(1, 1)
  const material: MeshBasicMaterial = new MeshBasicMaterial({
    color: '#6edade',
    map: texture,
    transparent: true,
    opacity: 1.0,
    depthWrite: false
  })
  let mesh: Mesh = new Mesh(planeGeometry, material)
  let size: number = 300 * 0.035
  mesh.scale.set(size, size, size)

  mesh.position.set(position.x, position.y, position.z)
  //   @ts-ignore
  mesh.privateType = 'cityPoint'
  //   @ts-ignore
  mesh.layerType = 'city'
  let coordVec3 = new Vector3(position.x, position.y, position.z).normalize()
  let meshNormal = new Vector3(0, 0, 1)
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
  // mesh.userData.quaternion = mesh.quaternion;
  return mesh
}
