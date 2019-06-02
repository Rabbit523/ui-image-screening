import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import Signup from '@/components/signup'
import Assessments from '@/components/assessments/home'
import AssessmentCreate from '@/components/assessments/assessment-create'
import AssessmentDetail from '@/components/assessments/assessment-detail'
import OptionDialog from '@/components/option/index'
import UploadFail from '@/components/option/upload-fail'
import UploadSuccess from '@/components/option/upload-success'
import ChatbotAssessments from '@/components/chatbot-assessments/assessments';
import ChatbotAssessment from '@/components/chatbot-assessments/view';
import ask from '@/components/chatbot-assessments/ask';
import support from '@/components/chatbot-assessments/support';
import About from '@/components/about';
import store from '@/store/index'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { Auth: false }
    },
    {
      path: '/signin',
      name: 'signin',
      component: Login,
      meta: { Auth: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { Auth: false }
    },
    {
      path: '/assessments',
      name: 'assessments',
      component: Assessments,
      meta: { Auth: true }
    },
    {
      path: '/create-assessment',
      name: 'assessment-create',
      component: AssessmentCreate,
      meta: { Auth: true }
    },
    {
      path: '/assessment-detail/:id',
      name: 'assessment-detail',
      component: AssessmentDetail,
      meta: { Auth: true }
    },
    {
      path: '/option',
      name: 'option-dialog',
      component: OptionDialog,
      meta: { Auth: true }
    },
    {
      path: '/upload-success',
      name: 'upload-success',
      component: UploadSuccess,
      meta: { Auth: true }
    },
    {
      path: '/upload-fail',
      name: 'upload-fail',
      component: UploadFail,
      meta: { Auth: true }
    },
    {
      path: '/chatbot-assessments',
      name: 'chatbot-assessments',
      component: ChatbotAssessments,
      meta: { Auth: true },
    },
    {
      path: '/chatbot-assessments/:id',
      name: 'view',
      component: ChatbotAssessment,
      meta: { Auth: true },
    },
    {
      path: '/ask',
      name: 'ask',
      component: ask,
      meta: { Auth: true },
    },
    {
      path: '/support/:id',
      name: 'support',
      component: support,
      meta: { Auth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: { Auth: false },
    },
  ]
})

router.beforeResolve((to, from, next) => {
  if (to.name) {
    store.dispatch('auth/loading', true)
  }
  next()
})
router.afterEach((to, from) => {
  store.dispatch('auth/loading', false)
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.Auth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters['auth/isUserAuthenticated']) {
      next({
        path: '/signin'
      })
    } else {
      next()
    }
  } else {
    if (store.getters['auth/isUserAuthenticated'] && to.path === '/signin') {
      next({
        path: '/'
      })
    }
    next() // make sure to always call next()!
  }
})

export default router
