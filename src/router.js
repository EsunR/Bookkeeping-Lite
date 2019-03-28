import Vue from 'vue'
import Router from 'vue-router'
import global from './common.vue'


// home
import home from './components/home/home.vue'
import expenditure from './components/home/expenditure.vue'
import income from './components/home/income.vue'

// add
import add from './components/add/add.vue'
import addExpenditure from './components/add/addExpenditure.vue'
import addIncome from './components/add/addIncome.vue'

// data
import data from './components/data/data.vue'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      redirect: '/home/expenditure',
      component: home,
      children: [
        {
          path: 'expenditure',
          component: expenditure
        },
        {
          path: 'income',
          component: income
        }
      ]
    },
    {
      path: '/add',
      component: add,
      redirect: '/add/addExpenditure',
      children: [
        {
          path: 'addExpenditure',
          component: addExpenditure
        },
        {
          path: 'addIncome',
          component: addIncome
        }
      ]
    },
    {
      path: '/data',
      component: data
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('token')) {
    next();
  } else {
    console.log("no token!");
    window.location.href = global.login_location
    next();
  }
})

export default router
