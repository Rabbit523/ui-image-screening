<template>
  <v-container
    class="fluid px-0"
  >
    <v-layout column>
      <v-flex xs12>
        <v-flex xs10 offset-xs1 class="pb-3">
          <div class="display-2" v-if="threadData.data.attributes"> {{ threadData.data.attributes.initial_question }} </div>
        </v-flex>
      </v-flex>
    </v-layout>
    <v-layout row wrap my-3>
      <v-flex xs10 offset-xs1>
              <v-card flat>
                <chat-bot
                  :titleImageUrl="titleImageUrl"
                  :participants="participants"
                  :onMessageWasSent="onMessageWasSent"
                  :onUserRatingSent="onUserRatingSent"
                  :messageList="messageList"
                  :newMessagesCount="newMessagesCount"
                  :isOpen="isChatOpen"
                  :close="closeChat"
                  :open="openChat"
                  :title="title"
                  :showEmoji="false"
                  :showFile="false"
                  :colors="colors"
                  :showTypingIndicator="showTypingIndicator"
                  :alwaysScrollToBottom="alwaysScrollToBottom"
                  :disableUserInput="disableUserInput"
                  :placeholder="placeholder"
                  :showRating="showRating"
                  :disableRating="disableRating" />
              </v-card>
            </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Assessment from '@/services/assessment'
import ChatBot from '@/components/chatbot/Launcher.vue'

