<template>
    <div class="sc-suggestions-row" v-if="!multiple" :style="{background: colors.messageList.bg}">
      <button
        v-if="this.currentPage !== 0"
        type="button"
        class="sc-suggestions-element arrow"
        :style="baseStyles"
        @click="onChangePage(false)"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </button>
      <button class="sc-suggestions-element" v-for="(suggestion, idx) in filteredSuggestion" @click="clicked($event, suggestion)"
      :style="baseStyles" :key="idx">{{suggestion.name}}&nbsp;</button>
      <button
        v-if="this.currentPage !== this.totalPage - 1"
        type="button"
        class="sc-suggestions-element arrow"
        :style="baseStyles"
        @click="onChangePage(true)"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </button>
    </div>
    <div class="sc-suggestions-row" v-else :style="{background: colors.messageList.bg}">
      <v-layout row wrap>
        <v-flex row>
          <button
            v-if="this.currentPage !== 0"
            type="button"
            class="sc-suggestions-element arrow"
            :style="baseStyles"
            @click="onChangePage(false)"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </button>
          <!-- <v-flex xs12 sm4 md4 v-for="(suggestion, idx) in suggestionData"  :key="idx">
            <button type="button" class="sc-suggestions-element" @click="clicked(suggestion)"
          :style="suggestion.selected ? selectedStyles : baseStyles" :key="idx" >{{suggestion.name}}&nbsp;</button>
          </v-flex> -->
          <button
            class="sc-suggestions-element"
            v-for="(suggestion, idx) in filteredSuggestion"
            @click="clicked($event, suggestion)"
            :style="baseStyles"
            :key="idx"
          >
            {{suggestion.name}}&nbsp;
          </button>
          <button
            v-if="this.currentPage !== this.totalPage - 1"
            type="button"
            class="sc-suggestions-element arrow"
            :style="baseStyles"
            @click="onChangePage(true)"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </v-flex>
        <v-flex xs12>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" style="border-radius: 15px;" type="button" :disabled="!selectedArr.length" @click="submitSuggestion()">Ok</v-btn>
        </v-card-actions>
      </v-flex>
      </v-layout>
    </div>
</template>

<script>
export default {
  data () {
    return {
      suggestionData: [],
      multiple: false,
      baseStyles: {},
      selectedStyles: {},
      selectedArr: [],
      number_per_page: 8,
      currentPage: 0,
      totalPage: 1,
      filteredSuggestion: []
    }
  },
  props: {
    suggestions: {
      type: Object
    },
    colors: {
      type: Object,
      required: true
    }
  },
  watch: {
    suggestions: function (newValue) {
      let suggestions = newValue
      this.suggestionData = []
      this.filteredSuggestion = []

      this.multiple = false
      if (suggestions && suggestions.data) {
        this.suggestionData = suggestions.data.filter(s => {
          return s.parent === '0'
        }).map(function (obj) {
          let o = Object.assign({}, obj)
          o.selected = false
          return o
        })
        if (this.suggestions.multiple) {
          this.multiple = true
        }

        if (this.suggestionData.length < this.number_per_page) {
          this.filteredSuggestion = this.suggestionData
          this.totalPage = 1
        } else {
          this.totalPage = Math.ceil(this.suggestionData.length / this.number_per_page)
          this.filteredSuggestion = this.suggestionData.slice(this.number_per_page * this.currentPage, this.number_per_page * this.currentPage + this.number_per_page)
        }

        this.baseStyles = { borderColor: '#6CB4D9', backgroundColor: '#fff', color: '#6CB4D9' }
        this.selectedStyles = { borderColor: '#6CB4D9', backgroundColor: '#6CB4D9', color: '#fff' }
      }
    },
    currentPage: function () {
      if (this.suggestionData.length < this.number_per_page) {
        this.filteredSuggestion = this.suggestionData
      } else {
        this.filteredSuggestion = this.suggestionData.slice(this.number_per_page * this.currentPage, this.number_per_page * this.currentPage + this.number_per_page)
      }
    }
  },
  methods: {
    clicked (event, suggestion) {

      if (event.target.className.indexOf('active') === -1) {
        event.target.className = event.target.className + ' active'
      } else {
        event.target.className = event.target.className.replace(' active', '')
      }
      if (this.multiple) {
        suggestion.selected = !suggestion.selected
        let cur = this.selectedArr.indexOf(suggestion.id)
        if (cur > -1) {
          this.selectedArr.splice(cur, 1)
        } else {
          this.selectedArr.push(suggestion.id)
        }
      } else {
        if (!this.filterData(suggestion.id)) {
          let data = { author: 'me', type: 'text', data: { text: suggestion.name, topic: suggestion.topic, id: suggestion.id } }
          this.$parent._submitSuggestion(data)
        }
      }
      // this.$emit('sendSuggestion', suggestion)
    },
    filterData (id) {
      let suggestions = this.suggestions
      if (suggestions && suggestions.data) {
        this.suggestionData = suggestions.data.filter(s => {
          return s.parent === id
        })
        return this.suggestionData.length ? 1 : 0
      }
      return 0
    },
    submitSuggestion () {
      let text = ''
      this.selectedArr.forEach((el, index) => {
        let data = this.suggestions.data.find(function (element) {
          return element.id === el
        })
        if (index) {
          text += ', '
        }
        text += data.name
      })
      this.suggestionData = []

      this.$parent._submitSuggestion({ author: 'me', type: 'text', data: { text: text, topic: this.suggestions.topic, id: this.selectedArr } })
    },
    onChangePage (isForward=true) {
      if (this.suggestionData.length > this.number_per_page) {
        if (isForward) {
          if (this.currentPage < this.totalPage - 1) {
            this.currentPage = this.currentPage + 1
          }
        } else {
          if (this.currentPage > 0) {
            this.currentPage = this.currentPage - 1
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.sc-suggestions-row {
  text-align: center;
  background: inherit;
}

.sc-suggestions-element {
  margin: 3px;
  padding: 5px 10px 5px 10px;
  border: 1px solid;
  border-radius: 5px !important;
  font-size: 14px;
  background: inherit;
  cursor: pointer;
  border-radius: 4.8px;
  color: #fff;

  i {
    width: 15px;
    height: 15px;
    color: #fff !important;
  }

  &.arrow {
    background-color: $light-blue !important;

    &:hover {
      opacity: 0.6;
    }
  }
}

.sc-suggestions-element.active {
  background-color: $light-blue !important;
  color: #fff !important;
}
</style>
