<script setup>
import { ref } from "vue";
import { encontrarCiclosPasoAPaso } from "../tsp/tsp.js";
import TspCanvas from "./tsp-canvas.vue";

const n = ref(8);
const matriz = ref([]);
const resultado = ref(null);
const progreso = ref(0);
const cicloActual = ref(null);
const mejorCiclo = ref(null);
const ejecutando = ref(false);

function generarGrafo() {
  resultado.value = null;
  mejorCiclo.value = null;
  progreso.value = 0;
  cicloActual.value = null;
  matriz.value = Array.from({ length: n.value }, (_, i) =>
      Array.from({ length: n.value }, (_, j) =>
          i === j ? 0 : Math.floor(Math.random() * 20) + 1
      )
  );
}
function letra(index) {
  return String.fromCharCode(65 + index);
}

const letras = ref([...Array(26)].map((_, i) => letra(i)));

async function resolverTSP() {
  if (n.value > 12) {
    alert("Por rendimiento, el máximo recomendado es 12 nodos.");
    return;
  }

  ejecutando.value = true;
  resultado.value = null;
  mejorCiclo.value = null;
  progreso.value = 0;

  await encontrarCiclosPasoAPaso(matriz.value, (info) => {
    cicloActual.value = info.cicloActual;
    progreso.value = info.progreso;
    mejorCiclo.value = info.mejor;
  });

  resultado.value = mejorCiclo.value;
  ejecutando.value = false;
}
</script>

<template>
  <div class="container">
    <h1>Problema del Agente Viajero (TSP)</h1>

    <div>
      <label><strong>Cantidad de nodos (8 a 12):</strong></label>
      <input type="number" v-model.number="n" min="8" max="16" />
      <button @click="generarGrafo">Generar grafo aleatorio</button>
    </div>

    <div v-if="matriz.length">
      <h3>Matriz de adyacencia</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th></th>
          <th v-for="j in n" :key="'col-'+j">{{ letra(j - 1) }}</th>
        </tr>
        <tr v-for="(fila, i) in matriz" :key="'row-'+i">
          <th>{{ letra(i) }}</th>
          <td v-for="(valor, j) in fila" :key="i+'-'+j">
            <input type="number" v-model.number="matriz[i][j]" :disabled="i === j" />
          </td>
        </tr>
      </table>

      <button :disabled="ejecutando" @click="resolverTSP">
        {{ ejecutando ? "Calculando..." : "Calcular mejor ciclo" }}
      </button>
    </div>

    <div v-if="ejecutando || cicloActual">
      <h3>Progreso del algoritmo</h3>
      <p>Permutación actual: {{ cicloActual?.map(letra).join(" → ") }} → {{ letra(cicloActual?.[0] ?? 0) }}</p>
      <p>Progreso: {{ progreso.toFixed(1) }}%</p>
      <p v-if="mejorCiclo">Mejor ciclo: {{ mejorCiclo.ciclo.map(letra).join(" → ") }} → {{ letra(mejorCiclo.ciclo[0]) }} (Costo: {{ mejorCiclo.costo }})</p>
    </div>

    <div v-if="resultado">
      <h3>Resultado final</h3>
      <p><strong>Mejor ciclo:</strong> {{ resultado.ciclo.map(letra).join(" → ") }} → {{ letra(resultado.ciclo[0]) }}</p>
      <p><strong>Costo total:</strong> {{ resultado.costo }}</p>
    </div>

    <TspCanvas v-if="matriz.length" :matriz="matriz" :ciclo="resultado?.ciclo" :letras="letras" />
  </div>
</template>


<style scoped>
.container {
  max-width: 95%;
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
  box-sizing: border-box;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

input[type="number"] {
  width: 70px;
  text-align: center;
  padding: 4px;
}

.btn {
  margin-top: 1rem;
  background: #2c7be5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn:hover {
  background: #1b5dc9;
}


.table-container {
  overflow-x: auto;
  margin: 1rem auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

table {
  border-collapse: collapse;
  margin: auto;
  width: max-content;
  min-width: 600px;
}

th, td {
  text-align: center;
  padding: 4px;
}

input[type="number"] {
  width: 55px;
  padding: 3px;
  font-size: 14px;
}


.resultado {
  margin-top: 1rem;
  background: #f1f3f5;
  padding: 1rem;
  border-radius: 8px;
}

@media (max-width: 768px) {
  table {
    font-size: 12px;
    min-width: 500px;
  }

  input[type="number"] {
    width: 45px;
    font-size: 12px;
  }

  h1 {
    font-size: 1.4rem;
  }

  .btn {
    width: 100%;
  }
}
</style>

