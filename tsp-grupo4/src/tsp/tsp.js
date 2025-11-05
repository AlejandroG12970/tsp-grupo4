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
        for (const p of permute(rest)) {
            result.push([arr[i], ...p]);
        }
    }
    return result;
}

export function encontrarCiclos(matriz) {
    const n = matriz.length;
    const nodos = [...Array(n).keys()];
    const permutaciones = permute(nodos.slice(1));
    const ciclos = [];

    for (const perm of permutaciones) {
        const ciclo = [0, ...perm];
        const costo = calcularCosto(ciclo, matriz);
        if (costo < Infinity) ciclos.push({ ciclo, costo });
    }

    ciclos.sort((a, b) => a.costo - b.costo);
    return ciclos;
}
