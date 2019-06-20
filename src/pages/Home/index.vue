<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      // isLoading: false,
      // isShowing: false,
      loadingOpacity: 0.8
    }
  },
  computed: {
    ...mapGetters(['meueStatus', 'isLoading', 'isShowing', 'tokenVal', 'userInfo'])
  },
  components: {
    // sideBar: () => import('@/components/Sidebar'),
    navBar: () => import('@/components/Navbar'),
    footerBox: () => import('@/components/Footerbox')
  },
  methods: {
    ...mapActions(['token_update', 'TOKENNEW', 'remove_cookie', 'user_info']),
    getCookie () {
      let key = 'hs_service_token'
      return localStorage[key] ? localStorage[key] : null
    }
  },
  mounted () {
    // cookie check 確認帳號
    if (!this.tokenVal) {
      let cookieToken = this.getCookie()
      if (cookieToken) {
        console.log('主頁有cookie檢查登入狀態')
        let url = `${process.env.API_HOST}v1/admin/me`
        // this.isLoading = true
        this.$store.commit('ISLOADING', true)
        this.axios.get(url, {
          headers: {
            'Authorization': `${cookieToken}`
          }
        }).then((res) => {
          this.user_info(res.data.data)
          if (res.headers.authorization) {
            this.token_update(res.headers.authorization)
          } else {
            this.$store.commit('TOKENNEW', cookieToken)
            console.log('主頁有cookie沒有 store token')
          }
        }).catch((error) => {
          if (error.response.status === 401) {
            this.remove_cookie()
            this.$router.replace({name: 'login'})
          } else console.log(error.response)
        }).then(() => {
          // this.isLoading = false
          // this.isShowing = true
          this.$store.commit('ISLOADING', false)
          this.$store.commit('ISSHOWING', true)
        })
      } else {
        this.$router.replace({name: 'login'})
      }
    } else {
      // this.isShowing = true
      this.$store.commit('ISSHOWING', true)
    }
  },
  watch: {
    // 確認登入管理者狀態
    userInfo (val) {
      // status
      if (!val.status) {
        this.remove_cookie()
        this.$router.replace({name: 'login'})
      }
    }
  }
}

</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
