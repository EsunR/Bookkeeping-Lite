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
import addRepayment from './components/add/addRepayment.vue'

// data
import data from './components/data/data.vue'
import month from './components/data/month.vue'
import week from './components/data/week.vue'
import compared from './components/data/compared.vue'
import customize from './components/data/customize.vue'

// center
import center from './components/center/center.vue'
import recording from './components/center/recording.vue'
import setting from './components/center/setting.vue'

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
      path: '/addRepayment',
      component: addRepayment
    },
    {
      path: '/data',
      component: data,
      redirect: "/data/week",
      children: [
        {
          path: 'week',
          component: week
        },
        {
          path: 'month',
          component: month
        },
        {
          path: 'compared',
          component: compared
        },
        {
          path: 'customize',
          component: customize
        }
      ]
    },
    {
      path: '/center',
      component: center,
      redirect: '/center/recording',
      children: [
        {
          path: 'recording',
          component: recording
        },
        {
          path: 'setting',
          component: setting
        }
      ]
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
