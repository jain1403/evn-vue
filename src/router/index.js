import Vue from 'vue'
import Router from 'vue-router'

// import all views that router should display
import LoginView from '@/views/LoginView'
import LandingView from '@/views/LandingView'
import CatalogView from '@/views/CatalogView'
import CoverageView from '@/views/CoverageView'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: LandingView
    },
    {
      name: 'Catalog',
      path: '/catalog',
      component: CatalogView,
      beforeEnter (to, from, next) {
        // if analytic type is present in query parameters, continue as normal
        // else, redirect to landing page
        if (to.query.analyticType) {
          next()
          return
        }
        next({path: '/'})
      }
    },
    {
      name: 'Coverage',
      path: '/coverage',
      component: CoverageView
    },
    {
      name: 'Login',
      path: '/login',
      component: LoginView
    },
    {
      name: 'Logout',
      path: '/logout',
      beforeEnter (to, from, next) {
        localStorage.clear()
        next({path: '/login'})
      }
    }
  ]
})
