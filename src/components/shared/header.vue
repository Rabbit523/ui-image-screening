<template>
  <header>
    <v-navigation-drawer
      v-model="drawer"
      right
      app
      floating
      class="sidebar"
    >
      <v-container grid-list-sm />
      <v-list>
        <template>
          <span
            class="close-btn"
            @click="toogleDrawer()"
          >
            <v-icon>close</v-icon>
          </span>
          <v-list-tile
            v-for="(item, i) in items"
            :key="i"
          >
            <v-list-tile-content>
              <v-list-tile-title
                style="cursor: pointer"
                @click.stop="toRoute(item.link)"
              >
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="isAuthenticated">
            <v-list-tile-content>
              <v-list-tile-title
                style="cursor: pointer"
                @click.stop="signout()"
              >
                Sign out
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-else>
            <v-list-tile-content>
              <v-list-tile-title
                style="cursor: pointer"
                @click.stop="toRoute('signin')"
              >
                Sign in
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-spacer />
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>
              Copyright {{ year }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      fixed
      class="header-bar"
    >
      <v-spacer />
      <v-toolbar-side-icon
        dark
        @click.stop="drawer = !drawer"
      />
    </v-toolbar>
  </header>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Header',
  data: () => ({
    isList: false,
    drawer: false,
    search: '',
    show: true
  }),
  computed: {
    items () {
      let menu = [
        { icon: 'home', text: 'Home', link: 'home' },
        { icon: 'add_box', text: 'Initial Screenings', link: 'assessments' },
        { icon: 'add_box', text: 'Report problem/bug', link: 'report' },
        { icon: 'add_box', text: 'Reviews', link: 'review' },
        { icon: 'add_box', text: 'Chat', link: 'chatbot-assessments' }
      ]
      return menu
    },
    year () {
      return new Date().getFullYear()
    },
    isAuthenticated () {
      return this.isUserAuthenticated
    }
  },
  methods: {
    toRoute (rname, rparams = {}, query = {}) {
      this.dialog = true
      this.$router.push({ name: rname, params: rparams, query: query })
    },
    signout () {
      this.$store.dispatch('auth/signoutUser')
    },
    ...mapActions('auth', [
      'isUserAuthenticated'
    ]),
    toogleDrawer () {
      this.drawer = !this.drawer
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

.v-toolbar {
  box-shadow: none;
}

.header-bar {
  background-color: $light-blue !important;
}

.sidebar {
  background: $light-grey !important;
  box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.25);

  .v-list__tile__title {
    font-family: Work Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #fff;
  }
}

.close-btn {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;

  i {
    color: #fff !important;
  }
}
</style>