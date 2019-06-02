<template>
    <div class="sc-message--text" :style="messageColors" v-if="messageText.length">
      <p v-html="messageText"></p>
      <!-- {{messageText}} -->
      <p v-if="data.meta" class='sc-message--meta' :style="{color: messageColors.color}">{{data.meta}}</p>
    </div>
</template>

<script>
import escapeGoat from 'escape-goat'
import Autolinker from 'autolinker'
const fmt = require('msgdown')

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    messageText () {
      let escaped = ''

      if (this.data.text) {
        escaped = escapeGoat.htmlEscape(this.data.text)
      }

      return Autolinker.link(this.messageStyling ? fmt(escaped) : escaped, {
        className: 'chatLink',
        truncate: { length: 50, location: 'smart' }
      })
    }
  }
}
</script>

<style scoped>
a.chatLink {
  color: inherit !important;
}
</style>
