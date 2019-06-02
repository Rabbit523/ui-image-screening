<template>
  <v-container
    class="fluid px-0"
  >
    <v-layout column>
      <v-flex xs12>
        <v-flex xs10 offset-xs1 class="pb-3">
          <div class="display-2"> About </div>
        </v-flex>
      </v-flex>
      <v-flex xs12 text-xs-center>
        <v-flex xs10 offset-xs1 class="pb-3">
          <!-- <v-avatar
            size="200px"
            color="grey lighten-4"
          >
            <img src="https://avatars1.githubusercontent.com/u/2455106?s=400" alt="avatar">
          </v-avatar> -->
        </v-flex>
      </v-flex>
    </v-layout>
    <v-layout row wrap my-3>
      <v-flex xs10 offset-xs1>
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>

export default {
  name: 'Article',
  created () {
  },
  data: () => ({
    show: false,
    article: {
      title: 'Lorum ipsum title'
    }
  }),
  methods: {
    toRoute (rname, rparams = {}, query = {}) {
      this.dialog = true
      this.$router.push({ name: rname, params: rparams, query: query })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.about {
  font-size: 20px;
  font-weight: 400;
}

</style>
