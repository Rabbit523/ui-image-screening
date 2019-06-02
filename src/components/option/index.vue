<template>
  <v-container>
    <v-layout
      column
      class="option-panel"
    >
      <h1 class="page-title"> Choose Option </h1>
      <router-link
        to="#"
        class="white--text btn-create-assessment my-3"
        @click.native="createAssessment(true)"
      >
        Review by dentist
      </router-link>
      <router-link
        to="#"
        class="white--text btn-create-assessment my-3"
        @click.native="createAssessment(false)"
      >
        Review by algorithm
      </router-link>
      <button
        class="read-more mt-3"
        @click="showModal()"
      >
        Read more
      </button>
      <div
        v-if="progress.status === 'Pending'"
        class="text-danger my-5"
      >
        <div> Uploading your images. </div>
        <div> Please wait... </div>
        <div> {{ progress && progress.value ? progress.value : '' }} % uploaded </div>
      </div>
    </v-layout>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      content-class="custom-dialog custom-dialog--light-blue"
      transition="dialog-bottom-transition"
    >
      <div class="pa-3">
        <div class="pb-3">
          <div class="page-title white--text">Review by dentist</div>
          <div class="page-descripiton white--text">
            Get a review by our partner dentists. We effectively match you with top dentists. Either general practioners or specialized dentists if we suspect that something unusual is out of order.
          </div>
        </div>
        <div class="pb-3">
          <div class="page-title white--text">Review by algorithm</div>
          <div class="page-descripiton white--text">Get a review by our ASPIRE team. We use cutting-edge AI technology to screen images that are trivial. If our oral health detection is uncertain it will send it to our ASPIRE team.</div>
        </div>
        <div class="pb-3">
          <button
            type="text"
            class="white--text page-title"
            @click="showModal()"
          >
            OK
          </button>
        </div>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'OptionDialog',
  data: () => ({
    dialog: false
  }),
  computed: {
    ...mapGetters('assessments', {
      progress: 'getProgress'
    })
  },
  watch: {
    progress (newProgress) {
      if (newProgress.status === 'End') {
        this.initProgress()

        if (newProgress.code === true) {
          this.$router.push('upload-success')
        } else {
          this.$router.push('upload-fail')
        }
      }
    }
  },
  methods: {
    ...mapActions('assessments', [
      'asyncFileUpload',
      'initProgress'
    ]),
    createAssessment: function (isReviewByDentis) {
      this.asyncFileUpload(isReviewByDentis)
    },
    showModal () {
      this.dialog = !this.dialog
    }
  }
}
</script>

<style scoped>
.option-panel {
  text-align: center;
  margin: 0 auto;
}

.option-title {
  text-align: left;
}

.read-more {
  max-width: 150px;
  margin: auto;
  padding: 5px;
  border: 1px solid #6CB4D9;
  border-radius: 4px;
  font-weight: 300;
  font-size: 18px;
  color: #6CB4D9;
}

@media (max-width: 768px) {
  .read-more {
    font-size: 14px;
  }
}
</style>