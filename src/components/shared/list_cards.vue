<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg
  >
    <template v-for="(card, idx) in cards.data">
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <v-card elevation-3>
            <v-container
              fluid
              grid-list-lg
            >
              <v-layout row>
                <v-flex
                  xs2
                  style="cursor: pointer"
                  @click.stop="toRoute('conceptDetails', {id: card.id})"
                >
                  <v-card-media
                    :src="getImage(card)"
                    height="125px"
                    contain
                  />
                </v-flex>
                <v-flex xs10>
                  <div>
                    <div
                      class="title"
                      style="cursor: pointer"
                      @click.stop="toRoute('conceptDetails', {id: card.id})"
                    >
                      {{ card.attributes.name }}
                      <!-- <span style="margin-left: 20px;">
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
                      </span> -->
                      <span
                        style="float:right;"
                        class="caption grey--text"
                      > {{ card.created }} </span>
                    </div>
                    <div class="body-1">
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
                    </div>
                    <div>
                      <v-container
                        v-if="card.topics && card.topics.length > 0"
                        fluid
                      >
                        <v-layout
                          row
                          wrap
                        >
                          <v-flex
                            xs12
                            style="margin-left: -15px;"
                          >
                            <template v-for="(topic, index) in card.topics">
                              <span> <a href="">{{ topic }}</a> &nbsp; </span>
                            </template>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
export default {
  name: 'ListCards',
  props: {
    data: {
      default: null
    }
  },
  data: () => ({
  }),
  computed: {
    cards () {
      return this.data
    }
  },
  mounted () {
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