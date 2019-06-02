import router from '@/router'
import axios from 'axios'
import lstore from '@/core/lstorage'
import { BASE_URL } from '@/constant'

const lsd = lstore.lsd

const initialState = {
  token: lsd.get('token', null),
  user: null,
  loading: false,
  endpoints: {
    obtainJWT: '/api-token-auth/obtain_token',
    refreshJWT: '/api-token-refresh/'
  },
  assessments: []
}

const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  updateToken (state, newToken) {
    lsd.set('token', newToken)
    state.token = newToken
  },
  removeToken (state) {
    lsd.remove('token')
    state.token = null
  },
  getAssessments (state, payload) {
    state.assessments = payload
  }
}

const actions = {
  getTokenFromCognito ({ commit }, token) {
    commit('updateToken', token)
    router.push({ name: 'home' })
  },
  refreshToken ({ commit, state }) {
    let payload = JSON.stringify({
      'data': {
        'type': 'RefreshJSONWebToken',
        'attributes': {
          'token': lsd.get('token')
        }
      }
    })
      .axios.post(state.endpoints.refreshJWT, payload, {
        'headers': {
          'Content-Type': 'application/vnd.api+json'
        }
      })
      .then((response) => {
        commit('updateToken', response.data.data.token)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          commit('removeToken')
          this.$router.push('signin')
        }
      })
  },
  inspectToken ({ state }) {
    const token = state.token
    if (token) {
      const decoded = window.JwtDecode(token)
      const exp = decoded.exp
      const origIAT = decoded.orig_iat
      let promptLogin = false
      if (exp - (Date.now() / 1000) < 1800 && (Date.now() / 1000) - origIAT < 628200) {
        this.dispatch('refreshToken')
        return promptLogin
      } else if (exp - (Date.now() / 1000) < 1800) {
        // DO NOTHING, DO NOT REFRESH
        promptLogin = true
        return promptLogin
      } else {
        // PROMPT USER TO RE-LOGIN, THIS ELSE CLAUSE COVERS THE CONDITION WHERE A TOKEN IS EXPIRED AS WELL
        promptLogin = true
        return promptLogin
      }
    }
  },
  loading ({ commit }, payload) {
    commit('setLoading', payload)
  },
  checkAuth ({ commit }, payload) {
    if (lsd.get('token')) {
      let t = lsd.get('token')
      commit('updateToken', t)
    } else {
      commit('removeToken')
    }
  },
  signoutUser ({ commit }) {
    commit('removeToken')
    router.push({ name: 'home' })
  },
  getAssessments ({ commit }, payload) {
    commit('getAssessments', payload.assessments)
  }
}

const getters = {
  isUserAuthenticated (state) {
    return state.token !== null && state.token !== undefined
  },
  user (state) {
    return state.user
  },
  loading (state) {
    return state.loading
  },
  getAssessments (state) {
    return state.assessments
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
