<template>
  <v-layout
    column
    class="option-panel"
  >
    <div class="my-5">
      <div class="page-title">Success!</div>
      <div class="page-description">The upload completed.</div>
    </div>
    <router-link
      :to="`assessment-detail/${currentAssessmentId}`"
      class="white--text btn-create-assessment"
    >
      See status of assessment
    </router-link>
    <blue-button
      url="assessments"
      class-name="my-3"
      text="View all assessments"
    />
    <blue-button
      url="/"
      class-name="my-3"
      text="Go back to landing page"
    />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UploadSuccess',
  computed: {
    ...mapState('assessments', ['currentAssessmentId'])
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
</style>