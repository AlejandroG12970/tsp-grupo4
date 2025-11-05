<template>
  <div class="container">
    <h1>Problema del Agente Viajero (TSP)</h1>

    <div>
      <label><strong>Cantidad de nodos (8 a 16):</strong></label>
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
            <input
                type="number"
                v-model.number="matriz[i][j]"
                :disabled="i === j"
            />
          </td>
        </tr>
      </table>

      <button @click="resolverTSP">Calcular mejor ciclo</button>
    </div>

    <div v-if="resultado">
      <h3>Resultado</h3>
      <p>
        <strong>Mejor ciclo:</strong>
        {{ resultado.ciclo.map(letra).join(" → ") }} → {{ letra(resultado.ciclo[0]) }}
      </p>
      <p><strong>Costo total:</strong> {{ resultado.costo }}</p>
    </div>

    <!-- Dibujo del grafo -->
    <TspCanvas
        v-if="matriz.length"
        :matriz="matriz"
        :ciclo="resultado?.ciclo"
        :letras="letras"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { encontrarCiclos } from "../tsp/tsp.js";
import TspCanvas from "./tsp-canvas.vue";

const n = ref(8);
const matriz = ref([]);
const resultado = ref(null);

function generarGrafo() {
  resultado.value = null;
  matriz.value = Array.from({ length: n.value }, (_, i) =>
      Array.from({ length: n.value }, (_, j) =>
          i === j ? 0 : Math.floor(Math.random() * 20) + 1
      )
  );
}

// Convierte índices en letras (0 → A, 1 → B, etc.)
function letra(index) {
  return String.fromCharCode(65 + index);
}

// Lista de letras para los nodos
const letras = ref([...Array(26)].map((_, i) => letra(i)));

function resolverTSP() {
  const ciclos = encontrarCiclos(matriz.value);
  if (ciclos.length > 0) resultado.value = ciclos[0];
  else alert("No se encontraron ciclos Hamiltonianos válidos.");
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  margin: 1rem 0;
}
th, td {
  text-align: center;
}
</style>
