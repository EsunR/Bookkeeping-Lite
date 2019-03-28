import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: "",
    name: "",
    account: "",
    regTime: ""
  },
  mutations: {
    setState(state, obj) {
      for (let key in obj) {
        state[key] = obj[key];
      }
    }
  },
  actions: {

  }
})
