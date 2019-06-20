export default function (num) {
  if (num === undefined) return '沒有填寫金額'
  else {
    const n = Number(num)
    return `${n.toFixed(0).replace(/./g, function (c, i, a) {
      return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c
    })}`
  }
}
