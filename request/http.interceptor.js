//网络请求拦截器
const requestInterceptor = (vm) => {
	// 添加请求拦截器
	uni.addInterceptor('request', requestInterceptorHandle)
	uni.addInterceptor('uploadFile', requestInterceptorHandle)
}

const requestInterceptorHandle={
		async invoke(args) {
			// 请求前统一处理
			// 添加 token
			const token = await uni.getStorageSync('token')
			if (token) {
				args.header = {
					...args.header,
					Authorization: `Bearer ${token}`
				}
			}
			// 显示 loading（可选）
			//uni.showLoading({ title: '加载中...' })
			console.log('请求拦截器', args)
			return args
		},
		success(res) {
			// 请求成功后处理，可以修改返回值或添加自定义字段等
			// console.log('请求成功拦截器', res)
			if (res.statusCode === 401||res.data.code===401) {
				uni.setStorageSync('token','')
				uni.navigateTo({
					url: '/pages/public/login'
				})
				return
			}
		},
		fail(err) {
			// 请求失败处理
			uni.showToast({
				title: '网络错误',
				icon: 'none'
			})
		},
		complete(res) {
			// 请求完成处理（无论成功失败）
		}
	}

//路由跳转拦截器
const routeInterceptor = (vm) => {
	uni.addInterceptor('navigateTo', {
		invoke(args) {
			// 检查需要登录的页面
			// const needLoginPages = ['/pages/user/profile', '/pages/order/list'];
			// if (needLoginPages.includes(args.url) && !store.state.isLogin) {
			//   uni.redirectTo({ url: '/pages/login/login' });
			//   return false; // 终止原始跳转
			// }
		}
	});
};

// 统一注册所有拦截器
export const setupInterceptors = (vm) => {
	requestInterceptor(vm);
	routeInterceptor(vm);
}