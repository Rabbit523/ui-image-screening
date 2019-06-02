import Errors from '@/core/errors';
import axios from 'axios';
import { ChatGETApi, DELETEApi, ChatPOSTApi } from './index';
import * as types from '@/constant';
import lstore from '@/core/lstorage';

const { lsd } = lstore;

class Assessment {
  constructor() {
    this.errors = new Errors();
  }

  initialize(data) {
    return new Promise((resolve, reject) => {
      ChatPOSTApi(`${types.CHATBOT_BASE_URL}/chatbot-assessments/initialize/`, data)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  get(page, query = '') {
    return new Promise((resolve, reject) => {
      const params = { 'page[number]': page, 'page[size]': window.pageSize };
      if (query !== '') {
        params['filter[message_thread]'] = query;
      }

      ChatGETApi(`${types.CHATBOT_BASE_URL}/chatbot-assessments/`, params)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  view(id) {
    return new Promise((resolve, reject) => {
      ChatGETApi(`${types.CHATBOT_BASE_URL}/chatbot-assessments/${id}/`)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  getThreads(page, query = '') {
    return new Promise((resolve, reject) => {
      const params = { 'page[number]': page, 'page[size]': window.pageSize };
      if (query !== '') {
        params['filter[message_thread]'] = query;
      }

      ChatGETApi(`${types.CHATBOT_BASE_URL}/message-threads/?include=user`, params)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  viewThread(id) {
    return new Promise((resolve, reject) => {
      ChatGETApi(`${types.CHATBOT_BASE_URL}/message-threads/${id}/?include=messages`)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  getParams() {
    return new Promise((resolve, reject) => {
      ChatGETApi(`${types.CHATBOT_BASE_URL}/chatbot-assessments/parameters/`)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  getQuestionsByThreadId(threadId) {
    return new Promise((resolve, reject) => {
      ChatGETApi(`${types.CHATBOT_BASE_URL}/chatbot-assessments/${threadId}/questions_responses/`)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  getPredictionScoresById(id) {
    return new Promise((resolve, reject) => {
      ChatGETApi(`${types.CHATBOT_BASE_URL}/predictions/${id}/?include=prediction-scores`)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  getCategoryById(id) {
    return new Promise((resolve, reject) => {
      ChatGETApi(`${types.CHATBOT_BASE_URL}/categories/${id}`)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  getSymptoms(ageGroup, bodyStructure) {
    return new Promise((resolve, reject) => {
      ChatGETApi(`${types.CHATBOT_BASE_URL}/chatbot-assessments/${ageGroup}:${bodyStructure}/symptoms/`)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        });
    });
  }

  getPredictons(attributes) {
    return new Promise((resolve, reject) => {
      const payload = {
        type: 'assessments',
        attributes: attributes
      };

      ChatPOSTApi(`${types.CHATBOT_BASE_URL}/chatbot-assessments/predict/`, payload)
        .then((response) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.err);
          }
          
        })
        .catch((error) => {
          debugger
          reject(error);
          return null;
        });
    });
  }

  getBodyStructure(page, arr = []) {
    const vm = this;
    return new Promise((resolve, reject) => {
      const params = { 'page[number]': page, 'page[size]': window.pageSize, sort: 'id' };
      ChatGETApi(`${types.CHATBOT_BASE_URL}/body-structures/`, params)
        .then((response) => {
          const retData = { content: [], more: false };
          if (response.success) {
            if (response.data) {
              retData.content = arr.concat(response.data.data);
              if (response.data.meta.pagination.pages > page) {
                retData.more = true;
              }
            }
            resolve(retData);
          } else {
            this.errors.record(response.err.response.data);
            this.errors.action();
            reject(response.err);
          }
        })
        .catch((error) => {
          this.errors.record(error.response.data);
          this.errors.action();
          reject(error);
          return null;
        });
    })
      .then(retData => (retData.more ? vm.getBodyStructure(page + 1, retData.content) : retData.content));
  }

  messageList(threadId) {
    return new Promise((resolve, reject) => {
      const params = {};
      params['filter[search]'] = threadId;
      ChatGETApi(`${types.CHATBOT_BASE_URL}/messages/`, params)
        .then(response => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
          return null;
        })
        .catch((error) => {
          this.errors.record(error.response.data);
          this.errors.action();
          reject(error);
          return null;
        });
    });
  }

  createMessage(data) {
    const token = lsd.get('token', null);
    return new Promise((resolve, reject) => {
      axios.post(`${types.CHATBOT_BASE_URL}/messages/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => resolve(response.data.data))
        .catch((error) => {
          this.errors.record(error.response.data);
          this.errors.action();
          reject(error);
          return null;
        });
    });
  }

  submitRating(score, id) {
    return new Promise((resolve, reject) => {
      const payload = {
        type: 'user-ratings',
        attributes: {
          feedback_score: score,
        },
        relationships: {
          assessment: {
            data: {
              type: 'assessments',
              id,
            },
          },
        },
      };

      ChatPOSTApi(`${types.CHATBOT_BASE_URL}/user-ratings/`, payload)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(error);
          return null;
        });
    });
  }

  updateRating(score, id, assessment) {
    const token = lsd.get('token', null);
    return new Promise((resolve, reject) => {
      axios.put(`${types.CHATBOT_BASE_URL}/user-ratings/${id}/`, { feedback_score: score, assessment }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => resolve(response.data))
        .catch((error) => {
          this.errors.record(error.response.data);
          this.errors.action();
          reject(error);
          return null;
        });
    });
  }

  getRatings (page, query = '') {
    return new Promise((resolve, reject) => {
      let params = { 'page[number]': page, 'page[size]': window.pageSize }
      if (query !== '') {
        params['filter[assessment]'] = query
      }

      ChatGETApi('/user-ratings/', params)
        .then((response) => {
          if (response.success) {
            return resolve(response.data);
          }
          this.errors.record(response.err.response.data);
          this.errors.action();
          reject(response.err);
        })
        .catch((error) => {
          resolve(error)
        })
    })
  }
}

export default Assessment;
