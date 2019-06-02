<template>
  <v-container
    class="fluid px-0"
  >
    <v-layout column>
      <v-flex xs12>
        <v-flex xs10 offset-xs1 class="pb-3">
          <div class="display-2"> {{label}} </div>
        </v-flex>
      </v-flex>
    </v-layout>
    <v-layout row wrap my-3>
      <v-flex xs10 offset-xs1>
              <v-card flat>
                <v-form ref="form" v-model="form" @submit.prevent="submitQuery">
                  <v-container grid-list-sm>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-card-text>
                          <v-text-field
                            box
                            label="Write your query here"
                            auto-grow
                            v-model="query"
                            :rules="queryRules"
                            required
                          ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn type="submit" :disabled="!form" color="success" :loading="isLoading">Search</v-btn>
                        </v-card-actions>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card>
            </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Assessment from '@/services/assessment'
export default {
  name: 'Ask',
  created () {
  },
  mounted () {
    this.initialize()
  },
  data: () => ({
    assessment: new Assessment(),
    label: 'How can I help you?',
    form: false,
    query: undefined,
    isLoading: false,
    queryRules: [
      v => !!v || 'This field is required'
    ],
    success: false,
    failed: false,
    warning: false
  }),
  methods: {
    toRoute (rname, rparams = {}, query = {}) {
      this.dialog = true
      this.$router.push({ name: rname, params: rparams, query: query })
    },
    initialize () {
    },
    submitQuery () {
      if (this.$refs.form.validate()) {
        debugger
        if (!this.$store.getters.isUserAuthenticated) {
          this.warning = true
        } else {
          if (this.query) {
            let formData = { query_term: this.query }
            this.isLoading = true
            this.assessment.initialize(formData).then(res => {
              this.isLoading = false
              if (res.data && res.data.type === 'message-threads') {
                this.$router.push({ name: 'support', params: { id: res.data.id } })
              }
            })
          }
        }
      }
    }
  }
}
</script>
