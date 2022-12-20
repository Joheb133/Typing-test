//random number from min-max range
export default function getRndFloat(min: number, max: number, decimals: number) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

console.log(getRndFloat(1, 5, 2))