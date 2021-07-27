

function asc(arr){
    return arr.sort((a, b) => a - b);
}

function sum(arr){
    return arr.reduce((a, b) => a + b, 0);
}

function mean(arr){
    return sum(arr) / arr.length;
}

// sample standard deviation
// function std(arr) {
//     const mu = mean(arr);
//     const diffArr = arr.map(a => (a - mu) ** 2);
//     return Math.sqrt(sum(diffArr) / (arr.length - 1));
// }

function quantile(arr, q) {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
}

export {quantile};
