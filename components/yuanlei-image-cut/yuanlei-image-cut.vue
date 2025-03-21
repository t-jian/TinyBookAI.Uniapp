<template>
	<view class="uni-content-info">
		<view class='cropper-content'>
			<view v-if="showImage" class="uni-corpper">
				<view class="uni-corpper-content">
					<image class="uni-corpper-content-image" :src="imageSrc" mode="aspectFit" :style="'transform:rotate('+rotateAll + 'deg) rotateY('+rotateY + 'deg) rotateX('+rotateX + 'deg)'"></image>
					<view class="uni-corpper-crop-box" @touchstart.stop="contentStartMove" @touchmove.stop="contentMoveing" @touchend.stop="contentTouchEnd"
							 :style="'left:'+cutL+'rpx;top:'+cutT+'rpx;right:'+cutR+'rpx;bottom:'+cutB+'rpx'"
							>
						<view class="uni-cropper-view-box">
							<view class="uni-cropper-dashed-h"></view>
							<view class="uni-cropper-dashed-v"></view>
							<view class="uni-cropper-line-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-line-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-line-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-line-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-tr" data-drag="topTight"></view>
							<view class="uni-cropper-point point-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-rb" data-drag="rightBottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove" @touchend.stop="dragEnd"></view>
							<view class="uni-cropper-point point-bl" data-drag="bottomLeft"></view>
							<view class="uni-cropper-point point-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-lt" data-drag="leftTop"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class='cropper-operate'>
			<view v-if="btns.includes('choose')" class="cropper-operate-button cropper-operate-button-upload" @click="getImage">
				<uni-icons type="upload" size="20"></uni-icons>选择
			</view>
			<view v-if="btns.includes('refresh')"  class="cropper-operate-button cropper-operate-button-reset" @click="refresh">
				<uni-icons type="loop" size="20"></uni-icons>重置
			</view>
			
			<view v-if="btns.includes('rotate')"  class="cropper-operate-button cropper-operate-button-rotate" @click="rotateRight(rotate)">
				<uni-icons type="refreshempty" size="20"></uni-icons>
				{{rotate}}
			</view>
			
			<view v-if="btns.includes('scale')"  class="cropper-operate-button cropper-operate-button-rotate" @click="changeScale(scale)">
				<uni-icons type="plus" size="20"></uni-icons>
				{{scale}}
			</view>
			
		</view>
		<view class="text-c mt-1">
			<text class="tb-999 font-sm">公众号首图已填满绿色框为最佳，比例为 2.35 ：1</text>
		</view>
		<view class='cropper-image' v-if="imageViewSrc">
			<image mode="aspectFit" class='cropper-image-image' :src="imageViewSrc"></image>
		</view>
		<view class='cropper-config'>
		    <button style="width: 40%;" class="tb-btn_info" type="default" @click="onCancel">返回</button>
			<button class="cropper-config-button item-2 tb-btn_primary"  @click="saveImageInfo"> 提交 </button>
		</view>
		<canvas class="cropper-canvas" canvas-id="imageCanvas"></canvas>
	</view>
</template>

