
import popupConfirm from './custom-popupConfirm/popupConfirm.js'
import loading from './custom-loading/loading.js'
import tbImageLib from './tb-imageLib/index.vue'
//全局注册与挂载
export const setupGlobalRegister = (Vue) => {
	Vue.use(popupConfirm)
	Vue.use(loading)
	Vue.component("tbImageLib", tbImageLib)
}


