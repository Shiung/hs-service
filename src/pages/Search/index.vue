<script>
export default {
  name: 'search',
  data () {
    return {
      searchStr: '',
      // searchStrPlaceholder: '',
      // 過濾
      filterNum: 0, // 0: 姓名 1: 信箱 2: 身分證 3:電話
      filterStr: '姓名',
      searchFields: 'name' // 0: name, 1: email,2: id_number ,3: mobile
    }
  },
  computed: {
    searchStrPlaceholder () {
      return `搜尋${this.filterStr}`
    }
  },
  methods: {
    filter (type) {
      switch (type) {
        case 0:
          this.filterNum = 0
          this.filterStr = '姓名'
          this.searchFields = 'name'
          break
        case 1:
          this.filterNum = 1
          this.filterStr = '信箱'
          this.searchFields = 'email'
          break
        case 2:
          this.filterNum = 2
          this.filterStr = '帳號'
          this.searchFields = 'id_number'
          break
        case 3:
          this.filterNum = 3
          this.filterStr = '電話'
          this.searchFields = 'mobile'
          break
        default:
          break
      }
    },
    searchAct () {
      if (this.searchStr) {
        // this.$router.push({ name: 'member', query: { searchFields: this.searchFields, search: this.searchStr } })
        this.$router.push({ name: 'member', params: { searchFields: this.searchFields, search: this.searchStr } })
      } else {
        this.$swal({
          title: '請輸入要搜尋的條件',
          icon: 'warning'
        })
      }
    }
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
