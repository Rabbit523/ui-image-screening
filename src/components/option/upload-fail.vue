<template>
  <v-layout
    column
    class="option-panel"
  >
    <div class="my-5">
      <div class="section-title">Sorry!</div>
      <div class="section-description">Something went wrong</div>
      <div class="section-description">Error Message</div>
    </div>
    <blue-button
      url="option"
      class-name="my-3"
      text="Try the upload again"
    />
    <blue-button
      url="create-assessment"
      class-name="my-3"
      text="Make sure you uploaded at least one images"
    />
  </v-layout>
</template>

<script>
export default {
  name: 'UploadFail'
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