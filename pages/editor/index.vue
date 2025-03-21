<template>
	<view class="app-container" style="height: 100%;overflow: hidden;">
		<uni-nav-bar class="nav-bar" :border="false" color="#5c5c5c" :fixed="true" :statusBar="true"
			background-color="#ffffff">
			<block slot="left">
				<view class="flex-c" style="position: relative">
					<view v-if="index == 0" class="nav-btn" @click="back">
						<uni-icons type="left" size="18"></uni-icons>
					</view>
					<view v-if="index == 1" class="nav-btn" @click="nextStep(0)">
						<uni-icons type="left" size="18"></uni-icons>
					</view>
				</view>
			</block>
			<block slot="right">
				<template v-if="index == 0">
					<view class="flex-c-sb">
						<text v-if="showSaveDraftTip==1" style="margin-right: 6px;color: #07c160;">已保存</text>
						<text class="tb-999" style="margin-right: 6px;min-width: 44px">字数 {{wordsNumber}}</text>
						<text @click="nextStep(1)" v-if="wordsNumber>0"
							class="tb-btn-min tb-btn_info_plain tb-333">下一步</text>
						<text v-else class="tb-btn-min tb-btn_info_plain">下一步</text>
					</view>
				</template>
				<view v-if="index == 1" class="ml-1">

				</view>
			</block>
		</uni-nav-bar>
		<view v-show="index == 0" style="height: 100%;">
			<sp-editor id="myEditor" editorId="editor" :toolbar-config="toolbarConfig" :readOnly="false"
				@input="inputOver" @upinImage="upinImage" @init="initEditor" @overMax="overMax"
				@exportHtml="exportHtml">
				<view slot="sptoolbar">
					<view class="display-flex">
						<uni-icons class="mr-1" color="#5c5c5c" type="images-filled" size="28"
							@click="openImgLib"></uni-icons>
						<template v-if="draftNumber>0">
							<view @click="openDraftLib">
								<uni-badge type="success" :offset="[2, 2]" :text="draftNumber" absolute="rightTop"
									size="small">
									<uni-icons custom-prefix="iconfont" type="icon-caogaoxiang" color="#5c5c5c"
										size="25"></uni-icons>
								</uni-badge>
							</view>
						</template>
						<view class="undo-redo-container">
							<uni-icons class="mr-1" type="undo" size="28" @tap="undo"></uni-icons>
							<uni-icons class="mr-1" type="redo" size="28" @tap="redo"></uni-icons>
						</view>
					</view>
				</view>
			</sp-editor>

		</view>
		<template v-if="index==0">
			<tbImageLib ref="imglib" :isMulti="true" type="center" @choose="onChoose"></tbImageLib>
		</template>
		<template v-if="index == 1">
			<view>
				<view style="padding: 0 10px;">
					<uni-section title="标题" type="line">
						<view style="position: relative;padding: 0 10px;">
							<textarea class="input-title" style="width: 100%;" maxlength="-1" :auto-height="true"
								v-model="title" :inputBorder="false" :clearable="false" placeholder="输入标题"
								placeholderStyle="font-size:16px"></textarea>
						</view>
						<view slot="right">
							<uni-tag v-if="titleItems.length>0" :inverted="true" text="选择标题" type="success"
								:circle="true" size="mini" @click="$refs.titleLib.open()" />
						</view>
					</uni-section>
					<uni-section title="选择发布的公众号" type="line">
						<uni-data-select v-model="appId" :localdata="wxAccounts" :clear="false"></uni-data-select>
					</uni-section>
					<uni-section title="封面图 比例2.35:1" type="line">
						<view slot="right">
							<uni-tag v-if="coverUrl" class="mr-1" :inverted="true" text="封面裁剪" type="warning"
								:circle="true" size="mini" @click="isOpenClip=true" />
							<uni-tag v-if="articleImgs.length>0" class="mr-1" :inverted="true" text="正文中选择"
								type="success" :circle="true" size="mini" @click="$refs.imglib2.open()" />
							<uni-tag :inverted="true" text="图库中选择" type="success" :circle="true" size="mini"
								@click="openImgLib(false)" />
						</view>
						<uni-file-picker v-model="chooseThumb" limit="1" ref="files" mode="grid" :auto-upload="true"
							@select="addCover" @delete="removeThumb"></uni-file-picker>
					</uni-section>
					<uni-section title="其他设置" type="line">
						<view style="padding: 0 10px;">
							<view class="flex-c">
								<view style="width: 100px;">
									<input class="input-title" @blur="onInputAuthorblur" v-model="author" maxlength="8"
										placeholder="作者" />
								</view>
								<view class="flex1 flex-c">
									<view class="">
										<uni-tag v-for="item in authorTags" :circle="true" :inverted="true"
											:text="item.name" size="mini" type="success" @click="onSeletedTag(item)" />
									</view>
								</view>
							</view>
							<view class="mt-1">
								<view class="">
									<text>开启评论
										<switch @change="switchChangeComment" :checked="neddOpenComment==1"
											color="#07c160" style="transform:scale(0.7)" />
									</text>
									<text class="ml-1" v-if="neddOpenComment==1">是否粉丝才可评论
										<switch @change="switchChangeComment2" :checked="onlyFanscanComment===1"
											color="#07c160" style="transform:scale(0.7)" />
									</text>
								</view>
							</view>
						</view>
					</uni-section>
				</view>

				<view style="position: absolute;left: 0; right: 0;bottom: 30px;background: #f0f0f0;padding: 30px 0;">
					<view class="flex-c-sb" style="padding: 15px;">
						<view class=""></view>
						<view class=""><button class="tb-btn tb-btn_primary" @click="submit">提&nbsp交</button></view>
					</view>
				</view>
				<view
					style="width: 100%; position: absolute;left: 0; right: 0;bottom: 0;text-align: center;color: #d3d4d6;">
					<text class="font-10">小书·AI 懂你所想</text>
				</view>
			</view>
			<tbImageLib ref="imglib" type="center" @choose="onChooseThumb" :autoCli="false" :clearLastChoose="false"
				:showClearTag="false" />
			<tbImageLib ref="imglib2" mode="img" :autoCli="false" :items="articleImgs" type="center"
				@choose="onChooseThumb" />

		</template>
		<uni-popup ref="titleLib" type="bottom" class="popup-container" background-color="#fff"
			borderRadius="10px 10px 0 0">
			<view class="codelib-container">
				<view class="code-body">
					<view class="" v-for="code in titleItems">
						<view class="code-item" @click="onSeletedTitle(code)">
							<text class="code flex1">{{code}}</text>
							<view class="action"></view>
						</view>
					</view>

				</view>
			</view>
		</uni-popup>
		<uni-popup ref="draftLib" type="bottom" class="popup-container" background-color="#fff"
			borderRadius="10px 10px 0 0">
			<view class="codelib-container">
				<view class="flex-c-sb">
					<view class="item-2">
						<uni-tag :mark="true" text="草稿箱" type="success" size="small" />
					</view>
					<view class="item-2 text-end">
						<uni-tag @click="clearDraft(1)" class="font-10 ml-1" :circle="true" size="mini" :inverted="true"
							text="清除草稿" type="error" />
					</view>
				</view>
				<view class="code-body">
					<view class="" v-for="item in draftItems">
						<view class="code-item" @click="revertDraft(item)">
							<text class="code flex1">{{item.title}}</text>
							<view class="flex-sb-c">
								<view class="">
									<uni-badge class="uni-badge-left-margin" :text="item.urls.length+'链接'"
										type="info" />
								</view>
								<text
									style="font-size: 12px;color: #8f939c;">{{$tools.formatTime(item.timestamp,'{m}-{d} {h}:{i}')}}</text>
							</view>

						</view>
					</view>

				</view>
			</view>
		</uni-popup>
		<template v-if="isOpenClip&&coverUrl">
			<view style="position: fixed;top: 0; left: 0;width: 100%;height: 100%;z-index: 100;background: #fff;">
				<yuanlei-image-cut :avatar="coverUrl" @onCancel="onCancelClip" @save="onSaveClip"></yuanlei-image-cut>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		convertImgStylesToAttributes,
		handleHtmlWithVideo,
	} from "@/uni_modules/sp-editor/utils";
	import htmlFormat from "@/static/js/htmlFormatHelper.js"
	export default {
		data() {
			return {
				appId: "",
				title: "",
				coverUrl: "",
				content: '',
				editorIns: null,
				urls: [],
				toolbarConfig: {
					keys: ["bold", "italic", "underline", "image"],
					iconSize: "20px",
					iconColumns: 10,
				},
				imageList: [],
				parseInput: "",
				parseLoading: false,
				index: 0, // 0 上一步\1下一步
				openPopupType: 0,
				wxAccounts: [], //公众号列表
				chooseThumb: [],
				showImaLib: true,
				titleItems: [],
				wordsNumber: 0,
				id: '',
				draft: 'tbdraft',
				timer: null,
				perSecondTimer: null,
				draftNumber: 0,
				draftItems: [],
				flagTimer: false,
				isBack: false,
				author: '',
				authorTags: [],
				neddOpenComment: 1,
				onlyFanscanComment: 0,
				showSaveDraftTip: -1,
				lastEditorTxt: "",
				isOpenClip: false,
				articleImgs: [],
			};
		},

		computed: {

		},
		onLoad(option) {
			var loading = uni.showLoading({
				title: "加载中..",
			})
			this.id = option.id || this.$tools.getRandomID()
			const draftResult = this.getDraft()
			const app = getApp()
			this.wordsNumber = 0
			this.content = app.globalData.content||''
			this.titleItems = app.globalData.titleItems||[]
			this.listenerEditorInit(() => {
				if (draftResult && draftResult.num > 0) {
					this.$tools.showModel(`检测到存在草稿，是否恢复？`, () => {
						this.content = draftResult.content
						this.wordsNumber = draftResult.num
						this.setEditorContent(draftResult.content)
						this.listenerEditor()
					}, () => {
						this.setEditorContent(app.globalData.content)
						this.listenerEditor()
					}, "恢复")
				} else {
					if (this.content) {
						this.setEditorContent(this.content)
						this.listenerEditor()
					}
				}
				uni.hideLoading()
			});
			uni.$http.getWxAccount()
				.then(res => {
					if (res.code == 200 && res.rows.length > 0) {
						var v = []
						res.rows.forEach(item => {
							v.push({
								value: item.appId,
								text: item.name
							});
						})
						this.appId = res.rows[0].appId
						this.wxAccounts = v
						this.authorTags = this.getAutorTags()
					}
				})
			this.perSecondTimer = setInterval(() => {
				if (this.showSaveDraftTip >= 0) {
					this.showSaveDraftTip++;
				}
			}, 1000);
		},
		mounted() {
			const systemInfo = uni.getSystemInfoSync();
			// 监听 H5 返回按钮
			window.addEventListener('popstate', () => {
				if (!this.isBack) {
					this.isBack = true;
					this.saveEditorDraft()
					setTimeout(() => this.isBack = false, 1000);
				}
			});
		},
		destroyed() {
			console.log("==== destroyed :");
			this.clearTimer()
			if (this.perSecondTimer) {
				clearInterval(this.perSecondTimer)
			}
		},
		methods: {
			onCancelClip() {
				this.isOpenClip = false
			},
			onSaveClip(e) {
				this.$tools.showLoading()
				const avatarUrl = this.$tools.base64ToBlob(e.avatar);
				this.onCancelClip()
				this.setThumb(avatarUrl)
				uni.hideLoading()
			},
			onInputAuthorblur() {
				if (this.author) {
					this.saveAutorTag(this.author)
				}
			},
			switchChangeComment(e) {
				this.neddOpenComment = e.detail.value ? 1 : 0
			},
			switchChangeComment2(e) {
				this.onlyFanscanComment = e.detail.value ? 1 : 0
			},
			revertDraft(draftResult) {
				const app = getApp()
				uni.showModal({
					content: `是否恢复草稿？`,
					confirmText: '恢复',
					success: (res) => {
						if (res.confirm) {
							this.id = draftResult.id
							this.content = draftResult.content
							this.wordsNumber = draftResult.num
							if (draftResult.urls && draftResult.urls.length > 0) {
								app.globalData.exUrlItems = draftResult.urls
							}
							this.setEditorContent(draftResult.content)
							this.$refs.draftLib.close()
						}
					}
				})
			},
			clearDraft(all = 0) {
				const draftList = uni.getStorageSync(this.draft) || [];
				if (draftList.length > 0) {
					if (all != 0) {
						uni.removeStorageSync(this.draft)
						this.draftNumber = 0
						this.draftItems = []
						return;
					}
					const draft = draftList.filter(item => item.id != this.id);
					uni.setStorageSync(this.draft, draft);
				}
			},
			getDraft() {
				const draftList = uni.getStorageSync(this.draft) || [];
				const draft = draftList.find(item => item.id === this.id);
				this.draftNumber = draftList.length
				this.draftItems = draftList
				if (draft) {
					return draft;
				}
				return null;
			},
			onSeletedTag(row) {
				this.author = row.name
			},
			deleteTag(id) {
				const tags = uni.getStorageSync('atgs') || [];
				tags = tags.filter(n => n.id != id)
				uni.setStorageSync('atgs', tags);
			},
			getAutorTags() {
				const tags = uni.getStorageSync('atgs') || [];
				return tags.filter(n => n.aid == this.appId);
			},
			saveAutorTag(txt) {
				const tag = {
					id: this.$tools.getRandomID(),
					aid: this.appId,
					name: txt,
					timestamp: new Date().getTime()
				};
				let tagItems = uni.getStorageSync('atgs') || [];
				const index = tagItems.findIndex(item => item.aid === this.appId && item.name == txt);
				if (index === -1) {
					tagItems.push(tag)
				}
				uni.setStorageSync('atgs', tagItems);
				console.log('暂存作者标签:', txt);
			},
			saveDraft(txt, num, title) {
				const app = getApp()
				const draft = {
					id: this.id,
					content: txt,
					num: num,
					title: title,
					urls: app.globalData.exUrlItems,
					timestamp: new Date().getTime()
				};
				// 获取草稿列表
				let draftList = uni.getStorageSync(this.draft) || [];
				// 查找是否已存在相同 id 的草稿
				const index = draftList.findIndex(item => item.id === draft.id);
				if (index !== -1) {
					draftList[index] = draft;
				} else {
					draftList.push(draft);
				}
				// 保存草稿列表
				uni.setStorageSync(this.draft, draftList);
				console.log('草稿已保存:', draft.id);
			},
			openDraftLib() {
				this.$refs.draftLib.open()
			},
			initEditor(editor) {
				this.editorIns = editor;
			},
			listenerEditorInit(callbackFun) {
				//监听编辑器初始化完成
				if (this.editorIns) {
					callbackFun()
				} else {
					let tt = setInterval(() => {
						if (this.editorIns) {
							callbackFun()
							clearInterval(tt);
						}
					}, 500)
				}
			},
			setEditorContent(txt) {
				this.editorIns.setContents({
					html: txt
				})
				let _this = this
				setTimeout(() => {
					_this.editorIns.getContents({
						success: (res) => {
							let txt2 = res.text.trim()
							_this.wordsNumber = txt2.length
							let txt = res.html
							if (_this.wordsNumber > 0 && res.html) {
								_this.saveDraft(res.html, _this.wordsNumber, txt2.substring(0, 30))
							}
						}
					})
				}, 300)
			},
			listenerEditor() {
				if (this.editorIns) {
					let _this = this
					this.timer = setInterval(() => {
						console.log('listener editor')
						_this.saveEditorDraft()
					}, 3000)

				}
			},
			saveEditorDraft() {
				let _this = this
				this.editorIns.getContents({
					success: (res) => {
						let txt2 = res.text.trim()
						_this.wordsNumber = txt2.length
						if (txt2 != _this.lastEditorTxt) {
							let txt = res.html
							if (_this.wordsNumber > 0 && res.html) {
								_this.saveDraft(res.html, _this.wordsNumber, txt2.substring(0, 30))
								_this.lastEditorTxt = txt2;
								_this.showSaveDraftTip = 0;
							}
						}
					}
				})
			},
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer)
				}

			},
			nextStep(t) {
				this.index = t
				if (t === 1) {
					if (this.timer) {
						clearInterval(this.timer)
					}
					this.editorIns.getContents({
						success: (res) => {
							this.articleImgs = htmlFormat.extractImgUrls(res.html);
						},
					})
				} else {
					//恢复监听
					this.listenerEditor()
				}
			},
			onSeletedTitle(t) {
				this.title += t
				this.$refs.titleLib.close()
			},
			openImgLib(isM = true) {
				this.$refs.imglib.open()
			},
			onChoose(e) {
				e.forEach(path => {
					this.insertImage(path);
				})
			},
			onChooseThumb(e) {
				this.setThumb(e[0])
			},
			setThumb(path) {
				this.coverUrl = path
				this.chooseThumb = [{
					"name": "file.png",
					"extname": "png",
					"url": path,
				}]
			},
			insertImage(path) {
				let _this = this;
				return new Promise((resolve, reject) => {
					this.editorIns.insertImage({
						src: path,
						width: "100%",
						success: (res) => {
							this.$tools.toast("图片插入成功");
							resolve(res);
						},
						fail: (res) => {
							reject(res);
						},
					});
				});
			},
			back() {
				this.clearTimer()
				this.saveEditorDraft()
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},

			addCover(e) {
				console.log('上传封面', e)
				this.coverUrl = e.tempFilePaths[0];
			},
			removeThumb(e) {
				console.log('移除封面', e)
				this.coverUrl = ''
			},
			/**
			 * 替换文本中的指定内容
			 * @param {string} text - 需要处理的原始文本
			 * @param {Object} replacementMap - 替换规则对象，键为需要被替换的内容，值为替换后的内容
			 * @returns {string} - 替换后的文本
			 */
			replaceTextWithMap(text, replacementMap) {
				// 转义正则表达式中的特殊字符
				function escapeRegExp(string) {
					return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& 表示匹配到的整个字符串
				}
				// 遍历每个替换规则并执行全局替换
				for (const [key, value] of Object.entries(replacementMap)) {
					const regex = new RegExp(escapeRegExp(key), "g");
					text = text.replace(regex, value);
				}
				return text;
			},
			async submit() {
				if (this.title == '') {
					this.$tools.toast("标题不能为空");
					return
				}
				if (this.content == '') {
					this.$tools.toast("内容不能为空");
					return
				}
				if (this.coverUrl == '') {
					this.$tools.toast("封面不能为空");
					return
				}
				this.$customLoading.show('提交中...');
				this.editorIns.getContents({
					success: async (res) => {
						let html = res.html;
						let localPaths = htmlFormat.extractImgUrls(html);
						let imagePathMap = {};
						if (localPaths.length > 0) {
							this.$customLoading.setTitle(`上传内容图片 ${localPaths.length} / 0`)
							var uploadNum = 0;
							for (let path of localPaths) {
								try {
									let urlRes = await uni.$http.uploadImage(path, this.appId);
									let url = urlRes.url
									imagePathMap[`${path}`] = url;
									this.$customLoading.setTitle(
										`上传内容图片 ${localPaths.length} / ${uploadNum}`)
									uploadNum += 1
								} catch (err) {
									this.$tools.toast("图片上传错误");
								}
							}
						}
						let content = this.replaceTextWithMap(html, imagePathMap);
						this.$customLoading.setTitle(`上传封面中...`)
						let result = await uni.$http.uploadThumb(this.coverUrl, this.appId)
						let mediaId = result.mediaId;
						if (mediaId == undefined || mediaId == '') {
							this.$tools.toast("封面图片上传错误");
							this.$customLoading.hideLoading()
							return
						}
						this.$customLoading.setTitle(`提交所有信息...`)
						uni.$http
							.addDraft(`${this.appId}`, this.title, content, mediaId, this.author, this
								.neddOpenComment, this.onlyFanscanComment)
							.then((res) => {
								if (res.media_id != undefined && res.media_id != '') {
									this.$tools.toast("提交成功")
									this.clearDraft()
									this.$confirmTimer.show({
										content: '提交成功，即将前往主页',
										confirmText: "立即前往",
										contentStyle: "color:#07c160;font-weight: bold;",
										duration: 5,
										onConfirm: () => {
											uni.redirectTo({
												url: "/"
											})
										}
									});
								} else {
									this.$tools.toast("提交失败" + res)
								}
								this.$customLoading.hideLoading()
							}).catch(err => {
								this.$tools.toast("提交失败")
								this.$customLoading.hideLoading()
							})
					},
					fail: (res) => {
						console.log("failfail", res);
						this.$customLoading.hideLoading()
					},
				});
			},
			/**
			 * 获取输入内容
			 * @param {Object} e {html,text} 内容的html文本，和text文本
			 */
			inputOver(e) {
				this.content = e.text.trim()
				this.wordsNumber = this.content.length
				if (!this.timer) {
					this.listenerEditor()
				}
			},
			/**
			 * 超出最大内容限制
			 * @param {Object} e {html,text} 内容的html文本，和text文本
			 */
			overMax(e) {
				console.log("==== overMax :", e);
			},

			/**
			 * 直接运行示例工程插入图片无法正常显示的看这里
			 * 因为插件默认采用云端存储图片的方式
			 * 以$emit('upinImage', tempFiles, this.editorCtx)的方式回调
			 * @param {Object} tempFiles
			 * @param {Object} editorCtx
			 */
			upinImage(tempFiles, editorCtx) {
				tempFiles.forEach(async (item) => {
					let localPath = tempFiles[0].path;
					this.insertImage(localPath);
				});
			},

			/**
			 * 导出
			 * @param {string} e 导出的html内容
			 */
			exportHtml(e) {
				// 若携带视频，需按需导入handleHtmlWithVideo方法处理富文本，再导出
				const temphtml = handleHtmlWithVideo(e);
				uni.navigateTo({
					url: "/pages/out/out",
					success(res) {
						res.eventChannel.emit("e-transmit-html", {
							data: temphtml,
						});
					},
				});
			},

			undo() {
				this.editorIns.undo();
			},
			redo() {
				this.editorIns.redo();
			},
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.sp-editor-toolbar {
		align-items: center;
		z-index: 10;
		background: #fff;
		position: sticky;
		top: 40px;
		padding: 0 10px;

		.iconfont {
			color: #5c5c5c !important
		}

	}

	/deep/.editor-container {
		padding: 10px;
	}

	/deep/.sp-editor-wrapper {
		margin-bottom: 40px;
	}




	/deep/.input-title input {
		font-weight: 500;
	}

	/deep/.capsule-input {
		.uni-easyinput__content {
			border: none !important;
			background-color: #f0f0f0 !important;
			border-radius: 20px !important;
			padding: 4px 15px !important;

		}

		.uni-easyinput__content-input {
			height: 30px;
		}

		.uni-easyinput__placeholder-class {
			color: #888 !important;
		}

		textarea {
			color: #333 !important;
			font-size: 15px !important;
			min-height: 13px !important;
			line-height: 1.2 !important;
		}
	}

	.app-container {
		.undo-redo-container {
			position: absolute;
			right: 0;
		}

		.nav-btn {
			font-size: 15px;
			font-weight: 500;
		}
	}

	/deep/.uni-popup__wrapper {
		width: calc(100% - 20px) !important;
	}

	/deep/.uni-navbar__header-btns-right {
		width: 50% !important;
	}

	/deep/.uni-input-input {
		font-size: 16px;
	}


	/deep/.file-picker__box {
		width: 100% !important;
	}



	.cover-btn {
		border: none;
		font-size: 14px;
		height: 32px;
		line-height: 32px;
		margin: 0 5px;
		padding: 0 10px;
	}

	.codelib-container {
		padding: 10px;

		.code-body {
			max-height: 50vh;
			min-height: 20vh;
			overflow: hidden;
			overflow-y: auto;
			margin-bottom: 20px;
		}

		.code-item {
			border-bottom: 1px solid #f1f1f1;
			padding: 5px 0;
			display: flex;
			align-items: center;

			.tag {
				width: 26px;
			}

			.code {
				overflow: hidden;
				padding: 0 4px;
				font-size: $font-sm;
			}

			.action {
				width: 10px;
				text-align: center;
			}
		}
	}

	.input-title {
		border-bottom: 1px solid #f1f1f1;
	}

	/deep/.input-title .uni-easyinput__content {
		width: calc(100% - 15px);
	}
</style>