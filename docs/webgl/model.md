# 模型实战

:::tip
在学习模型导入之前，我们已经使用 WebGL 绘制了点，线，三角形，立方体，以及二维、三维图形的几何变换等，但是我们都是通过自定义点然后计算坐标这种方式绘制的，这样虽然可以绘制，但是对于复杂的图形，计算点的坐标这种方式就显得不太容易，将会耗费非常长的时间，而模型可能可以解决这个问题，通过导入模型就可以将图形绘制在我们眼前
:::

## 导入模型示例

以下示例是从[free3d](https://free3d.com/zh/3d-model/wolf-rigged-and-game-ready-42808.html)网站找的一个模型，将该模型的.mtl 和.obj 文件下载放到本地，通过`Three.js`中的`OBJLoader`和`MTLLoader`加载模型就可以了。

<Model />

<script setup>
    import Model from '../components/demo/model/Model.vue'
</script>
