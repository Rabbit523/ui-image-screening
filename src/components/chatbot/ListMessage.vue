<template>
  <v-container>
    <div class="message-list-wrapper">
      <div class="sc-message-list" v-for="(item, idx) in listData" :key="idx">
        <router-link
          to="#"
        >
          {{ item.name }}
          <v-icon class="right">mdi-chevron-right</v-icon>
        </router-link>
      </div>
      <div class="sc-message-list sc-message-list--no-border">
        <router-link
          to="#"
          @click.native="showModal()"
        >
          Show more
          <v-icon class="right">mdi-chevron-right</v-icon>
        </router-link>
      </div>
    </div>
    <v-dialog
      v-model="modal"
      fullscreen
      hide-overlay
      content-class="custom-dialog custom-dialog--light-blue"
      transition="dialog-bottom-transition"
    >
      <div class="pa-3">
        <div class="pb-3" v-for="(item, idx) in data.data" :key="`desc-${idx}`">
          <div class="page-title white--text">{{ item.name }}</div>
          <div class="page-descripiton white--text">{{ item.description }}</div>
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
export default {
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    modal: false
  }),
  computed: {
    listData: function () {
      if (this.data.data && this.data.data.length > 0) {
        return this.data.data.slice(0,2)
      }

      return []
    }
  },
  methods: {
    showModal () {
      this.modal = !this.modal
    }
  }
}
</script>

<style scoped>
a.chatLink {
  color: inherit !important;
}

.message-list-wrapper {
  background: #F5F5F5;
  border: 1px solid #E5E5E5;
  box-sizing: border-box;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.message-list-wrapper a {
  color: #545454;
}

.sc-message-list {
  border-bottom: 1px solid #E5E5E5;
  padding: 10px;
}
.sc-message-list--no-border { border-bottom: none; }

.sc-message-list__item { padding: 10px; }
</style>
