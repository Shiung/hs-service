<script>
import { mapActions, mapGetters } from 'vuex'
// import $ from 'jquery'
export default {
  name: 'login',
  data () {
    return {
      account: '',
      password: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'tokenVal'])
  },
  methods: {
    ...mapActions(['token_update', 'remove_cookie', 'user_info']),
    login () {
      this.$validator.validate().then(result => {
        if (!result) {
          this.$swal({
            title: '帳密不能為空白!',
            icon: 'error'
          })
        } else {
          let url = `${process.env.API_HOST}v1/auth/login/admin`// '/apiCross/v1/auth/login/admin'
          let data = {
            'id_number': this.account,
            'password': this.password
          }
          this.isLoading = true
          this.axios.post(url, data).then((res) => {
            console.log(res.data)
            // status == 1
            if (res.data.data.member.data.status) {
              this.user_info(res.data.data.member.data)
              this.token_update(`Bearer ${res.data.data.access_token}`)
              this.$router.push({name: 'homepage'})
            } else {
              this.$swal({
                title: '帳密已被關閉!',
                icon: 'error'
              })
            }
          }).catch((error) => {
            // handle error
            if (error.response.status === 401) {
              this.$swal({
                title: '帳密錯誤!',
                icon: 'error'
              })
            }
          }).then(() => {
            this.isLoading = false
          })
        }
      })
    },
    getCookie () {
      let key = 'hs_service_token'
      return localStorage[key] ? localStorage[key] : null
    }
  },
  mounted () {
    // cookie check 確認帳號
    let cookieToken = this.getCookie()
    if (cookieToken) {
      console.log('login有cookie檢查登入狀態')
      let url = `${process.env.API_HOST}v1/admin/me`
      // let url = 'https://hs_api.neplus.com.tw/api/v1/admin/me'
      this.isLoading = true
      this.axios.get(url, {
        headers: {
          'Authorization': `${cookieToken}`
        }
      }).then((res) => {
        if (res.headers.authorization) {
          this.token_update(res.headers.authorization)
        } else console.log('沒有123')
        this.$router.replace({name: 'homepage'})
      }).catch((error) => {
        if (error.response.status === 401) this.remove_cookie()
        else console.log(error.response)
      }).then(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
