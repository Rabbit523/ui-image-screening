<template>
  <v-container>
    <v-layout
      row
      class="mb-5"
    >
      <div class="page-title"> Initial Screenings </div>
    </v-layout>
    <v-layout
      column
      class="mb-5"
    >
      <div>
        <blue-button
          url="create-assessment"
          text="Create new assessment"
        />
      </div>
    </v-layout>
    <v-layout
      column
      class="mb-5"
    >
      <v-flex xs12>
        <v-card
          v-for="item in assessments"
          :key="item.id"
          color="white"
        >
          <v-layout
            row
            class="mb-3 assessment-item"
          >
            <div class="assessment-item__image">
              <img :src="item.attributes.host + item.attributes.lake + '/' + item.attributes.path">
            </div>
            <v-card-title
              primary-title
              class="assessment-item__title"
            >
              <div class="assessment-item-title">
                <div class="page-title">
                  {{ convertDate(item.attributes.updated_time) }}
                </div>
                <!-- <div :class="getStatus(item.attributes)">{{ getStatus(item.attributes) }}</div> -->
                <router-link
                  :to="`assessment-detail/${item.id}`"
                  class="assessment-item-link"
                >
                  go to
                </router-link>
              </div>
            </v-card-title>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as moment from 'moment'

export default {
  name: 'Assessments',
  computed: {
    ...mapGetters('assessments', {
      assessments: 'getAssessments'
    })
  },
  created () {
    this.fetchAssessments()
    this.fetchCategories()
  },
  methods: {
    ...mapActions('assessments', [
      'fetchAssessments',
      'fetchCategories'
    ]),
    convertDate (value) {
      return moment(value).format('MMMM DD')
    },
    getStatus (item) {
      let status = 'opened'
      if (item.is_ready_for_user) {
        if (item.reviewed_by_dentist) {
          status = 'ready'
        } else {
          status = 'pending'
        }
      }

      return status
    }
  }
}
</script>

<style lang="scss" scoped>
.assessment-item__title {
  align-items: flex-start;
}

.assessment-item-link {
  position: absolute;
  bottom: 1.75rem;
  padding: 7px 15px;
  border-radius: 4px;
  text-decoration: none;
  color: #fff;
  background-color: #6CB4D9;
}

.assessment-item__image {
  width: 200px;
  height: 200px;
  display: flex;
  background-color: grey;

  img {
    width: 100%;
    height: 100%;
    margin: auto;
  }
}

.pending {
  color: #6CB4D9;
}

.ready {
  color: #4caf50;
}

.opened {
  color: #9C9C9C;
}

@media (max-width: 575px) {
  .assessment-item__image {
    width: 150px;
    height: 150px;
  }
}
</style>
