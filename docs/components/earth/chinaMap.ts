import { Group, LineBasicMaterial, Object3D } from 'three'
import chinaMapJson from '../json/china.json'
import { createLine } from './line'

/**
 * 创建中国地图描边
 */
export const createChinaMapStroke = () => {
  const cityStroke = new Object3D()
  cityStroke.name = 'cityStroke'

  //   创建线模型材质
  const lineMaterial = new LineBasicMaterial({
    color: 0xf19553
  })

  chinaMapJson.features.forEach((elem: any) => {
    const provinceLine = new Group()
    provinceLine.name = elem.properties.name
    const coordinates = elem.geometry.coordinates
    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        const line = createLine(polygon, lineMaterial)
        provinceLine.add(line)
      })
    })
    cityStroke.add(provinceLine)
  })

  return { cityStroke }
}
