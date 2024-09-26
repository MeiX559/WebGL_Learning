import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial } from 'three'
import { lglt2xyz } from './utils'

/**
 * 创建线模型
 * @param polygon
 * @param lineMaterial
 */
export const createLine = (polygon: any, lineMaterial: LineBasicMaterial) => {
  const positions: any[] = []
  const linGeometry = new BufferGeometry()
  for (let i = 0; i < polygon.length; i++) {
    let pos = lglt2xyz(polygon[i][0], polygon[i][1])
    positions.push(pos.x, pos.y, pos.z)
  }
  linGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))

  return new Line(linGeometry, lineMaterial)
}
