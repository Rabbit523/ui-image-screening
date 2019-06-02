<template>
  <v-card
    class="elevation-16 mx-auto"
    width="300"
  >
    <v-card-title
      class="headline"
      primary-title
    >
      Lorem Ipsum
    </v-card-title>
    <v-card-text>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.

      <div class="text-xs-center mt-5">
        <v-rating
          v-model="rating"
          color="red darken-3"
          background-color="red darken-1"
          :empty-icon="emptyIcon"
          :full-icon="fullIcon"
          :half-icon="halfIcon"
          :half-increments="halfIncrements"
          hover
        ></v-rating>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="justify-space-between" v-if="!disableRating">
      <!-- <v-btn flat>No Thanks</v-btn> -->
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        flat
        right
        @click="submitRating()"
      >
        Rate Now
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    emptyIcon: 'mdi-heart-outline',
    fullIcon: 'mdi-heart',
    halfIcon: 'mdi-heart-half-full',
    halfIncrements: true,
    hover: true,
    length: 5,
    rating: 0,
    readonly: false
  }),
  props: {
    onSubmit: {
      type: Function,
      required: true
    },
    disableRating: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submitRating () {
      if (this.rating) {
        this.onSubmit(this.rating)
      }
    }
  }
}
</script>
