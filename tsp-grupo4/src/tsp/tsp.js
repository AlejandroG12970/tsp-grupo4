export function calcularCosto(ciclo, matriz) {
    let costo = 0;
    for (let i = 0; i < ciclo.length; i++) {
        const u = ciclo[i];
        const v = ciclo[(i + 1) % ciclo.length];
        const peso = matriz[u][v];
        if (peso === Infinity || peso === undefined) return Infinity;
        costo += peso;
    }
    return costo;
}

export function permute(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        for (const p of permute(rest)) result.push([arr[i], ...p]);
    }
    return result;
}

export async function encontrarCiclosPasoAPaso(matriz, onStep) {
    const n = matriz.length;
    const nodos = [...Array(n).keys()];
    const permutaciones = permute(nodos.slice(1));
    const total = permutaciones.length;

    let mejor = { ciclo: [], costo: Infinity };
    const updateInterval = Math.max(1, Math.floor(total / 200));

    for (let i = 0; i < total; i++) {
        const ciclo = [0, ...permutaciones[i]];
        const costo = calcularCosto(ciclo, matriz);

        if (costo < mejor.costo) mejor = { ciclo, costo };

        if (i % updateInterval === 0 || i === total - 1) {
            onStep({
                cicloActual: ciclo,
                mejor,
                progreso: ((i + 1) / total) * 100,
            });

            await new Promise((r) => setTimeout(r));
        }
    }

    return mejor;
}
