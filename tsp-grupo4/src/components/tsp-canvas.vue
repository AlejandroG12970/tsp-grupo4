<template>
  <div class="canvas-container">
    <canvas ref="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";

const props = defineProps({
  matriz: { type: Array, required: true },
  ciclo: { type: Array, default: null },
  letras: { type: Array, required: true },
});

const canvas = ref(null);
let ctx = null;

function dibujarGrafo() {
  if (!ctx) return;
  const n = props.matriz.length;
  const centerX = 250;
  const centerY = 250;
  const radius = 180;

  ctx.clearRect(0, 0, 500, 500);
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const posiciones = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    posiciones.push({ x, y });
  }

  // --- Dibujar aristas ---
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 1;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (i !== j && props.matriz[i][j] !== Infinity) {
        ctx.beginPath();
        ctx.moveTo(posiciones[i].x, posiciones[i].y);
        ctx.lineTo(posiciones[j].x, posiciones[j].y);
        ctx.stroke();

        // Etiqueta de peso
        const midX = (posiciones[i].x + posiciones[j].x) / 2;
        const midY = (posiciones[i].y + posiciones[j].y) / 2;
        ctx.fillStyle = "#444";
        ctx.fillText(props.matriz[i][j], midX, midY);
      }
    }
  }

  // --- Dibujar ciclo óptimo ---
  if (props.ciclo) {
    ctx.strokeStyle = "#e63946";
    ctx.lineWidth = 3;

    for (let i = 0; i < props.ciclo.length; i++) {
      const u = props.ciclo[i];
      const v = props.ciclo[(i + 1) % props.ciclo.length];
      ctx.beginPath();
      ctx.moveTo(posiciones[u].x, posiciones[u].y);
      ctx.lineTo(posiciones[v].x, posiciones[v].y);
      ctx.stroke();
    }
  }

  // --- Dibujar nodos ---
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.arc(posiciones[i].x, posiciones[i].y, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#2c7be5";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Letra del nodo
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText(props.letras[i], posiciones[i].x, posiciones[i].y);
  }
}

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  dibujarGrafo();
});

watch(() => [props.matriz, props.ciclo], dibujarGrafo, { deep: true });
</script>

<style scoped>
.canvas-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
canvas {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #fdfdfd;
}
</style>
