// import { GlobalConfig } from '../../utils/config'
import { Spherical, Vector3 } from 'three'

/**
 * @description 经纬度转换球面坐标
 * @param longitude
 * @param latitude
 */
export const lglt2xyz = (longitude: number, latitude: number) => {
  const theta = (90 + longitude) * (Math.PI / 180)
  const phi = (90 - latitude) * (Math.PI / 180)
  return new Vector3().setFromSpherical(new Spherical(300, phi, theta))
}
