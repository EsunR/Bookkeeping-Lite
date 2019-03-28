import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import moment from 'moment'
import VueAxios from 'vue-axios'
import global from './common.vue'
import './plugins/element.js'
import './assets/style.css'
import "bootstrap"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/@mdi/font/css/materialdesignicons.min.css"


// 将引入的全局设置文件绑定到Vue的COMMON属性上
Vue.prototype.COMMON = global

// 设置axios
Vue.use(VueAxios, axios);
axios.defaults.baseURL = global.host;
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

// 全局过滤器
moment.locale('zh-cn');
Vue.prototype.$moment = moment;
Vue.filter('dateFormat', function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
  return moment(parseInt(dataStr)).format(pattern);
})

Vue.filter('money', function (money) {
  let num = Number(money);
  return num.toFixed(2);
})

Vue.filter('way', function (wayId) {
  wayId = wayId.toString();
  switch (wayId) {
    case "1":
      return "现金";
    case "2":
      return "支付宝";
    case "3":
      return "微信";
    case "4":
      return "其他";
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.config.productionTip = false
