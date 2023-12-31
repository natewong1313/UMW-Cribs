export default function shortenNum(n) {
  if (n < 1e3) return n
  if (n >= 1e3) return +(n / 1e3).toFixed(1) + "k"
}
