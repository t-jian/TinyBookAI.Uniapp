import Vue from 'vue'
import App from './App'
import * as tool from '@/static/js/utils.js'
import {setupGlobalRegister } from '@/components/globalRegister.js'
setupGlobalRegister(Vue);
Vue.config.productionTip = false
Vue.prototype.$tools = tool;
App.mpType = 'app'
const app = new Vue({
	...App
})

//注入 http拦截器与API服务
import {setupInterceptors } from '@/request/http.interceptor.js'
setupInterceptors(app);
import {setupApis} from '@/request/http.api.js'
setupApis(Vue,app)

app.$mount()