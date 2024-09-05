export * from './useMouseMatrixRotate'

/**
 *创建着色器
 * @param gl
 * @param type
 *          - gl.VERTEX_SHADER 顶点着色器
 *          - gl.FRAGMENT_SHADER 片元着色器
 * @param sourceCode:着色器源码
 * @returns
 */
export const createShader = (gl, type, sourceCode) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) return shader

  console.error('shader err >>>', type, gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

/**
 * 创建着色器程序
 * @param gl
 * @param vertexShader
 * @param fragmentShader
 * @returns
 */
export const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.error('program err >>>', gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

/**
 *创建缓冲区
 * @param gl
 * @param bufferData：顶点或颜色坐标等数组
 * @param attribute ：位置或颜色等属性
 *        - attribute
 *        - size
 */

interface AttributeType {
  attribute: any
  size: number
}
export const createBuffer = (gl, bufferData, attribute: AttributeType) => {
  const buffer = gl.createBuffer() // 创建缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer) // 绑定缓冲区对象
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW) // 写入缓冲区
  gl.vertexAttribPointer(attribute.attribute, attribute.size, gl.FLOAT, false, 0, 0) // 分配缓冲区数据给 attribute
  gl.enableVertexAttribArray(attribute.attribute) // 开启 attribute 变量
}

export const createNewBuffer = (
  gl,
  target = gl.ARRAY_BUFFER,
  data,
  attribute,
  size,
  stride = 0,
  offset = 0
) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, gl.STATIC_DRAW)
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride, offset)
  gl.enableVertexAttribArray(attribute)
}
