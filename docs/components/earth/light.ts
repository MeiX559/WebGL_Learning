import { AmbientLight, DirectionalLight, HemisphereLight, Scene } from 'three'

/**
 * 设置光源
 * @param scene
 */
export const initLight = (scene: Scene) => {
  /**
   * 添加环境光
   * 参数：光源颜色，光强
   */
  const ambientLight: AmbientLight = new AmbientLight(0xcccccc, 0.4)
  scene.add(ambientLight)
  /**
   * 平行光
   * 参数：光源颜色，光强
   */
  const directionalLight: DirectionalLight = new DirectionalLight(0xffffff, 0.2)
  directionalLight.position.set(1, 0.1, 0).normalize()
  scene.add(directionalLight)

  const directionalLight2: DirectionalLight = new DirectionalLight(0xff2ffff, 0.2)
  directionalLight2.position.set(1, 0.1, 0.1).normalize()
  scene.add(directionalLight2)

  const directionalLight3: DirectionalLight = new DirectionalLight(0xffffff)
  directionalLight3.position.set(1, 500, -20)
  directionalLight3.castShadow = true
  directionalLight3.shadow.camera.top = 18
  directionalLight3.shadow.camera.bottom = -10
  directionalLight3.shadow.camera.left = -52
  directionalLight3.shadow.camera.right = 12
  scene.add(directionalLight3)

  /**
   * 半球光
   * 参数：天空颜色，地面颜色，光强
   */
  const hemiLight: HemisphereLight = new HemisphereLight(0xffffff, 0x444444, 0.2)
  hemiLight.position.set(0, 1, 0)
  scene.add(hemiLight)
}
