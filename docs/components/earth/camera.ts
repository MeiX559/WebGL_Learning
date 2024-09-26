import { PerspectiveCamera } from 'three'

/**
 * 设置相机
 * @param width
 * @param height
 */
export const initCamera = (width: number, height: number) => {
  const camera = new PerspectiveCamera(45, width / height, 0.1, 100000)
  //   设置相机位置
  camera.position.set(-270, 680, -900)
  camera.lookAt(0, 0, 0) //设置观察目标（指向远点）
  return camera
}
