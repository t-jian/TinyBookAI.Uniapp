<template>
	<view class="app-container">

		<view class="form">
			<view class="logo">
				<image class="logo-image" src="/static/images/logo.png" mode="aspectFit" />
			</view>
			<input class="input" v-model="phoneEmail" placeholder="请输入手机号/邮箱" placeholder-class="placeholder"
				@input="validateInput" />

			<input class="input" v-model="password" placeholder="请输入密码" placeholder-class="placeholder" password
				@input="validateInput" />

			<view class="remember-forgot" v-show="false">
				<label class="remember-me">
					<checkbox :checked="rememberMe" @click="toggleRememberMe" />
					<text>记住我</text>
				</label>
				<text class="forgot-password" @click="navigateToForgot">忘记密码？</text>
			</view>

			<button class="login-btn" :disabled="!formValid" @click="handleLogin" @submit="handleLogin">
				登入
			</button>

			<view class="register" v-show="false">
				<text>没有账号？</text>
				<text class="register-link" @click="navigateToRegister">立即注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneEmail: '',
				password: '',
				rememberMe: false,
				formValid: false
			};
		},
		created() {
			this.keyEnter()
		},
		methods: {
			keyEnter() {
				document.onkeydown = e => {
					if (e.keyCode === 13) {
						this.handleLogin()
					}
				}
			},
			validateInput() {
				// 简单的表单验证
				const isPhoneEmailValid = /^(1[3-9]\d{9})$|^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
					this.phoneEmail
				);
				const isPasswordValid = this.password.length >= 6;

				this.formValid = true //isPhoneEmailValid && isPasswordValid;
			},

			toggleRememberMe() {
				this.rememberMe = !this.rememberMe;
			},

			async handleLogin() {
				if (!this.formValid) return;

				// 显示加载提示
				uni.showLoading({
					title: '登录中...',
					mask: true
				});

				try {
					const res = await uni.$http.login(this.phoneEmail, this.password);
					// 登录成功处理
					if (res.code === 200) {
						// 存储登录状态
						uni.setStorageSync('token', res.token);
						if (this.rememberMe) {
							uni.setStorageSync('rememberMe', true);
						}
						this.$tools.toast('登录成功');
						uni.$emit("refresh")
						// 跳转到首页
						uni.redirectTo({url: '/pages/index/index'})
					} else {
						uni.showToast({
							title: res.msg || '登录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('登录失败:', error);
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},

			navigateToForgot() {
				uni.navigateTo({
					url: '/pages/forgot-password/forgot-password'
				});
			},

			navigateToRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				});
			}
		},
		onLoad() {
			// 检查记住我状态
			if (uni.getStorageSync('rememberMe')) {
				this.rememberMe = true;
				// 这里可以自动填充上次保存的账号密码（需要加密存储）
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
		background: #f1f1f1;
	}

	.logo {
		display: flex;
		justify-content: center;
	}

	.logo-image {
		width: 60px;
		height: 60px;
	}

	.form {
		background-color: #fff;
		padding: 40rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		width: 80%;
	}

	.input {
		height: 100rpx;
		border-bottom: 1rpx solid #eee;
		margin-bottom: 40rpx;
		font-size: 32rpx;
	}

	.placeholder {
		color: #999;
	}

	.remember-forgot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 60rpx;
		font-size: 28rpx;
	}

	.remember-me {
		display: flex;
		align-items: center;
	}

	.forgot-password {
		color: #007aff;
	}

	.login-btn {
		background-color: $tb-color-primary !important;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 36rpx;
	}

	.register {
		text-align: center;
		margin-top: 40rpx;
		font-size: 28rpx;
	}

	.register-link {
		color: #007aff;
		margin-left: 20rpx;
	}
</style>