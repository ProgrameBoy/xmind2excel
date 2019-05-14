// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from "axios"
import  "babel-polyfill"
import { Button, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Ports from "./assets/js/httpConfigPort"
Vue.use(Button);
Vue.prototype.axios = Axios;
Vue.prototype.$message = Message;
Vue.prototype.$ports = Ports;
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
