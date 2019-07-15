<script>
import { mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import currencyFn from '@/filters/currency'
export default {
  name: 'memTransactionrecords',
  data () {
    return {
      columns: ['status', 'description', 'updated_at', 'transaction_recordsable_data', 'total_sum', 'point', 'discount_value', 'actual_price'],
      options: {
        headings: {
          updated_at: '交易時間',
          description: '說明',
          balance: '剩餘點數',
          point: '點數',
          status: '交易狀態',
          // transfer_action: '交易狀態',
          transaction_recordsable_data: '櫃位名稱',
          actual_price: '發票金額',
          discount_value: '優惠折抵',
          total_sum: '消費金額'
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
          updated_at: function (h, row, index) {
            return DateTime.fromSQL(row.updated_at).setLocale('zh-TW').toFormat('yyyy/MM/dd HH:mm:ss')
          },
          point: function (h, row, index) {
            let transfer = row.status === 2 || row.status === 6 ? '-' : '+'
            return `${transfer} ${currencyFn(row.point)}`
            // return `${currencyFn(row.point)}`
          },
          transaction_recordsable_data: function (h, row, index) {
            return row.transaction_recordsable_data.data[0].full_name
          },
          balance: function (h, row, index) {
            return `${currencyFn(row.balance)}`
          },
          total_sum: function (h, row, index) {
            return `NT ${currencyFn(row.total_sum)}`
          },
          discount_value: function (h, row, index) {
            return `NT ${currencyFn(row.discount_value)}`
          },
          actual_price: function (h, row, index) {
            return `NT ${currencyFn(row.actual_price)}`
          },
          status: function (h, row, index) {
            let s = ''
            let className = ''
            let str = 'badge badge-pill text-capitalize '
            switch (row.status) {
              case 0:
                s = '交易成立'
                className = str.concat('badge-warning text-white')
                break
              case 1:
                s = '交易給點'
                className = str.concat('badge-success')
                break
              case 2:
                s = '交易取消'
                className = str.concat('badge-danger')
                break
              case 3:
                s = '交易補登成立'
                className = str.concat('bg-yellow text-white')
                break
              case 4:
                s = '交易補登驗證'
                className = str.concat('badge-warning text-white')
                break
              case 5:
                s = '交易補登給點'
                className = str.concat('badge-success')
                break
              case 6:
                s = '交易補登取消'
                className = str.concat('badge-danger')
                break
              default:
                break
            }
            return <span class={className}>{s}</span>
          },
          transfer_action: function (h, row, index) {
            let s = ''
            let className = ''
            let str = 'badge badge-pill text-capitalize '
            switch (row.transfer_action) {
              case 0:
                s = '交易成立'
                className = str.concat('badge-success')
                break
              case 1:
                s = '交易失敗'
                className = str.concat('badge-danger')
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
    ...mapGetters('memTransactionrecordsTableMoudule', ['datatables', 'perPage', 'count', 'totalPages', 'totalCount', 'currentPage', 'paramsObj', 'paramsStatus']),
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
    ...mapActions('memTransactionrecordsTableMoudule', ['getDatatable', 'getRequestParams', 'setParamsStatus']),
    ...mapActions(['token_update', 'remove_cookie']),
    refreshData (obj) {
      this.getRequestParams(obj)
      this.getDatatable(this.memberID)
      // 更新vue-table-2 一樣顯示資料
      this.$refs.memTransactionrecordsTable.setLimit(this.perPage)
    },
    // filterType (type) {
    //   const obj = {
    //     search: type,
    //     searchFields: 'targetable_type',
    //     page: null
    //   }
    //   this.refreshData(obj)
    // },
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
    this.$refs.memTransactionrecordsTable.setLimit(this.perPage)
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
