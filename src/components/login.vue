<template>
  <!-- <amplify-authenticator> -->
  <v-layout
    id="app"
    row
    justify-center
    class="text-center fill-height"
  >
    <v-flex
      xs12
      sm10
      align-center
      justify-center
      class="auth-content"
    >
      <v-form
        ref="form"
        v-model="form"
        @submit.prevent="handleSubmit"
      >
        <div class="mb-5 auth-avatar-wrapper">
          <img
            class="auth-avatar"
            src="/images/icons/double-heart-blue.svg"
            alt="home page icon"
          >
        </div>
        <div class="auth-title mb-3 page-title">Sign in with your email and <br class="hidden--desktop">password:</div>
        <div>
          <v-text-field
            v-model="username"
            :rules="nameRules"
            class="default-btn mb-1"
            solo
            background-color="#fff"
            label="username"
          />
          <v-text-field
            v-model="password"
            :rules="pwdRules"
            type="password"
            class="default-btn mb-1"
            solo
            background-color="#fff"
            label="password"
          />
        </div>
        <button
          type="submit"
          class="default-btn auth-submit-btn auth-submit-btn--desktop"
          :class="{'disabled': form == false }"
          :disabled="getSubmitBtnStatus()"
        >
          Sign in
        </button>
        <div class="page-description">
          Need an account?
          <router-link
            to="/signup"
          >
            Sign up
          </router-link>
        </div>
        <button
          type="submit"
          class="default-btn auth-submit-btn auth-submit-btn--mobile"
          :class="{'disabled': form == false }"
          :disabled="getSubmitBtnStatus()"
        >
          Sign in
        </button>
      </v-form>
    </v-flex>
  </v-layout>
  <!-- </amplify-authenticator> -->
</template>
<script>

export default {
  name: 'Login',
  data: () => ({
    username: undefined,
    password: undefined,
    submitted: false,
    form: false,
    isLoading: false,
    nameRules: [
      v => !!v || 'Username is required',
      v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed'
    ],
    pwdRules: [
      v => !!v || 'Password is required'
    ]
  }),
  methods: {
    async handleSubmit (e) {
      if (this.$refs.form.validate()) {
        this.submitted = true
        if (this.username && this.password) {
          this.isLoading = true
          try {
            const user = await this.$Amplify.Auth.signIn(this.username, this.password)
            if (user.hasOwnProperty('signInUserSession')) {
              this.$store.dispatch('auth/getTokenFromCognito', user.signInUserSession.idToken.jwtToken)
            }
          } catch (err) {
            alert(err.message)
          }
        }
      } else {
        this.submitted = false
      }
    },
    toExtRoute (rname) {
      window.location = rname
      return false
    },
    getSubmitBtnStatus () {
      return this.form == false
    }
  }
}
</script>