<script>
  
  // 获取手机信息
	let sysInfo = uni.getSystemInfoSync()
	let SCREEN_WIDTH = sysInfo.screenWidth
	let PAGE_X, // 手按下的x位置
		PAGE_Y, // 手按下y的位置 
		T_PAGE_X, // 手移动的时候x的位置
		T_PAGE_Y, // 手移动的时候Y的位置
		CUT_L, // 初始化拖拽元素的left值
		CUT_T, // 初始化拖拽元素的top值
		CUT_R, // 初始化拖拽元素的
		CUT_B, // 初始化拖拽元素的
		IMG_RATIO, // 图片宽高比例
		IMG_REAL_W, // 图片实际的宽度
		IMG_REAL_H, // 图片实际的高度
		DRAFG_MOVE_RATIO = 1 //移动时候的比例,

	export default {
		name: 'yuanleiImageCut',
		props:{
			btns:{
				type:Array,
				default:()=>{
					return ['choose','refresh','rotate','scale']
				}
				
			},
			rotate:{
				type:Number,
				default:90,
			},
			scale:{
				type:Number,
				default:10,
			},
			avatar:{
				type: String
			}
		},
		data() {
			return {
				showImage: false,
				imageSrc: "",
				imageViewSrc: "",
				// 裁剪框 边距
				cutL: 150,
				cutT: 150,
				cutB: 410,
				cutR: 150,
				rotateX: 0, // 垂直翻转角度
				rotateY: 0, // 水平翻转角度
				rotateAll: 0, // 旋转角度
				scaleTate: 1 // 图片缩放率
			}
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady() {
		},
		created() {
			this.imageSrc = this.avatar
			this.loadImage()
		},
		methods: {
			setImage(path){
				this.imageSrc = this.avatar
				this.loadImage()
			},
			setData(obj) {
				Object.keys(obj).forEach((key) => {
					this.$set(this.$data, key, obj[key])
				})
			},
			getImage() {
				uni.chooseImage({
					success: (res)=> {
						this.setData({
							imageSrc: res.tempFilePaths[0],
						})
						this.loadImage()
					},
				})
			},
			loadImage() {
				uni.showLoading({
					title:"加载中..."
				})
				uni.getImageInfo({
					src: this.imageSrc,
					success: (res) => {
						IMG_RATIO = res.width / res.height
						let scaleTate = 1;
						if (IMG_RATIO >= 1) {
							IMG_REAL_W = SCREEN_WIDTH
							IMG_REAL_H = SCREEN_WIDTH / IMG_RATIO
							scaleTate = res.width / SCREEN_WIDTH
						} else {
							IMG_REAL_W = SCREEN_WIDTH * IMG_RATIO
							IMG_REAL_H = SCREEN_WIDTH
							scaleTate = res.height / SCREEN_WIDTH
						}
						this.setData({
							showImage: true,
							rotateY: 0,
							rotateX: 0,
							rotateAll: 0,
							scaleTate: scaleTate > 1 ? scaleTate : 1
						})
						
						// #ifdef MP-WEIXIN
						this.setData({
							imageSrc: res.path,
						})
						// #endif
						
						uni.hideLoading()
						this.getImageInfo()
					}
				})
			},
			changeScale(num){
				let newL = 0
				let newR = 0
				let newT = 0
				let newB = 0
				if(this.cutL - num > 0){
					newL = this.cutL - num
				}
				if(this.cutR - num > 0){
					newR = this.cutR - num
				}
				if(newL + newR >= 750){
					newL = this.cutL
					newR = this.cutR
				}
				if(this.cutT - num > 0){
					newT = this.cutT - num
				}
				if(this.cutB - num > 0){
					newB = this.cutB - num
				}
				if(newL + newR >= 750){
					newT = this.cutT
					newB = this.cutB
				}
				this.setData({
					cutL: newL,
					cutT: newT,
					cutR: newR,
					cutB: newB
				})
				this.getImageInfo()
			},
			rotateRight(num){
				let rotate = this.rotateAll + num;
				if(rotate < 0){
					rotate += 360
				}
				this.setData({
					rotateAll: rotate % 360
				})
				this.getImageInfo()
			},
			refresh(){
				this.setData({
					cutL: 150,
					cutT: 150,
					cutB: 410,
					cutR: 150,
					rotateY: 0,
					rotateX: 0,
					rotateAll: 0
				})
				this.getImageInfo()
			},
			rotateTopButtom(){
				this.setData({
					rotateY: 180 - this.rotateY
				})
				this.getImageInfo()
			},
			rotateLeftRight(){
				this.setData({
					rotateX: 180 - this.rotateX
				})
				this.getImageInfo()
			},
			// 获取图片
			getImageInfo() {
				// 将图片写入画布
				let ctx = uni.createCanvasContext('imageCanvas', this)
				// 清除内容
				ctx.clearRect(0, 0, this.rpxToPx(750), this.rpxToPx(750))
				// 重置旋转内容
				ctx.setTransform(1, 0, 0, 1, 0, 0)
				// 操作点，旋转，翻转，恢复操作点
				ctx.translate(this.rpxToPx(375), this.rpxToPx(375))
				ctx.rotate(this.rotateAll * Math.PI / 180)
				if(this.rotateY == 180 && this.rotateX == 180){
					ctx.scale(-1, -1)
				}else	if(this.rotateY == 180){
					ctx.scale(-1, 1)
				}else	if(this.rotateX == 180){
					ctx.scale(1, -1)
				}
				ctx.translate(this.rpxToPx(-375), this.rpxToPx(-375))
				// 设置canvas背景色
				// ctx.fillStyle = 'black';
				// ctx.fillRect(0, 0, this.rpxToPx(750), this.rpxToPx(750))
				ctx.drawImage(this.imageSrc, IMG_RATIO>=1?0:(IMG_REAL_H-IMG_REAL_W)/2, IMG_RATIO<=1?0:(IMG_REAL_W-IMG_REAL_H)/2, IMG_REAL_W, IMG_REAL_H)
				ctx.draw(true, () => {
					uni.canvasToTempFilePath({
						x: this.rpxToPx(this.cutL),
						y: this.rpxToPx(this.cutT),
						width: this.rpxToPx(750 - this.cutL - this.cutR),
						height: this.rpxToPx(750 - this.cutT - this.cutB),
						destWidth: this.rpxToPx(750 - this.cutL - this.cutR) * this.scaleTate,
						destHeight: this.rpxToPx(750 - this.cutT - this.cutB) * this.scaleTate,
						quality: 1,
						canvasId: 'imageCanvas',
						success: (res)=> {
							this.setData({
								imageViewSrc: res.tempFilePath
							})
						},
						fail: (err)=> {
							console.log(err)
						}
					}, this)
				})
			},
			saveImageInfo(){
				this.$emit('save', {
					avatar: this.imageViewSrc
				})
				return this
			},
			onCancel(){
				this.$emit('onCancel')
			},
			// rpx转px
			rpxToPx(i){
				return SCREEN_WIDTH * i / 750
			},
			
			// 拖动时候触发的touchStart事件
			contentStartMove(e) {
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			// 拖动时候触发的touchMove事件
			contentMoveing(e) {
				let dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				let dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
				// 左移
				if (dragLengthX > 0) {
					if (this.cutL - dragLengthX < 0) dragLengthX = this.cutL
				} else {
					if (this.cutR + dragLengthX < 0) dragLengthX = -this.cutR
				}

				if (dragLengthY > 0) {
					if (this.cutT - dragLengthY < 0) dragLengthY = this.cutT
				} else {
					if (this.cutB + dragLengthY < 0) dragLengthY = -this.cutB
				}
				this.setData({
					cutL: this.cutL - dragLengthX,
					cutT: this.cutT - dragLengthY,
					cutR: this.cutR + dragLengthX,
					cutB: this.cutB + dragLengthY
				})

				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			contentTouchEnd() {
				this.getImageInfo();
			},
			// 设置大小的时候触发的touchStart事件
			dragStart(e) {
				T_PAGE_X = e.touches[0].pageX
				T_PAGE_Y = e.touches[0].pageY
				CUT_L = this.cutL
				CUT_R = this.cutR
				CUT_B = this.cutB
				CUT_T = this.cutT
			},
			// 设置大小的时候触发的touchMove事件
			dragMove(e) {
				let dragType = e.target.dataset.drag
				switch (dragType) {
					case 'right':
						let dragLengthR = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_R + dragLengthR < 0) dragLengthR = -CUT_R
						this.setData({
							cutR: CUT_R + dragLengthR
						})
						break
					case 'left':
						let dragLengthL = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_L - dragLengthL < 0) dragLengthL = CUT_L
						if ((CUT_L - dragLengthL) > (SCREEN_WIDTH - this.cutR)) dragLengthL = CUT_L - (SCREEN_WIDTH - this.cutR)
						this.setData({
							cutL: CUT_L - dragLengthL
						})
						break
					case 'top':
						let dragLengthT = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_T - dragLengthT < 0) dragLengthT = CUT_T
						if ((CUT_T - dragLengthT) > (SCREEN_WIDTH - this.cutB)) dragLengthT = CUT_T - (SCREEN_WIDTH - this.cutB)
						this.setData({
							cutT: CUT_T - dragLengthT
						})
						break
					case 'bottom':
						let dragLengthB = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_B + dragLengthB < 0) dragLengthB = -CUT_B
						this.setData({
							cutB: CUT_B + dragLengthB
						})
						break
					case 'rightBottom':
						let dragLengthRBX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						let dragLengthRBY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO

						if (CUT_B + dragLengthRBY < 0) dragLengthRBY = -CUT_B
						if (CUT_R + dragLengthRBX < 0) dragLengthRBX = -CUT_R
						let cutB = CUT_B + dragLengthRBY
						let cutR = CUT_R + dragLengthRBX

						this.setData({
							cutB: cutB,
							cutR: cutR
						})
						break
					default:
						break
				}
			},
			dragEnd(){
				this.getImageInfo();
			}
		}
	}
