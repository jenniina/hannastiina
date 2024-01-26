export default function useRandomMinMax(min: number, max: number) {
    return Math.random() * (max - min) + min;
}