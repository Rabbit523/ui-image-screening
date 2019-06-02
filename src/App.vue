<template>
  <v-app
    id="inspire"
    style="background-color: #ffffff !important;"
  >
    <main-header v-if="showHeader" />
    <v-content
      :class="mainContentCss"
    >
      <v-container
        fill-height
        class="top-padding"
      >
        <v-layout
          row
          wrap
        >
          <v-flex xs12>
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <loading
      :active.sync="loader"
      :can-cancel="false"
      :is-full-page="true"
      loader="dots"
    />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Loading from 'vue-loading-overlay'
import { components } from 'aws-amplify-vue'
import 'vue-loading-overlay/dist/vue-loading.css'
import '@/styles/index.scss'

export default {
  components: {
    Loading,
    ...components
  },
  props: {
    source: String
  },
  data: () => ({
    fixed: true,
    isLoading: false,
    $router: {},
    showHeader: true,
    mainContentCss: 'no-padding'
  }),
  computed: {
    ...mapGetters('auth', {
      loading: 'loading'
    }),
    year () {
      return new Date().getFullYear()
    },
    loader () {
      return this.loading
    },
    isAuthenticated () {
      return this.isUserAuthenticated
    }
  },
  mounted () {
    const path = this.$router.history.current.path
    if (path == '/' || path == '/signin' || path == '/signup') {
      this.showHeader = false
    } else {
      this.showHeader = true
    }
  },
  updated () {
    const path = this.$router.history.current.path
    if (path == '/' || path == '/signin' || path == '/signup') {
      this.showHeader = false
    } else {
      this.showHeader = true
    }
  },
  methods: {
    ...mapActions('auth', [
      'isUserAuthenticated'
    ])
  }
}
</script>

<style>
.article-content {
  font-size: 21px !important;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.80px;
  line-height: 35px;
}
.markdown {
  box-sizing: border-box;
  margin: 15px 0px;
  outline: none;
  font-family: inherit;
  font-size: 18px;
  white-space: normal;
  word-wrap: break-word;
}

.markdown code {
  width: 100% !important;
  padding: 15px;
  /*background: #272822 !important; // monokai */
  /*background: #f8f8f8 !important; // github */
  background: #23241f !important; /* monokai-sublime */
}

.code {
  width: 100% !important;
  padding: 15px;
  /*background: #272822 !important; // monokai */
  /*background: #f8f8f8 !important; // github */
  background: #23241f !important; /* monokai-sublime */
}

.top-padding {
  padding-top: 64px !important;
}
</style>