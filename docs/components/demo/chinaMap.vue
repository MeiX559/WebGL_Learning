<template>
  <canvas ref="canvasRef" width="500" height="500"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Map } from '../utils/chinaMap';

const canvasRef = ref(null);

onMounted(() => {
  new Map(canvasRef.value).init();
});
</script>
