export default function (idNumber) {
  if (!idNumber) return '沒有身分證字號'
  else {
    const ID = idNumber
    return `${ID.slice(0, 1)}*****${ID.slice(6, 10)}`
  }
}
