<script>
import { mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import currencyFn from '@/filters/currency'
export default {
  name: 'memAccountrecords',
  data () {
    return {
      columns: ['transfer_action', 'description', 'created_at', 'point', 'balance'],
      options: {
        headings: {
          created_at: '交易時間',
          description: '說明',
          balance: '剩餘點數',
          point: '點數',
          transfer_action: '交易狀態'
        },
        columnsClasses: {
          // act: 'width-fix',
          // status: 'width-fix'
        },
        perPage: 15,
        perPageValues: [15, 25, 100],
        pagination: { chunk: 5, nav: 'scroll', dropdown: false, edge: false },
        texts: {
          // count: 'Showing {from} to {to} of {count} records|{count} records|One record',
          // noResults: 'No matching records',
          count: '顯示 {from} 到 {to} 筆資料 ， 總共 {count} 筆資料 |{count} 筆資料|One 筆資料',
          noResults: '沒有資料符合',
          first: '|<',
          last: '>|'
        },
        preserveState: true,
        sortable: ['name123'],
        // filterable: ['name', 'album'],
        filterable: false,
        sortIcon: {
          base: 'sorticon',
          up: 'sort-up',
          down: 'sort-down',
          is: 'sort'
        },
        templates: {
          created_at: function (h, row, index) {
            return DateTime.fromSQL(row.created_at).setLocale('zh-TW').toFormat('yyyy/MM/dd HH:mm:ss')
          },
          point: function (h, row, index) {
            let transfer = row.transfer_action === 1 ? '+' : '-'
            return `${transfer} ${currencyFn(row.point)}`
          },
          balance: function (h, row, index) {
            return `${currencyFn(row.balance)}`
          },
          transfer_action: function (h, row, index) {
            let s = ''
            let className = ''
            let str = 'badge badge-pill text-capitalize '
            switch (row.transfer_action) {
              case 0:
                s = '點數轉出'
                className = str.concat('badge-danger')
                break
              case 1:
                s = '點數轉入'
                className = str.concat('badge-success')
                break
              default:
                break
            }
            return <span class={className}>{s}</span>
          }
        }
      },
      showDialog: false,
      pageNumber: null
    }
  },
  computed: {
    ...mapGetters('memInfoMoudule', ['memberInfo']),
    ...mapGetters('memAccountrecordsTableMoudule', ['datatables', 'perPage', 'count', 'totalPages', 'totalCount', 'currentPage', 'paramsObj', 'paramsStatus']),
    ...mapGetters(['tokenVal']),
    memberID () {
      return this.memberInfo.id
    },
    dataInfo () {
      let currentPage = this.currentPage
      let perPage = this.perPage
      let count = this.count
      let totalPage = this.totalPages
      let totalCount = this.totalCount
      if (totalPage === 1) {
        return `${totalCount} 筆資料`
      } else {
        let from = (currentPage - 1) * perPage + 1
        let to = from + count - 1
        return `顯示 ${from} 到 ${to} 筆資料 ，  總共 ${totalCount} 筆資料`
      }
    }
  },
  methods: {
    // 資料 vuex
    ...mapActions('memAccountrecordsTableMoudule', ['getDatatable', 'getRequestParams', 'setParamsStatus']),
    ...mapActions(['token_update', 'remove_cookie']),
    refreshData (obj) {
      this.getRequestParams(obj)
      this.getDatatable(this.memberID)
      // 更新vue-table-2 一樣顯示資料
      this.$refs.memAccountRecordTable.setLimit(this.perPage)
    },
    filterType (type) {
      const obj = {
        // search: type,
        // searchFields: 'targetable_type',
        search: `transfer_action:${type}`,
        page: null
      }
      this.refreshData(obj)
    },
    prevPage () {
      let current = this.currentPage
      let params = this.paramsObj
      const obj = {
        ...params,
        page: current - 1
      }
      if (current !== 1) {
        this.refreshData(obj)
      }
    },
    nextPage () {
      let current = this.currentPage
      let total = this.totalPages
      let params = this.paramsObj
      const obj = {
        ...params,
        page: current + 1
      }
      if (current !== total) {
        this.refreshData(obj)
      }
    },
    searchPage () {
      let page = this.pageNumber
      let params = this.paramsObj
      if (page !== '') {
        const obj = {
          ...params,
          page: page
        }
        this.refreshData(obj)
      }
      // 關閉搜尋頁面光箱
      this.showDialog = false
      this.pageNumber = ''
    }
  },
  mounted () {
    this.getRequestParams()
    this.getDatatable(this.memberID)
    // 更新vue-table-2 一樣顯示資料
    this.$refs.memAccountRecordTable.setLimit(this.perPage)
  },
  watch: {
    pageNumber (val) {
      if (val === '') return
      if (val > this.totalPages) {
        this.$swal({
          title: `最大頁數${this.totalPages}`,
          icon: 'warning'
        })
          .then(() => {
            this.pageNumber = this.totalPages
          })
      } else if (val < 1) {
        this.$swal({
          title: `最小頁數 1`,
          icon: 'warning'
        })
          .then(() => {
            this.pageNumber = 1
          })
      }
    }
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