export default {
  name: 'Support',
  components: {
    'chat-bot': ChatBot
  },
  created () {
  },
  mounted () {
    this.getThread()
  },
  data: () => ({
    assessment: new Assessment(),
    me: 0,
    threadData: { data: {}, included: [] },
    questionSet: [],
    msgSet: [],
    params: [],
    msgQue: [],
    bodyStructures: [],
    symptoms: [],
    title: 'chatbot',
    participants: [
      {
        id: '4',
        name: 'chatbot',
        type: 'system',
        imageUrl: '/static/img/bot.png'
      },
      {
        id: 'me',
        name: 'user',
        type: 'user',
        imageUrl: '/static/img/user_32.png'
      }
    ],
    messageList: [
      // { type: 'text', author: `me`, data: { text: `Say yes!` } },
      // { type: 'text', author: `Support`, data: { text: `No.` }, suggestions: ['some quick reply', 'another one'] }
    ],
    titleImageUrl: '/static/img/bot.png',
    newMessagesCount: 0,
    showTypingIndicator: '',
    alwaysScrollToBottom: true,
    disableUserInput: false,
    placeholder: 'Type message...',
    isChatOpen: true,
    isUserInput: false,
    colors: {
      header: {
        bg: '#f7005e',
        text: '#ffffff'
      },
      launcher: {
        bg: '#f7005e'
      },
      rating: {
        bg: '#f4f7f9'
      },
      messageList: {
        bg: '#ffffff'
      },
      sentMessage: {
        bg: '#f7005e',
        text: '#ffffff'
      },
      selectedMessage: {
        bg: '#ffffff',
        text: '#f7005e'
      },
      receivedMessage: {
        bg: '#eaeaea',
        text: '#222222'
      },
      userInput: {
        bg: '#f4f7f9',
        text: '#565867'
      }
    },
    showRating: false,
    disableRating: false,
    questionCategory: ['family-members', 'genders', 'age-groups', 'body-structures', 'symptoms', 'pain-levels', 'temporal-contexts'],
    formData: { target_individual: '', message_thread: '', age_group: '', gender: '', body_structure: '', symptoms: '', pain_level: '', review_by_dentist: false, review_by_algorithm: true },
    assessmentId: 0,
    questionType: '',
    hasSymptoms: false
  }),
  watch: {
    hasSymptoms: function () {
      if (!this.hasSymptoms) {
        this.processMessageList()
      }
    }
  },
  methods: {
    toRoute (rname, rparams = {}, query = {}) {
      this.dialog = true
      this.$router.push({ name: rname, params: rparams, query: query })
    },
    getThread () {
      if (this.$route.params.id !== undefined && this.$route.params.id) {
        this.assessment.viewThread(this.$route.params.id).then(res => {
          if (res.data && res.data.attributes) {
            this.formData.message_thread = this.$route.params.id
            this.threadData = res
            this.getParameters()
          } else {
            this.$router.push({ name: 'ask' })
          }
        })
      }
    },
    getParameters () {
      this.assessment.getParams().then(res => {
        if (res.data) {
          this.params = res.data.data
          this.getStructure(1)
          // this.processMessageList()
        }
      })
    },
    getStructure (page) {
      this.assessment.getBodyStructure(page).then(res => {
        if (res) {
          res.forEach((s) => {
            let parent = s.relationships.is_a.data !== null ? s.relationships.is_a.data.id : '0'
            this.bodyStructures.push({ id: s.id, name: s.attributes.name, parent: parent })
          })
          this.questionSet = this.threadData.included.filter(msg => {
            return msg.type === 'questions-and-responses'
          })
          this.getParamsForSymptoms()
        }
      })
    },
    getParamsForSymptoms () {
      let msgData = this.threadData.included.filter(msg => {
        return msg.type === 'messages'
      })
      let bodyStructure = this.questionSet.find(function (e) {
        return e.attributes.topic === 'body-structures'
      })
      let ageGroup = this.questionSet.find(function (e) {
        return e.attributes.topic === 'age-groups'
      })
      if (bodyStructure && msgData.length) {
        let bodyStructureIndex = msgData.findIndex(function (e) {
          return bodyStructure.attributes.question === e.attributes.message_text
        })
        if (bodyStructureIndex > -1 && msgData[bodyStructureIndex + 1]) {
          this.getAnswerId('body-structures', msgData[bodyStructureIndex + 1].attributes.message_text)
        }
      }
      if (ageGroup && msgData.length) {
        let ageGroupIndex = msgData.findIndex(function (e) {
          return ageGroup.attributes.question === e.attributes.message_text
        })
        if (ageGroupIndex > -1 && msgData[ageGroupIndex + 1]) {
          this.getAnswerId('age-groups', msgData[ageGroupIndex + 1].attributes.message_text)
        }
      }
      if (!this.hasSymptoms) {
        this.processMessageList()
      }
    },
    getSymptoms () {
      if (!this.symptoms.length && this.formData.age_group !== '' && this.formData.body_structure !== '' && !this.hasSymptoms) {
        this.hasSymptoms = true
        this.assessment.getSymptoms(this.formData.age_group, this.formData.body_structure).then(res => {
          if (res) {
            res.included.forEach((q, index) => {
              this.symptoms.push({ name: q.attributes.name, id: q.attributes.id, parent: '0' })
            })
            this.hasSymptoms = false
          }
        })
      }
    },
    getAnswerId (topic, ans) {
      if (topic === 'family-members') {
        this.formData.target_individual = ans
      } else {
        let suggestions = []
        if (topic === 'body-structures') {
          suggestions = this.bodyStructures
        } else if (topic === 'symptoms') {
          suggestions = this.symptoms
          let array = ans.split(', ')
          let ids = []
          array.forEach(a => {
            let symptom = suggestions.find(p => {
              return p.name === a
            })
            ids.push(symptom.id)
          })
          this.setDataForPredicion('symptoms', ids)
        } else {
          suggestions = this.params.filter(p => {
            return p.type === topic
          }).map(function (obj) {
            return { name: obj.attributes.name, id: obj.id }
          })
        }
        let q = suggestions.find(function (element) {
          return element.name === ans
        })
        if (q) {
          this.setDataForPredicion(topic, q.id)
        }
      }
    },
    processMessageList () {
      this.messageList.push({ type: 'text', author: this.participants[0].id, data: { text: this.threadData.data.attributes.initial_question } })
      this.isUserInput = true
      this.me = this.threadData.data.relationships.user.data.id

      if (this.threadData.data.relationships.messages.data.length > 0) {
        let msgData = this.threadData.included.filter(msg => {
          return msg.type === 'messages'
        })
        if (msgData.length > 0) {
          msgData.sort(function (a, b) {
            return a.id - b.id
          })
          let topic = ''
          msgData.forEach((msg, index) => {
            if (msg.relationships.sender.data.id === this.me) {
              this.messageList.push({ type: 'text', author: `me`, data: { text: msg.attributes.message_text } })
              this.isUserInput = false
              // if (index === 0) {
              //   this.messageList.push({ type: 'text', author: this.participants[0].id, data: { text: this.threadData.data.attributes.initial_response } })
              //   // this.isUserInput = false
              // }
              if (topic !== '') {
                this.getAnswerId(topic, msg.attributes.message_text)
              }
            } else {
              topic = ''
              let q = this.questionSet.find(function (element) {
                return element.attributes.question === msg.attributes.message_text
              })
              let suggestions = []
              let multiple = false
              this.isUserInput = true
              this.placeholder = 'Type message...'
              this.disableUserInput = false
              if (q) {
                topic = q.attributes.topic
                if (q.attributes.topic === 'body-structures') {
                  suggestions = this.bodyStructures
                } else if (q.attributes.topic === 'symptoms') {
                  suggestions = this.symptoms
                  multiple = true
                } else {
                  suggestions = this.params.filter(p => {
                    return p.type === q.attributes.topic
                  }).map(function (obj) {
                    return { name: obj.attributes.name, id: obj.id, parent: '0' }
                  })
                }
                if (suggestions.length) {
                  this.placeholder = 'Chose a reply'
                  this.disableUserInput = true
                }
              }
              this.messageList.push({ type: 'text', author: this.participants[0].id, data: { text: msg.attributes.message_text }, suggestions: { data: suggestions, topic: topic, multiple: multiple } })
              this.checkMessageQue(msg.attributes.message_text)
            }
          })
        }
      } else {
        this.msgSet.push({ type: 'text', author: this.participants[0].id, data: { text: this.threadData.data.attributes.initial_response }, hasResponse: true })
        this.isUserInput = true
      }
      if (this.questionSet.length || this.isUserInput) {
        this.populateQuestions()
      } else {
        this.isUserInput = false
        this.placeholder = ''
        this.disableUserInput = true
        this.getAssessment()
      }
    },
    checkMessageQue (query) {
      this.questionSet = this.questionSet.filter(q => {
        return q.attributes.question !== query
      })
    },
    populateQuestions () {
      let params = this.params
      let vm = this
      this.questionCategory.forEach((cat, index) => {
        let q = this.questionSet.find(function (element) {
          return element.attributes.topic === cat
        })
        if (q) {
          let suggestions = []
          if (q.attributes.topic === 'body-structures') {
            suggestions = vm.bodyStructures
          } else {
            suggestions = params.filter(p => {
              return p.type === q.attributes.topic
            }).map(function (obj) {
              return { name: obj.attributes.name, id: obj.id, parent: '0' }
            })
          }
          let msg = { type: 'text', author: this.participants[0].id, data: { text: q.attributes.question, topic: q.attributes.topic }, suggestions: { data: suggestions, topic: q.attributes.topic, multiple: false } }
          this.msgSet.push(msg)
          if (q.attributes.response !== '') {
            this.msgSet.push({ type: 'text', author: this.participants[0].id, data: { text: q.attributes.response, topic: '' }, hasResponse: true })
          }
        }
      })
      this.sendResponse()
    },
    sendResponse () {
      if (!this.isUserInput) {
        if (!this.msgSet.length && !this.showRating) {
          this.getPredictions()
        }
        this.disableUserInput = false
        this.placeholder = 'Type message...'
        let vm = this
        this.msgSet.every((q, index) => {
          if (q.suggestions !== undefined && q.suggestions.topic === 'symptoms') {
            q.suggestions.data = this.symptoms
            q.suggestions.multiple = true
          }
          if (q.suggestions !== undefined && q.suggestions.data.length) {
            this.placeholder = 'Chose a reply'
            this.disableUserInput = true
          }
          this.showTypingIndicator = this.participants[0].id
          this.msgSet.splice(index, 1)
          setTimeout(function () {
            if (q.hasResponse) {
              vm.isUserInput = true
            }
            vm.questionType = q.data.topic
            vm.onMessageWasSent(q)
          }, 3000)
          return false
        })
      }
    },
    onMessageWasSent (msg) {
      this.messageList.push(msg)
      if (msg.data.topic) {
        this.setDataForPredicion(msg.data.topic, msg.data.id)
      }
      if (this.questionType === 'family-members' && msg.author === 'me') {
        this.formData.target_individual = msg.data.text
        this.questionType = ''
      }
      let receiver = msg.author === this.participants[0].id ? this.me : this.participants[0].id
      let sender = msg.author === this.participants[0].id ? this.participants[0].id : this.me
      let formData = new FormData()
      formData.append('message_text', msg.data.text)
      formData.append('thread', this.$route.params.id)
      formData.append('sender', sender)
      formData.append('receiver', receiver)
      formData.append('is_read', true)
      this.assessment.createMessage(formData)
      this.isUserInput = !this.isUserInput
      this.showTypingIndicator = ''
      this.sendResponse()
    },
    onUserRatingSent (score) {
      this.assessment.submitRating(score, this.assessmentId).then(res => {
        this.messageList.push({ author: 'me', type: 'text', data: { text: '', rating: score } })
        this.disableRating = true
        this.disableUserInput = true
      })
    },
    setDataForPredicion (topic, id) {
      switch (topic) {
        case 'body-structures':
          this.formData.body_structure = id
          break
        case 'genders':
          this.formData.gender = id
          break
        case 'age-groups':
          this.formData.age_group = id
          break
        case 'pain-levels':
          this.formData.pain_level = id
          break
        case 'symptoms':
          this.formData.symptoms = id
          break
      }
      this.getSymptoms()
    },
    getPredictions () {
      this.assessment.getPredictons(this.formData).then(res => {
        this.assessmentId = res.data.data.id
        this.showRating = true
      })
    },
    getAssessment () {
      this.assessment.get(1, this.$route.params.id).then(res => {
        if (res.data != null && res.data.length) {
          this.assessmentId = res.data[0].id
          this.getRating(res.data[0].id)
        } else {
          this.getPredictions()
        }
      })
    },
    getRating (id) {
      this.assessment.getRatings(1, id).then(res => {
        if (res.data && res.data.length) {
          this.messageList.push({ author: 'me', type: 'text', data: { text: '', rating: res.data[0].attributes.feedback_score } })
        } else {
          this.showRating = true
        }
      })
    },
    openChat () {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      this.isChatOpen = false
    }
  }
}
</script>
