<template>
	<view class="">
		<uni-popup ref="popupImgLib" @change="onChange" :type="popupType" class="popup-container"
			background-color="#fff" :borderRadius="isShowBottom?'10px':'10px 10px 0 0'">
			<view :class="isShowBottom?'popup-content':'popup-content  tb-bottom-popup'">
				<view class="tb-imagelib-container">
					<view class="flex-c-sb" style="margin-bottom: 4px;">
						<view class="item-2">
							<uni-badge type="success" :text="' 图库共'+imageItems.length+'张 '" size="small"></uni-badge>
							<uni-badge @click="resetParse" v-if="mode=='common'&&urlItems.length>0" type="info" :text="urlItems.length+'个链接️↓'"
								size="small"></uni-badge>
						</view>
						<view class="item-2 text-end" >
							<template v-if="showClearTag&&mode=='common'">
								<uni-tag @click="clearCC" class="font-10 ml-1" :circle="true" size="mini"
									:inverted="true" v-if="parseInput.length>0" text="清除输入" type="error" />
								<uni-tag @click="clearP" class="font-10 ml-1" :circle="true" size="mini"
									v-if="urlItems.length>0" :inverted="true" text="清除已解析" type="warning" />
							</template>
						</view>

					</view>
					<view v-if="mode=='common'" class="flex-c-sb" style="align-items: flex-start;">
						<textarea class="input-txt-box" auto-height v-model="parseInput" maxlength="-1"
							:cursorSpacing="50" placeholder="长按粘贴或复制"></textarea>
						<view class="ml-1" style="margin-top: 4px;">
							<uni-badge type="success" :offset="[10, 0]" class="uni-badge-left-margin" :text="notExeNum"
								absolute="rightTop" size="small">
								<button class="tb-btn tb-btn_primary_plain" :loading="parseLoading"
									@click="onParse">解析</button>
							</uni-badge>
						</view>
					</view>
					<view class="" v-if="showph">
						<view class="" v-for="item in urlItems">
							<view class="flex-c-sb mt-1">
								<text style="width: 100%; overflow: hidden;white-space: nowrap;font-size: 14px;"
									class="flex1">{{item}}</text>
								<view style="width: 24px;">
									<uni-icons color="#999" type="trash" size="24"></uni-icons>
								</view>
							</view>
						</view>
					</view>
					<view class="mt-1">
						<view class="image-container">
							<template v-if="!parseSuccessClose">
								<view style="position: relative;" v-for="(url, index) in imageItems"
									:class="{ selected: selectedList.includes(url),'img-box':true }"
									@tap="tapImage(url)">
									<image :src="url" mode="scaleToFill" />
								</view>
							</template>
						</view>
					</view>
				</view>
				<view style="margin: -10px;" class="flex-c-sb" v-if="isShowBottom">
					<button class="tb-btn item-2 tb-radius-0" style="border-bottom-left-radius:10px !important"
						@click="closePopup">取消</button>
					<button class="tb-btn tb-btn_primary item-2 tb-radius-0"
						style="border-bottom-right-radius:10px !important" @click="onConfimChoose">确认</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "tb-image-lib",
		props: {
			mode: {
				type: String,
				default: "common",//common包含解析，img,进显示图片
			},
			items:{
				type:Array,
				default:()=>{
					return []
				}
			},
			type: {
				type: String,
				default: "center",
			},
			isMulti: {
				type: Boolean,
				default: false
			},
			limit: {
				type: Number,
				default: -1,
			},
			showBottom: {
				type: Boolean,
				default: true
			},
			parseSuccessClose: {
				type: Boolean,
				default: false
			},
			clearLastChoose: {
				type: Boolean,
				default: true
			},
			showph: {
				type: Boolean,
				default: false
			},
			autoCli: {
				type: Boolean,
				default: true
			},
			showClearTag: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				maxLimit: this.limit,
				popupType: this.type,
				isShowBottom: this.showBottom,
				parseInput: '',
				parseLoading: false,
				selectedList: [], // 已选图片列表
				imageItems: this.items,
				urlItems: [],
				lastClipboardContent: '',
				listenCliObj: null,
				clihistors: [],
				notExeNum: 0,
			};
		},
		methods: {
			resetParse(){
				this.parseInput=this.urlItems.join(',');
				this.onParse()
			},
			clearCC() {
				this.parseInput = ''
			},
			clearP() {
				this.urlItems = []
				this.imageItems = []
				this.selectedList = []
				this.clihistors = []
			},
			tapImage(url) {
				if (this.maxLimit > 0 && this.selectedList.length > this.maxLimit) {
					this.$tools.toast("图片选择超出")
					return;
				}
				if (this.isMulti) {
					// 多选模式
					const index = this.selectedList.indexOf(url);
					if (index === -1) {
						this.selectedList.push(url);
					} else {
						this.selectedList.splice(index, 1);
					}
				} else {
					// 单选模式
					this.selectedList = this.selectedList[0] === url ? [] : [url];
				}
				// 发送选中变化事件
				this.$emit('change', this.selectedList);
			},
			onConfimChoose() {
				if (this.selectedList.length == 0) {
					this.$tools.toast('请选择图片');
					return;
				}
				this.$emit('choose', this.selectedList);
				if (this.clearLastChoose) {
					this.selectedList = []
				}
				this.closePopup();
			},
			open() {
				var app = getApp()
				if(this.mode=='common'){
					this.urlItems = app.globalData.exUrlItems;
					if (app.globalData.imgItems.length > 0) {
						app.globalData.imgItems.forEach((item) => {
							var vv = []
							if (!this.imageItems.includes(item)) {
								vv.push(item)
							}
							this.imageItems = [...this.imageItems, ...vv]
						});
					}
				}else{
					this.imageItems=[...this.items]
				}
				this.$refs.popupImgLib.open();
			},
			listenCli() {
				this.listenCliObj = setInterval(() => {
					console.log('listen cli')
					uni.getClipboardData({
						success: (res) => {
							let txt = res.data
							this.appendInput(txt)
						},
						fail: (err) => {
							this.$tools.getClipboardDataH5().then(txt => {
								this.appendInput(txt)
							}).catch(er => {

							})
						}
					});
				}, 500);
			},
			appendInput(txt) {
				if (this.$tools.isXhsContent(txt)) {
					if (!this.clihistors.includes(txt)) {
						//没有粘贴过才进行，自动进行
						this.clihistors.push(txt);
						if (!this.parseInput.includes(txt)) {
							let urls = this.$tools.extractUrls(txt);

							this.notExeNum += urls.length
							this.parseInput += txt
							this.$tools.toast('已从剪切板粘贴')
						}
					}
				}
			},

			closePopup() {
				this.$refs.popupImgLib.close();
			},
			onChange(e) {
				if (e.show) {
					if (this.mode==='common'&&this.autoCli) {
						this.listenCli()
					}
				} else {
					if (this.listenCliObj) {
						console.log(this.listenCliObj)
						clearInterval(this.listenCliObj)
						this.listenCliObj = null
					}
				}
			},
			 onParse() {
				if (!this.parseInput) {
					this.$tools.toast("请输入内容");
					return;
				}
				let urls = this.$tools.extractUrls(this.parseInput);
				if (urls.length === 0) {
					this.$tools.toast("未包含链接");
					return;
				}
				this.parseLoading = true;
				var ss=this.urlItems||[]
				urls.forEach((item) => {
					ss.push(item)
				});
				const unique =[...new Set(ss)];
				const app = getApp();
				app.globalData.exUrlItems=unique;
				this.urlItems=unique
				this.$emit("onChangeParse",unique)
				var isM = urls.length > 1
				Promise.all(uni.$http.parseXhsItems(urls)).then(resItems => {
					let title = ''
					this.notExeNum = 0
					var success = 0
					resItems.forEach(res => {
						if (res.code == 100) {
							success += 1;
							title += res.data.title
							if (res.data.pics != null && res.data.pics.length > 0) {
								for (var im in res.data.pics) {
									let img = res.data.pics[im];
									let ximg = img.replace(
										"ci.xiaohongshu.com",
										"tb.aimzhi.cn/img"
									);
									if (!app.globalData.imgItems.includes(ximg)) {
										app.globalData.imgItems.push(ximg)
									}
									if (!this.imageItems.includes(ximg)) {
										this.imageItems.push(ximg);
									}
								}
							}
						}
					})
					if (resItems.length == 1) {
						if (success == 0) {
							this.$tools.toast(`解析失败`);
							this.parseLoading = false;
							return
						}
						this.$tools.toast(`解析成功`);
						this.$emit("parseChange", title)
						this.parseLoading = false;
					} else {
						//多链接
						if (resItems.length == success) {
							this.$tools.toast(`解析成功`)
						} else {
							this.$tools.toast(`解析${urls.length}成功${success}`);
						}
						this.parseLoading = false;
						this.$emit("parseChange", title)
					}
					if (this.parseSuccessClose) {
						this.closePopup();
					}
					this.parseLoading = false;
				}).catch(err => {
					console.error(err)
					this.$tools.toast("解析错误" + err);
					this.parseLoading = false;
				})

			},

		},

	}
</script>

<style lang="scss" scoped>
	.popup-container {
		.popup-content {
			border-radius: $tb-radius;
			padding: 10px;
		}
	}

	.tb-imagelib-container {
		.input-txt-box {
			width: 100%;
			height: 30px;
			border: none !important;
			background-color: #f0f0f0 !important;
			border-radius: 4px !important;
			padding: 4px 10px !important;
			line-height: 30px;
			font-size: 14px;
			max-height: 60px;
			overflow:hidden;
			overflow-y: auto;
		}

		.image-container {
			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			/* 将容器分成三等分 */
			gap: 10px;
			/* 设置列间距 */
			max-height: 50vh;
			overflow: hidden;
			overflow-y: auto;
			min-height: 150px;
			margin-bottom: 20px;
			box-sizing: border-box;

			.img-box {
				width: auto;
				height: 120px;
				box-sizing: border-box;
				padding: 4px;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.selected {
				border: 2px solid $tb-color-primary;

			}
		}
	}
</style>