</script>

<style scoped>
	.uni-content-info{
		height: 100%;
		overflow-y: auto;
	}
	
	.cropper-content {
		min-height: 750rpx;
		width: 100%;
	}
	.cropper-operate{
		padding: 5rpx 10rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-content: flex-start;
	}
	.cropper-operate-button{
		margin: 5rpx 10rpx;
		margin-top: 10rpx;
		width: 80rpx;
		padding: 10rpx 0;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
		font-size: 14px;
		border: 3rpx solid gray;
	}
	.cropper-operate-button-upload{
		width: 170rpx;
	}
	.cropper-operate-button-reset{
		width: 110rpx;
	}
	.cropper-operate-button-rotate{
		width: 80rpx;
	}
	.cropper-config {
		position: fixed;
		width: 100%;
		bottom: 10rpx;
		padding: 10rpx;
		display: flex;
		justify-content: space-between;
		z-index: 2;
	}
	.cropper-config-button{
		width: 50%;
	}
	.cropper-image{
		padding: 10rpx 40rpx;
		margin-bottom: 80rpx;
		/* #ifndef H5 */
		margin-bottom: 120rpx;
		/* #endif */
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
	.cropper-image-image{
		width: 470rpx;
		height: 200rpx;
		border: 1px solid #07c160;
	}
	
	.cropper-canvas{
		position:absolute;
		width: 750rpx;
		height: 750rpx;
		top: -9999rpx;
		left: -9999rpx;
	}

	.uni-corpper {
		position: relative;
		overflow: hidden;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		box-sizing: border-box;
		width: 750rpx;
		height: 750rpx;
		background: #000;
	}

	.uni-corpper-content {
		position: relative;
		width:750rpx;
		height:750rpx;
		left:0rpx;
		top:0rpx
	}

	.uni-corpper-content-image {
		display: block;
		/* width: 100%; */
		min-width: 0 !important;
		max-width: none !important;
		/* height: 100%; */
		min-height: 0 !important;
		max-height: none !important;
		image-orientation: 0deg !important;
		margin: 0 auto;
		width: 750rpx;
		height: 750rpx;
	}
	/* 移动图片效果 */
	.uni-cropper-drag-box {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		cursor: move;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}
	/* 内部的信息 */

	.uni-corpper-crop-box {
		position: absolute;
		background: rgba(255, 255, 255, 0.3);
		z-index: 2;
	}

	.uni-corpper-crop-box .uni-cropper-view-box {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		outline: 1rpx solid #69f;
		outline-color: rgba(102, 153, 255, .75)
	}
	/* 横向虚线 */

	.uni-cropper-dashed-h {
		position: absolute;
		top: 33.33333333%;
		left: 0;
		width: 100%;
		height: 33.33333333%;
		border-top: 1rpx dashed rgba(255, 255, 255, 0.5);
		border-bottom: 1rpx dashed rgba(255, 255, 255, 0.5);
	}
	/* 纵向虚线 */

	.uni-cropper-dashed-v {
		position: absolute;
		left: 33.33333333%;
		top: 0;
		width: 33.33333333%;
		height: 100%;
		border-left: 1rpx dashed rgba(255, 255, 255, 0.5);
		border-right: 1rpx dashed rgba(255, 255, 255, 0.5);
	}
	/* 四个方向的线  为了之后的拖动事件*/

	.uni-cropper-line-t {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		top: 0;
		left: 0;
		height: 1rpx;
		opacity: 0.1;
		cursor: n-resize;
	}

	.uni-cropper-line-t::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0rpx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41rpx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-r {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		right: 0rpx;
		width: 1rpx;
		opacity: 0.1;
		height: 100%;
		cursor: e-resize;
	}

	.uni-cropper-line-r::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41rpx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-b {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		bottom: 0;
		left: 0;
		height: 1rpx;
		opacity: 0.1;
		cursor: s-resize;
	}

	.uni-cropper-line-b::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0rpx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41rpx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-l {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		left: 0;
		width: 1rpx;
		opacity: 0.1;
		height: 100%;
		cursor: w-resize;
	}

	.uni-cropper-line-l::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41rpx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-point {
		width: 5rpx;
		height: 5rpx;
		background-color: #69f;
		opacity: .75;
		position: absolute;
		z-index: 3;
	}

	.point-t {
		top: -3rpx;
		left: 50%;
		margin-left: -3rpx;
		cursor: n-resize;
	}

	.point-tr {
		top: -3rpx;
		left: 100%;
		margin-left: -3rpx;
		cursor: n-resize;
	}

	.point-r {
		top: 50%;
		left: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-rb {
		left: 100%;
		top: 100%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		cursor: n-resize;
		width: 36rpx;
		height: 36rpx;
		background-color: #69f;
		position: absolute;
		z-index: 1112;
		opacity: 1;
	}

	.point-b {
		left: 50%;
		top: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-bl {
		left: 0%;
		top: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-l {
		left: 0%;
		top: 50%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-lt {
		left: 0%;
		top: 0%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}
		
</style>
