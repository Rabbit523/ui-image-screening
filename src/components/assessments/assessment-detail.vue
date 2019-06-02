<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-card class="assessment-review">
          <div class="assessment-review__banner">
            <v-stage :config="configKonva">
              <v-layer>
                <v-image
                  :config="{
                    image: image,
                    width: 1000,
                    height: 500
                  }"
                  @mousemove="handleMouseMove"
                  @click="handleMouseClick"
                />
                <!-- <v-rect
                  v-for="prediction in showPredictions()"
                  :key="prediction.key"
                  :config="getOverlayPolygon(prediction)"
                />-->
              </v-layer>
            </v-stage>
          </div>
          <!-- <div class="assessment-review__footer">
            <div
              v-for="(prediction, i) in predictions"
              :key="`prediction${i}`"
              class="assessment-review-item"
            >
              <v-img
                :src="prediction.img"
                class="footer-preview-image"
                :class="prediction.active ? 'active' : ''"
                @click="setCurrentPredictionId(prediction.id)"
              />
            </div>
            <div class="assessment-review-item">
              <v-switch v-model="switch1" color="#6bb3da"/>
            </div>
          </div>-->
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      content-class="custom-dialog custom-dialog--light-blue"
      transition="dialog-bottom-transition"
    >
      <v-layout justify-center row fill-height>
        <div class="question-content">
          <div class="big-title">Are you sure you want to delete this assessment?</div>
          <v-layout justify-center align-center>
            <button class="big-title mr-5" @click="deleteAssessment()">Yes</button>
            <button class="big-title" @click="showModal()">No</button>
          </v-layout>
        </div>
      </v-layout>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "loadsh";

const emptyImage = "https://cdn.vuetifyjs.com/images/cards/desert.jpg";

export default {
  name: "AssessmentDetail",
  data() {
    return {
      switch1: true,
      status: false,
      ex4: ["success"],
      assessmentId: this.$router.history.current.params.id || "",
      personalizedPrompt: "",
      predictions: [],
      predictionScores: [],
      overlays: [], // it is same as predictions, but used to show ploygons
      configKonva: {
        // canvas settings for banner image
        width: 1000,
        height: 300
      },
      image: null,
      currentPredictionId: 0,
      dialog: false,
      activeImage: 0
    };
  },
  computed: {
    ...mapState("assessments", {
      assessment: "getAssessment"
    })
  },
  async created() {
    this.fetchAssessmentsById(this.assessmentId);
    const self = this;
    this.predictionScores = [];
    this.predictions = [];
    let fetchData = await this.fetchAssessmentsById(self.assessmentId);
    console.log(fetchData);
    this.image = this.getImageInstanceFromSrc(
      fetchData.data.included[0].attributes.host +
        fetchData.data.included[0].attributes.lake +
        "/" +
        fetchData.data.included[0].attributes.path
    );
  },
  mounted() {},
  methods: {
    ...mapActions("assessments", [
      "getPredictionById",
      "getAssessmentsById",
      "getImageById",
      "fetchAssessmentsById"
    ]),
    handleMouseMove(event) {
      const mousePos = this.$refs.stage.getStage().getPointerPosition();
      const x = mousePos.x - 190;
      const y = mousePos.y - 40;
      this.writeMessage("x: " + x + ", y: " + y);
    },
    getImageInstanceFromSrc(src) {
      let image = new window.Image();
      image.src = src;
      image.onload = () => {
        this.image = image;
      };
    },
    handleMouseClick(event) {
      console.log(event);
    },
    generateRandom() {
      return Math.random()
        .toString()
        .substring(2, 10);
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";

      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    showModal() {
      this.dialog = !this.dialog;
    }
  }
};
</script>

<style scoped>
.assessment-review {
  padding: 5px;
}

.assessment-review__footer {
  display: flex;
  justify-content: space-between;
}

.assessment-review-item {
  position: relative;
  width: 100px;
  align-self: center;
}

.assessment-review-item:last-child {
  width: auto;
}

.footer-preview-image.active {
  border: 3px solid orange;
}

.delete-assessment-btn {
  text-align: center;
}

.question-conten {
  margin-top: 20%;
}

@media (max-width: 575px) {
  .assessment-review-item {
    width: 70px;
  }

  .delete-assessment-btn {
    position: relative;
    display: block;
    width: 100%;
    text-align: center;
  }
}
</style>