<template>
  <v-container>
    <div class="message-rating">
      <div class="message-rating__content">{{ data.text }}</div>
      <div class="message-rating__rating">
        <v-rating
          v-model="rating"
          :emptyIcon="emptyIcon"
          :fullIcon="fullIcon"
          color="#6bb3da"
          background-color="#6bb3da"
          @click.native="onChange($event)"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    modal: false,
    emptyIcon: 'mdi-heart-outline',
    fullIcon: 'mdi-heart',
    rating: 0
  }),
  computed: {
    listData: function () {
      if (this.data.data && this.data.data.length > 0) {
        return this.data.data.slice(0, 2)
      }

      return []
    }
  },
  methods: {
    showModal () {
      this.modal = !this.modal
    },
    onChange (val) {
      this.$parent.$parent.$parent.$parent.onMessageWasSent(this.data)
    }
  }
}
</script>

<style scoped>
.message-rating {
  background: #fff;
  border: 1px solid #fff;
  box-sizing: border-box;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.message-rating__content {
  padding: 10px;
  border-bottom: 1px solid #E5E5E5;
}

.message-rating__rating {
  padding: 10px
}

</style>
