import axios from 'axios'
import router from '../router'
import swal from 'sweetalert'

/* eslint-disable */
export default {
  // ***state 屬於模組區域變數
  // ***actions , mutations , getters 屬於全域變數
  namespaced: true, // ***加入此設定 actions , mutations , getters 屬於區域變數
  state: {
    datas: {},
    isMemShowing: false
  },
  actions: {
    getInfo( context, query ){
      context.commit('ISLOADING', true, {root: true})
      context.commit('ISMEMSHOWING', false)
      let cookieToken = getCookie()
      const url = `${process.env.API_HOST}v1/admin/member`
      let params = query
      axios.get(url, {
        headers: {
          'Authorization': `${cookieToken}`
        },
        params
      }).then((res) => {
        if (res.data.data.length === 0) {
          swal({
            title: '搜尋不到會員',
            icon: 'error'
          })
            .then(() => {
              router.replace({name: 'homepage'})
            }) 
        }
        context.commit('MEMBERINFO', res.data.data[0])
        if (res.headers.authorization) {
          context.dispatch('token_update', res.headers.authorization, {root: true})
        } 
      }).catch((error) => {
        if (error.response.status === 401) {
          context.dispatch('remove_cookie', {root: true})
          router.replace({name: 'login'})
        } else if (error.response.status === 429) {
          swal({
            title: '操作太多次',
            icon: 'error'
          })
        } else if (error.response.status === 500 || error.response.status === 404 || error.response.status === 400) { // 暫定找不到ID資訊
          swal({
            title: '搜尋不到會員',
            icon: 'error'
          })
            .then(() => {
              router.replace({name: 'homepage'})
            }) 
        } else console.log(error.response)
      }).then(() => {
        context.commit('ISLOADING', false, {root: true})
        context.commit('ISMEMSHOWING', true)
      })
    }
  },
  mutations: {
    MEMBERINFO ( state, payload ) {
      state.datas = payload
    },
    ISMEMSHOWING (state, payload) {
      state.isMemShowing = payload
    },
  },
  // 運用getters 可以在其他頁面 用 mapGetters 方式 取代compute 抓取store 的方式
  getters: {
    memberInfo: state => state.datas,
    isMemShowing: state => state.isMemShowing
  }
}

function getCookie () {
  let key = 'hs_service_token'
  return localStorage[key] ? localStorage[key] : null
}
