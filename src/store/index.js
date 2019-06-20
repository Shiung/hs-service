import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

import memAccountrecordsTableMoudule from './memAccountrecordsTable'
import memTransactionrecordsTableMoudule from './memTransactionrecordsTable'
import memTicketholderTableMoudule from './memTicketholderTable'
import memInfoMoudule from './memInfo'
import memTableMoudule from './memTable'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true, // 嚴格模式 建議在開發時檢查是否依照正常vuex 流程使用(耗效能)
  state: {
    navStatus: false,
    isLoading: false,
    isShowing: false,
    token: '',
    cookieKey: 'hs_service_token',
    user: {}
  },
  actions: {
    meue_status (context) {
      let status = !context.state.navStatus
      context.commit('MENUSWITCH', status)
    },
    // token
    token_update (context, newtoken) {
      let token = newtoken
      context.commit('TOKENNEW', token)
      context.dispatch('set_cookie')
      console.log('更新token')
    },
    set_cookie (context) {
      let key = context.state.cookieKey
      let token = context.state.token
      localStorage.setItem(key, token)
    },
    log_out (context) {
      let token = ''
      let obj = {}
      context.commit('TOKENNEW', token)
      context.commit('USERINFOUPDATE', obj)
      context.dispatch('remove_cookie')
    },
    remove_cookie (context) {
      let key = context.state.cookieKey
      localStorage.removeItem(key)
    },
    user_info (context, obj) {
      context.commit('USERINFOUPDATE', obj)
    }
  },
  mutations: {
    MENUSWITCH (state, payload) {
      state.navStatus = payload
    },
    ISLOADING (state, payload) {
      state.isLoading = payload
    },
    ISSHOWING (state, payload) {
      state.isShowing = payload
    },
    // token
    TOKENNEW (state, payload) {
      state.token = payload
    },
    // user info
    USERINFOUPDATE (state, payload) {
      state.user = payload
    }
  },
  getters: {
    meueStatus: state => state.navStatus,
    isLoading: state => state.isLoading,
    isShowing: state => state.isShowing,
    tokenVal: state => state.token,
    userInfo: state => state.user
  },
  modules: {
    memInfoMoudule,
    memAccountrecordsTableMoudule,
    memTransactionrecordsTableMoudule,
    memTicketholderTableMoudule,
    memTableMoudule
  }
})
