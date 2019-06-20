<script>
import { mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import currencyFn from '@/filters/currency'
export default {
  name: 'memTicketholder',
  data () {
    return {
      columns: ['status', 'name', 'expire_at', 'use_at'],
      options: {
        headings: {
          expire_at: '優惠卷到期日',
          status: '狀態',
          name: '優惠卷名稱',
          use_at: '使用時間'
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
          expire_at: function (h, row, index) {
            if (!row.expire_at) return null
            return DateTime.fromSQL(row.expire_at).setLocale('zh-TW').toFormat('yyyy/MM/dd HH:mm:ss')
          },
          use_at: function (h, row, index) {
            if (!row.use_at) return null
            return DateTime.fromSQL(row.use_at).setLocale('zh-TW').toFormat('yyyy/MM/dd HH:mm:ss')
          },
          balance: function (h, row, index) {
            return `${currencyFn(row.balance)}`
          },
          status: function (h, row, index) {
            let s = ''
            let className = ''
            let str = 'badge badge-pill text-capitalize '
            switch (row.status) {
              case 0:
                s = '未使用'
                className = str.concat('badge-secondary')
                break
              case 1:
                s = '已使用'
                className = str.concat('badge-success')
                break
              default:
                s = '過期'
                className = str.concat('badge-danger')
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
    ...mapGetters('memTicketholderTableMoudule', ['datatables', 'perPage', 'count', 'totalPages', 'totalCount', 'currentPage', 'paramsObj', 'paramsStatus']),
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
    ...mapActions('memTicketholderTableMoudule', ['getDatatable', 'getRequestParams', 'setParamsStatus']),
    ...mapActions(['token_update', 'remove_cookie']),
    refreshData (obj) {
      this.getRequestParams(obj)
      this.getDatatable(this.memberID)
      // 更新vue-table-2 一樣顯示資料
      this.$refs.memTicketholderTable.setLimit(this.perPage)
    },
    filterType (type) {
      const obj = {
        search: `status:${type}`,
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
    this.$refs.memTicketholderTable.setLimit(this.perPage)
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
