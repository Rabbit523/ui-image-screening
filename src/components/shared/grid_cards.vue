<template>
  <v-container
    fluid
    grid-list-md
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        v-for="(card, idx) in cards.data"
        :key="idx"
        d-flex
        v-bind="{ [`xs${flex}`]: true }"
      >
        <v-card>
          <v-flex
            style="cursor: pointer"
            @click.stop="toRoute('conceptDetails', {id: card.id})"
          >
            <v-img
              class="grey lighten-2"
              height="200px"
              :src="getImage(card)"
              :lazy-src="getImage(card)"
              aspect-ratio="1"
            />
          </v-flex>
          <v-card-title>
            <div>
              <v-flex
                class="title"
                style="cursor: pointer"
                @click.stop="toRoute('conceptDetails',{id: card.id})"
              >
                {{ card.attributes.name }}
              </v-flex>
            <!-- <v-flex>
              <span style="margin-left: 20px;">
                        <v-btn
                          flat
                          icon
                          color="primary darken-2"
                          style="margin-left: -8px;"
                        >
                          <v-icon small>thumb_up</v-icon>
                        </v-btn>
                        <v-btn flat icon color="red darken-2">
                          <v-icon small>thumb_down</v-icon>
                        </v-btn>
                      </span>

            </v-flex> -->
            </div>
          </v-card-title>
          <v-flex class="body-1">
            <span
              v-if="card.attributes.short_description.length > 140"
              class="grey--text"
            >
              {{ card.attributes.short_description.substring(0, 140) }}... &nbsp;&nbsp;
              <router-link :to="{name: 'conceptDetails', params: { id: card.id }}">read more</router-link>
            </span>
            <span
              v-else
              class="grey--text"
            >
              {{ card.attributes.short_description }} &nbsp;&nbsp;
            </span>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'GridCards',
  props: {
    data: {
      default: null
    }
  },
  data: () => ({
    // cards: []
  }),
  computed: {
    flex () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12
        case 'sm': return 6
        case 'md': return 4
        case 'lg': return 3
        case 'xl': return 2
      }
    },
    cards () {
      return this.data
    }
  },
  mounted () {
    // this.$watch('data', data => {
    //   this.cards = data
    // }, {immediate: true})
  },
  methods: {
    toRoute (rname, rparams = {}, query = {}) {
      this.dialog = true
      this.$router.push({ name: rname, params: rparams, query: query })
    },
    getImage (card) {
      if (card.relationships.images.data.length) {
        let obj = this.cards.images.find(img => img.id === card.relationships.images.data[0].id)
        return obj ? obj.attributes.host + obj.attributes.path : 'static/img/Dental_Black.png'
      }
      return 'static/img/Dental_Black.png'
    }
  }
}
</script>