// request params object
export default class params {
  constructor (args) {
    let def = {
      orderBy: 'id',
      sortedBy: 'desc',
      page: 1
    }
    Object.assign(def, args) // 覆蓋到def 裡
    Object.assign(this, def)
  }
}
