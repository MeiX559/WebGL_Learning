# WebGL 绘制线

:::tip
在上一小节中，我们已经成功绘制了一个点，并且也学会了如何动态的把点的坐标赋值给顶点着色器实现动态绘制点，接下来我们将学习如何绘制线、三角形等形状。

众所周知，线是由点组成，即中学阶段学习过的，`两点确定一条直线`，在 WebGL 中也是如此，绘制线首先需要知道多个点，而上一节我们是通过 a_Position 变量传递给着色器并实现点的绘制的，如果要用 WebGL 绘制线或面，首先需要知道缓冲区的概念。

**注**：3D 图形的基本单位是三角形，即三角形是所有面、3D 图形的基础。
:::

## 缓冲区

我们已经知道绘制线或面至少需要两个或两个以上的点数据，之前我们绘制一个点的时候，只需要将点的坐标给到`gl_Position`即可，但是现在我们有多个点，此时要实现我们的需求，就需要借助缓冲区对象了。

**什么是缓冲区对象？**

缓冲区对象可以**一次性传入多个顶点数据，颜色值等其他信息**，将这些数据保存在缓冲区中，后续顶点着色器和片元着色器就可以使用缓冲区对象里面的数据了。

使用缓冲区的流程：

1. 通过 `gl.createBuffer` 创建缓冲区对象
2. 通过 `gl.bindBuffer` 绑定缓冲区对象（无法直接操作缓冲区对象）
3. 通过 `gl.bufferData` 写入缓冲区数据
4. 通过 `gl.vertexAttribPointer` 将缓冲区数据分配到 `attribute` 变量
5. 通过 `gl.enableVertexAttribArray` 开启 `attribute` 变量

### 创建缓冲区对象

```js
// 调用gl.createBuffer创建缓冲区对象
const buffer = gl.createBuffer();
```

### 绑定缓冲区对象

由于无法直接操作缓冲区对象，因此我们需要将缓冲区对象绑定到一个 target 中，后续在这个 target 中进行操作。

```js
// 第一个参数 target；第二个参数 buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
```

`gl.bindBuffer`这个 api 就是用于绑定缓冲区对象的，它有两个参数，分别是：

- target

| target                  | 参数值说明                                  |
| ----------------------- | ------------------------------------------- |
| gl.ARRAY_BUFFER         | 包含顶点属性的 Buffer，如坐标数据、颜色数据 |
| gl.ELEMENT_ARRAY_BUFFER | 包含顶点的索引值 Buffer                     |

- buffer：就是创建的 buffer，也即`gl.createBuffer()`的返回值

### 缓冲区写入数据

```js
const vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0, 0.5, 0, -0.5, 0.5, 0.5, 0.5, -0.5]); //   顶点坐标
// 写入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
```

`gl.bufferData`这个 api 就是在缓冲区写入数据的，它有三个参数，分别是：

- target：跟`gl.bindBuffer`中的 target 是一样的，也是因为不能直接操作缓冲区对象，使用 target 进行赋值的。
- srcData：一个类型化数组，如`Float32Array`,`Float64Array`等。
- usage：这里有几个可选值，我们目前用 `gl.STATIC_DRAW`（数据写入缓冲区一次，但可用于多次绘制） 即可。

### 分配缓冲区数据给 `attribute`

分配缓冲区数据给`attribute`用到的 api 是`gl.vertexAttribPointer`。其实在上一节中，我们也有用到一个 api，`gl.vertexAttrib2f`它用于将数据动态传递到`a_Position`中，但是它一次只能分配一个值，而我们这里需要分配多个值，于是`gl.vertexAttribPointer`就发挥作用了。

语法：

```js
gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
```

它有六个参数，我们暂时只需要关注前两个参数：

- index：顶点着色器中的`attribute`变量
- size：每个顶点分配到的缓冲区数据的个数，值范围是[1-4]（因为我们的顶点变量是 vec4 类型的数据）。如果这个值为 1，那剩下的数据将会进行一个补 0，最后一个值补 1。

```js
// 第一个参数顶点着色器的 attribute 变量 a_Position，第二个参数值是 2
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
```

### 开启 `attribute` 变量

在前面所有步骤完毕后，还有最后一步，即开启`attribute` 变量，用到的 api 是`gl.enableVertexAttribArray`.

```js
gl.enableVertexAttribArray(a_Position);
```

到这里，缓冲区对象就已经创建完毕了，接下来就可以去绘制直线和三角形了。

## 绘制直线和三角形

### 着色器源码

```js
//顶点着色器源码
var vertexShaderSource = `
            // 待分配缓冲区的 attribute 变量
            attribute vec4 a_Position;
            attribute vec4 a_Color;
            varying vec4 v_Color;

            void main () {
                gl_Position = a_Position;
                v_Color= a_Color;
            }
            `;
//片元着色器源码
var fragShaderSource = `
                precision mediump float;
                varying vec4 v_Color;
                void main () {
                // 顶点颜色 (R, G, B, A)
                gl_FragColor = v_Color;
            }
          `;
```

着色器源码和绘制动态点的源码差不多，唯一的区别就是我们不用设置`gl_PointSize`的值，因为我们不再是绘制点了。

### 创建着色器，`program`

因为创建着色器和`program`代码都类似，因此在这里以及之后我都封装为一个函数使用。

#### 创建着色器

```js
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
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.error('shader err >>>', type, gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};
```

#### 创建`program`

```js
/**
 * 创建着色器程序
 * @param gl
 * @param vertexShader
 * @param fragmentShader
 * @returns
 */
export const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error('program err >>>', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};
```

### 绘制

绘制直线和三角形和绘制点都是调用绘制的 api ——`gl.drawArrays`，但是和绘制点不同的是传入的 mode 参数不一样。

在绘制点那一节已经介绍过`gl.drawArrays`的参数，现在再来看一下

`gl.drawArrays`参数说明如下：

|               | 参数值               | 参数值说明                                                                           | 返回值 |
| ------------- | -------------------- | ------------------------------------------------------------------------------------ | ------ |
| gl.drawArrays | (mode, first, count) | 1. mode： gl.POINTS 绘制单个点 2. first： 指定开始绘制的点 3.count：指定绘制多少个点 | -      |

mode 参数的值：`gl.LINES`,`gl.LINE_STRIP`,`gl.LINE_LOOP`,`gl.TRIANGLES`,`gl.TRIANGLE_STRIP,`,`gl.TRIANGLE_FAN`

从参数的值可以看出点、线、三角形分别是：Points、Line、TRIANGLES。

下面将以一个示例展示 WebGL 绘制图形的效果：切换不同的按钮可以显示不同的图形。

## 示例

<Line />

<script setup>
    import Line from '../components/demo/Line.vue'
</script>
