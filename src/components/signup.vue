<template>
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
        <div class="auth-title mb-3 page-title">Sign up with a new <br class="hidden--desktop"> account:</div>
        <div>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            class="default-btn mb-1"
            solo
            background-color="#fff"
            label="your name"
          />
          <v-text-field
            v-model="username"
            :rules="nameRules"
            class="default-btn mb-1"
            solo
            background-color="#fff"
            label="your email"
          />
          <v-text-field
            v-model="password"
            :rules="pwdRules"
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
          Sign up
        </button>
        <div class="page-description">
          Already have an account?
          <router-link
            to="/signup"
          >
            Sign in
          </router-link>
        </div>
        <button
          type="submit"
          class="default-btn auth-submit-btn auth-submit-btn--mobile"
          :class="{'disabled': form == false }"
          :disabled="getSubmitBtnStatus()"
        >
          Sign up
        </button>
      </v-form>
    </v-flex>
  </v-layout>
</template>
<script>

export default {
  name: 'Signup',
  data: () => ({
    email: undefined,
    username: undefined,
    password: undefined,
    submitted: false,
    form: false,
    isLoading: false,
    emailRules: [
      v => !!v || 'Email is required',
      v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed'
    ],
    nameRules: [
      v => !!v || 'Username is required',
      v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed'
    ],
    pwdRules: [
      v => !!v || 'Password is required'
    ]
  }),
  methods: {
    handleSubmit (e) {
      if (this.$refs.form.validate()) {
        this.submitted = true
        if (this.username && this.password) {
          this.isLoading = true
          this.$store.dispatch('auth/obtainToken', {
            username: this.username,
            password: this.password
          })
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
