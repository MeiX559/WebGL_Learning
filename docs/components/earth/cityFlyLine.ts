import { Object3D, Vector3, CubicBezierCurve3 } from 'three'
import { InitFlyLine } from './initFlyLine'
// @ts-ignore
import pointPng from './images/point.png'
import { lglt2xyz, getCubicBezierCenterPoint } from './utils'

export const createFlyLine = (earthObj: Object3D, cityList: any, relationList: any[]) => {
  let flyManager: InitFlyLine | null = null
  if (flyManager == null) {
    flyManager = new InitFlyLine({
      texture: pointPng
    })
  }

  relationList.forEach((relation: any) => {
    relation.to.forEach((cityName: string) => {
      randomAddFlyLine(
        earthObj,
        flyManager,
        cityList[relation.from],
        cityList[cityName],
        relation.color
      )
    })
  })

  return flyManager
}

export const randomAddFlyLine = (
  earth: Object3D,
  flyManager: InitFlyLine,
  fromCity: any,
  toCity: any,
  color: string
) => {
  setTimeout(function () {
    addFlyLine(earth, flyManager, fromCity, toCity, color)
  }, Math.ceil(Math.random() * 15000))
}

export const addFlyLine = (
  earthObj: Object3D,
  flyManager: InitFlyLine,
  fromCity: any,
  toCity: any,
  color: string
) => {
  const curvePoints = new Array()
  let fromXyz = lglt2xyz(fromCity.longitude, fromCity.latitude)
  let toXyz = lglt2xyz(toCity.longitude, toCity.latitude)

  curvePoints.push(new Vector3(fromXyz.x, fromXyz.y, fromXyz.z))

  let distanceDivRadius =
    Math.sqrt(
      (fromXyz.x - toXyz.x) * (fromXyz.x - toXyz.x) +
        (fromXyz.y - toXyz.y) * (fromXyz.y - toXyz.y) +
        (fromXyz.z - toXyz.z) * (fromXyz.z - toXyz.z)
    ) / 300
  let partCount = 3 + Math.ceil(distanceDivRadius * 3)

  const { v1, v2 } = getCubicBezierCenterPoint(fromXyz, toXyz)

  let curve = new CubicBezierCurve3(fromXyz, v1, v2, toXyz)

  let pointCount = Math.ceil(500 * partCount)

  let allPoints = curve.getPoints(pointCount)

  let flyMesh = flyManager.addFly({
    curve: allPoints,
    color: color,
    width: 4,
    length: Math.ceil((allPoints.length * 3) / 15),
    speed: partCount + 20,
    repeat: Infinity
  })

  earthObj.add(flyMesh)
}
