// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueKonva from 'vue-konva'
import App from './App'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from './store'
import router from './router'
import VTooltip from 'v-tooltip'
import '@mdi/font/css/materialdesignicons.css'
// components
import ListCards from './components/shared/list_cards'
import GridCards from './components/shared/grid_cards'
import AutoSizeText from './components/shared/autosize-text'
import BlueButton from './components/shared/blue-button'
import Header from './components/shared/header'
import HomeHeader from './components/shared/transparent-header'

// AWS cognito
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: process.env.VUE_APP_AWS_REGION,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: process.env.VUE_APP_COGNITO_USERPOOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.VUE_APP_COGNITO_USERPOOL_WEB_CLIENT_ID
  }
})

Vue.use(AmplifyPlugin, AmplifyModules)

window.pageSize = 12
Vue.use(VTooltip)
Vue.use(Vuetify, {
  theme: {
    primary: '#03A9F4',
    secondary: '#03A9F4',
    accent: '#FF5722',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50'
  }
})

Vue.use(VueKonva)

Vue.config.productionTip = process.env.NODE_ENV === 'production'

// custom components
Vue.component('list-cards', ListCards)
Vue.component('grid-cards', GridCards)
Vue.component('autosize-text', AutoSizeText)
Vue.component('blue-button', BlueButton)
Vue.component('main-header', Header)
Vue.component('home-header', HomeHeader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
