import {
  TextureLoader,
  Texture,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  DoubleSide,
  Group,
  Vector3
} from 'three'
//   @ts-ignore
import biaozhu from './images/biaozhu.png'
//   @ts-ignore
import guangzhu from './images/guangzhu.png'
import { lglt2xyz } from './utils'

export const createCityLight = (cityList: any) => {
  const waveLightMeshArr: Group = new Group()
  waveLightMeshArr.name = 'cityLightWaveGroup'
  const lightWeshArr: Group = new Group()
  lightWeshArr.name = 'cityLightGroup'
  const texture = new TextureLoader().load(biaozhu)
  const texture2 = new TextureLoader().load(guangzhu)
  for (const cityName in cityList) {
    const city = cityList[cityName]
    let position = lglt2xyz(city.longitude, city.latitude)
    let waveMesh = createLightWaveMesh(texture)
    let lightMesh = createLightMesh(texture2, position)
    waveLightMeshArr.add(waveMesh)
    lightWeshArr.add(lightMesh)
  }

  return { waveLightMeshArr, lightWeshArr }
}

export const createLightWaveMesh = (texture: Texture) => {
  let geometry = new PlaneGeometry(1, 1)
  let material = new MeshBasicMaterial({
    color: '#22ffcc',
    map: texture,
    transparent: true,
    depthWrite: false
  })
  let mesh = new Mesh(geometry, material)
  let size = 300 * 0.035
  mesh.scale.set(size, size, size)
  //   @ts-ignore
  mesh.privateType = 'cityLightWave'
  //   @ts-ignore
  mesh.layerType = 'city'
  return mesh
}

export const createLightMesh = (texture: Texture, position: Vector3) => {
  let height = 300 * 0.1
  let geometry = new PlaneGeometry(300 * 0.05, height)
  geometry.rotateX(Math.PI / 2)
  geometry.translate(0, 0, height / 2)
  let material = new MeshBasicMaterial({
    map: texture,
    color: '#0dfdf8',
    transparent: true,
    side: DoubleSide,
    depthWrite: false
  })
  let mesh = new Mesh(geometry, material)
  //   @ts-ignore
  mesh.privateType = 'cityLight'
  //   @ts-ignore
  mesh.layerType = 'city'
  let group = new Group()
  group.add(mesh, mesh.clone().rotateZ(Math.PI / 2))
  group.position.set(position.x, position.y, position.z)
  let coordVec3 = new Vector3(position.x, position.y, position.z).normalize()
  let meshNormal = new Vector3(0, 0, 1)
  group.quaternion.setFromUnitVectors(meshNormal, coordVec3)
  return group
}
