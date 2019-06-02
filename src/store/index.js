import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import assessments from './modules/assessments'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    assessments
  },
  strict: process.env.NODE_ENV !== 'production',
  mutations: {
    REFRESH_STORE () {}
  }
})
