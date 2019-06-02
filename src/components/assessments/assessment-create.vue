<template>
  <v-container
    grid-list-xs
    class="gallery-list"
  >
    <div class="page-title py-3"> Select </div>
    <div class="page-description pb-3"> At least one image is needed, and multiple images will help for better results. </div>
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex
        v-for="i in currentPhotos"
        :key="i.position"
        xs4
        class="assessment-item-wrapper"
      >
        <div
          v-if="i.position !== 8"
          class="assessment-item"
        >
          <input
            :id="`assessment-upload${i.position}`"
            type="file"
            name="image"
            class="assement-item__fileupload"
            accept="image/*"
            capture
            @change="$_fileChange(i, $event)"
          >
          <img
            :id="`assessment-image${i.position}`"
            :src="i.imageUrl"
            class="assessment-item__image"
            alt="lorem"
            width="100%"
            height="100%"
            @click="$_upload($event, i.position)"
          >
        </div>
        <div
          v-else
          class="btn-go-wrapper"
        >
          <button
            type="button"
            class="white--text btn-go page-description"
            @click="$_createAssessment"
          >
            Go on
          </button>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AssessmentCreate',
  data: () => ({
    noImageUrl: 'https://randomuser.me/api/portraits/men/20.jpg',
    photos: []
  }),
  computed: {
    ...mapGetters('assessments', {
      currentPhotos: 'getCurrentPhotos'
    })
  },
  watch: {
    currentPhotos (newPhotos) {
      this.photos = Object.assign([], newPhotos)
    }
  },
  methods: {
    ...mapActions('assessments', [
      'updateCurrentPhotos',
      'asyncFileUpload'
    ]),
    $_upload: function (event, position) {
      const fileUploadElementId = `assessment-upload${position}`
      const fileUploadElement = document.getElementById(fileUploadElementId)
      fileUploadElement.click()
    },
    $_fileChange: async function (item, event) {
      const position = event.target.id.replace('assessment-upload', '')
      let base64Content = ''

      await this.getBase64(event.target.files[0])
        .then((data) => { base64Content = data })

      const params = { ...item, position, imageUrl: base64Content }
      this.updateCurrentPhotos(params)
    },
    $_createAssessment: function (event) {
      this.$router.push({ name: 'option-dialog' })
    },
    isExist (position) {
      const data = this.photos
      const existings = data.filter((item) => {
        return item.position && item.position === position
      })

      return existings.length !== 0
    },
    getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery-list {
  max-width: 580px;
  padding: 0;
}
.assessment-item-wrapper {
  overflow: hidden;
}

.assessment-item {
  position: relative;
  height: 100%;
}

.assement-item__fileupload {
  display: none;
}

.assessment-item__image {
  cursor: pointer;
}

.assessment-item__image {
  opacity: 0.6;
}

.add_icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #3cb1ee;
  cursor: pointer;

  i {
    color: #fff;
  }
}

.btn-go-wrapper {
  display: flex;
  height: 100%;
  background-color: #6bb3da;
}

.btn-go {
  margin: auto;
  outline: none;
  font-weight: 500;
  font-size: 22px;
  line-height: 22px;
}

@media (max-width: 575px) {
  .btn-go {
    font-size: 18px;
    line-height: 18px;
  }
}

</style>