import _ from 'loadsh'
import axios from 'axios'
import { GETApi, DELETEApi } from '@/services'
import * as types from '@/constant'
import lstore from '@/core/lstorage'

const lsd = lstore.lsd

const PHOTOS = [
  { id: 0, imageUrl: require('../../assets/assessments/image_right_external.png'), position: 0, imageName: 'image_right_external' },
  { id: 1, imageUrl: require('../../assets/assessments/image_frontal_external_closedmouth.png'), position: 1, imageName: 'image_frontal_external_closedmouth' },
  { id: 2, imageUrl: require('../../assets/assessments/frontal_frontal_external_smilingmouth.png'), position: 2, imageName: 'frontal_frontal_external_smilingmouth' },
  { id: 3, imageUrl: require('../../assets/assessments/image_ceiling_intra.png'), position: 3, imageName: 'image_ceiling_intra' },
  { id: 4, imageUrl: require('../../assets/assessments/image_bottom_intra.png'), position: 4, imageName: 'image_bottom_intra' },
  { id: 5, imageUrl: require('../../assets/assessments/image_right_intra_closedteeth.png'), position: 5, imageName: 'image_right_intra_closedteeth' },
  { id: 6, imageUrl: require('../../assets/assessments/image_frontal_intra_closedteeth.png'), position: 6, imageName: 'image_frontal_intra_closedteeth' },
  { id: 7, imageUrl: require('../../assets/assessments/image_left_intra_closedteeth.png'), position: 7, imageName: 'image_left_intra_closedteeth' },
  { id: 8, imageUrl: '/', position: 8, imageName: '' }
]

const initialState = {
  assessments: [],
  categories: [],
  detailAssessments: {},
  initialPhotos: PHOTOS, // photos which are showed initially when creating assessment
  currentPhotos: PHOTOS,
  errors: '',
  progress: { status: 'None', value: 0 },
  currentAssessmentId: '',
  additionalQuestions: [{
    id: 1,
    question: 'When has it started?',
    response: 'Ok, got it',
    options: null,
    'input-type': 'choice',
    is_casespecific: false,
    is_hierarchical: false,
    tone: 'casual',
    topic: 'temporal-contexts'
  },{
    id: 2,
    question: 'Do you have anything else to add?',
    response: 'Ok, got it',
    options: null,
    'input-type': 'choice',
    is_casespecific: false,
    is_hierarchical: false,
    tone: 'casual',
    topic: 'supplimentary'
  },{
    id: 3,
    question: 'Alright, that’s all I need to know. Let me get the assessment ready',
    response: 'Ok, thank you',
    options: null,
    'input-type': 'choice',
    is_casespecific: false,
    is_hierarchical: false,
    tone: 'casual',
    topic: 'prediction'
  }]
}

const actions = {
  fetchAssessments ({ commit }) {
    const token = lsd.get('token', null)
    axios.get(`${types.BASE_URL}/new-image-sets/?include=images`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/vnd.api+json'
      }
    })
      .then((res) => {
        console.log(res)
        commit('fetchAssessments', res.data.included)
      })
  },
  createAssessment ({ commit }, assessment) {
    let newAssessment = { ...assessment, id: Math.random().toString(36).substring(7) }

    commit('createAssessment', newAssessment)
  },
  fetchAssessmentsById ({ commit, state }, id) {
    return GETApi(`${types.BASE_URL}/new-image-sets/${id}/?include=images`).then(res => res)
  },
  updateAssessmentsById ({ commit }, payload) {
    commit('updateAssessmentById', payload)
  },
  deleteAssessmentById ({}, idx) {
    return DELETEApi(`${types.BASE_URL}/image-assessments/${idx}`).then(res => res)
  },
  updateCurrentPhotos ({ commit }, payload) {
    commit('updateCurrentPhotos', payload)
  },
  asyncFileUpload ({ commit, state }, isReviewByDentist) {
    let paramsForImages = {}

    if (isReviewByDentist) {
      paramsForImages.review_by_dentist = true
      paramsForImages.review_by_algorithm = false
    } else {
      paramsForImages.review_by_dentist = false
      paramsForImages.review_by_algorithm = true
    }

    state.currentPhotos.map((item) => {
      if (item.imageUrl.indexOf('data:image') > -1) {
        paramsForImages[item.imageName] = item.imageUrl.split(';base64,')[1]
      }
    })

    const token = lsd.get('token', null)

    axios.post(`${types.BASE_URL}/image-assessments/predict/`, {
      data: {
        type: 'assessments',
        attributes: {
          ...paramsForImages,
          user: 2
        }
      }
    },
    {
      onUploadProgress: progressEvent => {
        const percent = parseInt(Math.round(progressEvent.loaded * 100 / progressEvent.total))
        commit('updateProgress', percent)
      },
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/vnd.api+json'
      }
    })
      .then((res) => {
        commit('endProgress', {
          code: true,
          assessmentId: res.data.data.id
        })
      })
      .catch((err) => {
        commit('endProgress', {
          code: false,
          assessmentId: 0
        })
      })
  },
  initProgress ({ commit }) {
    commit('initProgress')
  },
  getPredictionById ({}, id) {
    return GETApi(`${types.BASE_URL}/predictions/${id}/?include=prediction_scores`)
      .then(res => res.data)
  },
  getImageById ({}, id) {
    return GETApi(`${types.BASE_URL}/images/${id}`)
      .then(res => res)
  },
  fetchCategories ({ commit }) {
    return GETApi(`${types.BASE_URL}/categories`)
      .then(res => {
        commit('getCategories', res.data)
      })
  }
}

const mutations = {
  fetchAssessments (state, payload) {
    state.assessments = payload
  },
  getCategories (state, payload) {
    state.categories = payload.data
  },
  createAssessment (state, payload) {
    let assessments = Object.assign([], state.assessment)
    assessments.push(payload)

    state.assessments = assessments
  },
  updateAssessmentById (state, payload) {
    let detailAssessments = Object.assign({}, state.detailAssessments)
    let currentDetailAssessments = detailAssessments[payload.assessmentId] || []

    const index = _.findIndex(currentDetailAssessments, function (o) {
      return o.position == payload.data.position
    })

    if (index !== -1) {
      currentDetailAssessments[index] = payload.data
    } else {
      currentDetailAssessments.push(payload.data)
    }

    detailAssessments[payload.assessmentId] = currentDetailAssessments

    state.detailAssessments = null
    state.detailAssessments = Object.assign({}, detailAssessments)
  },
  updateCurrentPhotos (state, payload) {
    let currentPhotos = Object.assign([], state.currentPhotos)

    const index = _.findIndex(currentPhotos, function (o) {
      return o.position == payload.position
    })

    if (index !== -1) {
      currentPhotos[index] = payload
    } else {
      currentPhotos.push(payload)
    }

    state.currentPhotos = currentPhotos
  },
  initProgress (state) {
    let progress = { status: 'None' }
    state.progress = progress
  },
  updateProgress (state, payload) {
    let progress = {
      status: 'Pending',
      value: payload
    }

    state.progress = Object.assign({}, progress)
  },
  endProgress (state, payload) {
    let progress = {
      status: 'End',
      code: payload.code
    }

    state.progress = progress
    state.currentAssessmentId = payload.assessmentId
  }
}

const getters = {
  getAssessments (state) {
    return state.assessments
  },
  getAssessmentsById (state) {
    return state.detailAssessments[0]
  },
  getInitialPhotos (state) {
    return state.initialPhotos
  },
  getCurrentPhotos (state) {
    return state.currentPhotos
  },
  getProgress (state) {
    return state.progress
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
