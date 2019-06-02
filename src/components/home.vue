<template>
  <v-layout
    row
    align-center
    justify-center
    class="home"
  >
    <home-header />
    <v-flex
      xs10
      align-center
      justify-center
      class="home-content"
    >
      <div>
        <img
          class="heart-icon"
          src="/images/icons/double-heart.svg"
          alt="home page icon"
        >
        <div class="big-title"> Hi Thøger,<br>how can I help you? </div>
        <v-text-field
          class="home-search"
          solo
          background-color="#fff"
          label="e.g I have a toothache"
        />
      </div>
    </v-flex>
  </v-layout>
</template>
<script>

export default {
  name: 'Home',
  methods: {
    toRoute (rname, rparams = {}, query = {}) {
      this.dialog = true
      this.$router.push({ name: rname, params: rparams, query: query })
    }
  }
}
</script>

<style scoped lang="scss">

.article {
  list-style-type: none;
  font-size: 18px !important;
  font-weight: 400;
  cursor: pointer;
}

.title-font {
  font-family: 'Archivo', sans-serif, Helvetica;
  font-size: 16px !important;
  font-weight: 400;
  cursor: pointer;
  color: #616161;
  line-height: 1.8;
}

.content-font {
  font-family: "Work Sans";
}

.home {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  background: linear-gradient(209.35deg, #188CB9 0%, #C7E0FB 100%);
}

.home-search {
  margin-top: 24px;
}

@media (min-width: 769px) {
  .heart-icon {
    display: flex;
    margin: auto;
  }
}

@media (max-width: 768px) {
  .home {
    align-items: flex-start;
  }

  .home-content {
    margin-top: 20%
  }
}

</style>
