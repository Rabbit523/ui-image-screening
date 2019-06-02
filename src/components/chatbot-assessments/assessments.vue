<template>
  <v-container
    class="fluid px-0 no-padding"
  >
    <v-alert
      :value="isUserCreated"
      type="success"
      transition="scale-transition"
    >
      A new thread is successfully created!
    </v-alert>
    <v-layout row wrap my-3>
      
      <v-flex class="assessment-section" column v-if="msgData.data.length">
        <div class="my-3 hidden--mobile">
          <router-link
            to="#"
            class="white--text btn-create-assessment page-title my-3"
            @click.native="initialize()"
          >
            New Assessment
          </router-link>
        </div>
        <div
          class="container-fluid"
          grid-list-lg
        >
          <template v-for="(card, idx) in msgData.data">
            <v-layout row wrap v-bind:key="idx">
              <v-layout
                row
                class="assessment-item"
              >
                <div
                  class="assessment-item__title"
                  @click.stop="toRoute('view', {id: card.id, query: card.attributes})"
                  style="cursor: pointer"
                >
                  <div
                    color="grey lighten-4"
                  >
                    <img
                      src="/static/img/1.png"
                      class="avatar-img"
                      alt="avatar"
                    >
                  </div>
                </div>
                <div class="assessment-item__description">
                  <div
                    class="page-title"
                    @click.stop="toRoute('view', {id: card.id, query:card.attributes})"
                    style="cursor: pointer"
                  >
                    {{dateFormat(card.attributes.created_timestamp)}} <br>
                    <span class="grey--text page-description"> {{getUsernameOfThread(idx)}} </span>
                  </div>
                </div>
              </v-layout>
            </v-layout>
          </template>
        </div>
        <div>
          <div v-if="msgData.data.length">
            <v-pagination
              v-model="msgData.page"
              :length="msgData.pages"
              @input="onPageChange"
            ></v-pagination>
          </div>
        </div>
        <div class="my-3 hidden--desktop">
          <router-link
            to="#"
            class="white--text btn-create-assessment my-3"
            @click.native="initialize()"
          >
            New Assessment
          </router-link>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Assessment from '@/services/assessment'
export default {
  name: 'Home',
  created () {
  },
  mounted () {
    this.getAssessments()
  },
  data: () => ({
    assessment: new Assessment(),
    show: false,
    msgData: {
      data: [],
      page: 1,
      pages: 0
    },
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    isUserCreated: false
  }),
  methods: {
    toRoute (rname, rparams = {}, query = {}) {
      this.$router.push({ name: rname, params: rparams, query: query })
    },
    initialize () {
      let formData = { query_term: '' }
      this.assessment.initialize(formData).then(res => {
        this.isUserCreated = true
        this.onPageChange()
        if (res.data && res.data.type === 'message-threads') {
          this.$router.push({ name: 'support', params: { id: res.data.id } })
        }
      })
    },
    getAssessments () {
      this.assessment.getThreads(this.msgData.page).then(res => {
        if (res.data != null && res.meta) {
          this.msgData.data = res.data
          this.msgData.included = res.included
          this.msgData.page = res.meta.pagination.page
          this.msgData.pages = res.meta.pagination.pages

          this.isUserCreated = false
        }
      })
    },
    onPageChange () {
      this.getAssessments()
    },
    dateFormat (date) {
      let newDate = new Date(date)
      return this.months[newDate.getMonth()] + ' ' + newDate.getDay()
    },
    getUsernameOfThread (idx) {
      return this.msgData.included[0].attributes.username
    }
  }
}
</script>
<style scoped lang="scss">
.assessment-section {
  max-width: 650px;
  margin: auto;
}

.assessment-item {
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid #F0F0F0;

  .assessment-item__description {
    margin-left: 20px;
  }

  .avatar-img {
    width: 67px;
    height: 67px;
    border-radius: 50%;
  }
}
</style>
