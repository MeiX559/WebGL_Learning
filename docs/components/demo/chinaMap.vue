<template>
  <canvas ref="canvasRef" width="500" height="500"></canvas>
  <div id="tooltip"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Map } from '../utils/chinaMap'

const canvasRef = ref(null)

onMounted(() => {
  new Map(canvasRef.value).init()
})
</script>

<style scoped>
#tooltip {
  position: absolute;
  z-index: 2;
  background: white;
  padding: 10px;
  border-radius: 2px;
  visibility: hidden;
}
</style>
