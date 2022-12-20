//calculate distance between two points
export default function distance(x1: number, y1: number, x2: number, y2: number) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}