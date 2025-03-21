<template>
	<view class="custom-modal" v-if="visible">
		<view class="modal-content">
			<!-- 弹窗遮罩层 -->
			<view class="mask"></view>
			<!-- 主体内容 -->
			<view class="main">
				<view class="title" v-if="options.title">{{ options.title }}</view>
				<view class="content" :style="contentStyle">{{options.content}}</view>
				<view class="uni-modal__ft">
					<view @click="handleCancel" class="uni-modal__btn " style="color: rgb(0, 0, 0)">
						{{ options.cancelButtonText }}
					</view>
					<view @click="handleConfirm" class="uni-modal__btn" 
					style="color:#07c160;">
						<text style="font-size: 14px; margin-right: 4px;">（{{ remainingTime }}s)</text> {{ options.confirmText }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * from "@/config.js"
	export default {
		name: 'CustomConfirmTimer',
		data() {
			return {
				visible: false,
				showTimer: false,
				isConfirmDisabled: false,
				timerId: null,
				remainingTime: 0,
				contentStyle:'',
				options: {
					title: sysConst.tipTitle,
					content: '',
					confirmText: '确定',
					cancelButtonText: '取消',
					duration: 15,
					onConfirm: () => {},
					onCancel: () => {}
				},
			};
		},
		methods: {
			// 显示弹窗
			show(options) {
				this.options = {
					...this.options,
					...options
				}
				this.contentStyle=this.options.contentStyle||''
				this.visible = true;
				this.showTimer = true;
				this.remainingTime = Number(this.options.duration);
				this.isConfirmDisabled = false;
				console.log(this.remainingTime)
				this.startCountdown();
			},

			// 关闭弹窗
			hide() {
				this.visible = false;
				this.showTimer = false;
				clearInterval(this.timerId);
				this.timerId = null;
			},

			// 处理确认
			handleConfirm() {
				this.isConfirmDisabled = true;
				this.options.onConfirm();

			},
			onConfirm() {

			},
			// 处理取消
			handleCancel() {
				this.hide();
				this.options.onCancel();
			},
			// 启动倒计时
			startCountdown() {
				let _this = this
				this.timerId = setInterval(() => {
					_this.remainingTime--;
					if (_this.remainingTime <= 0) {
						clearInterval(this.timerId);
						_this.isConfirmDisabled = false;
						_this.handleConfirm()
						_this.hide();
					}
				}, 1000);
			}
		}
	};
</script>

<style scoped>
	.uni-modal__ft {
		position: relative;
		line-height: 48px;
		font-size: 16px;
		display: flex;
	}

	.uni-modal__btn {
		display: block;
		flex: 1;
		color: #3cc51f;
		text-decoration: none;
		position: relative;
		cursor: pointer;
	}

	.custom-modal {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
		display: block;
		box-sizing: border-box;
	}

	.modal-content {
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 10rpx;
		min-width: 60%;
	}

	.mask {
		position: fixed;
		z-index: 999;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .4);
	}

	.main {
		position: fixed;
		z-index: 999;
		width: 80%;
		max-width: 300px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		text-align: center;
		border-radius: 3px;
		overflow: hidden;
	}

	.uni-modal__ft:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #d5d5d6;
		color: #d5d5d6;
		transform-origin: 0 0;
		transform: scaleY(.5);
	}

	.uni-modal__btn:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		border-left: 1px solid #d5d5d6;
		color: #d5d5d6;
		transform-origin: 0 0;
		transform: scaleX(.5);
	}

	.title {
		font-weight: 400;
		font-size: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		padding: 1em 1.6em .3em;
	}

	.content {
		padding: 1.3em 1.6em 2em 1.3em;
		font-size: 15px;
		line-height: 1.4;
		color: #999;
		max-height: 400px;
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>