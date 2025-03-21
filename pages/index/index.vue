<template>
	<view>
		<view class="container">
			<uni-nav-bar ref="navBar" class="nav-bar" :border="false" :fixed="true" :statusBar="true"
				background-color="#fff">
				<block slot="left">
					<view class="flex-c" style="position: relative">
						<uni-icons type="tune" size="24" @click="openLeftMain"></uni-icons>
						<view style="position: absolute;left: 24px;bottom: -4px;">
							<uni-badge type="success" :inverted="true" :offset="[-8, 13]" :text="aiTokenNumber"
								absolute="rightTop" :maxNum="maxAiTokenNumber" size="small">
								<uni-icons type="circle-filled" :color="status?'#07c160':'red'" size="10"></uni-icons>
							</uni-badge>
						</view>
					</view>
				</block>
				<view class="input-view">
				</view>
				<block slot="right">
					<view @click="onClear">
						<uni-icons custom-prefix="iconfont" type="icon-ico_newchat" size="22" color="#999"></uni-icons>
					</view>
				</block>
			</uni-nav-bar>
			<template v-if="messages.length == 0">
				<view class="chat-list" style="background: #fff">
					<view style="margin-top: 40%; text-align: center">
						<view class=""> 嗨！我是小书 </view>
						<view class="mt-1 tb-font" style="color: #999;">
							我可以帮你撰写、分析文章 ~
						</view>
					</view>
				</view>
			</template>
			<template v-else>
				<scroll-view scroll-y :scroll-top="scrollTop" class="chat-list" @scroll="handleScroll">
					<view class="chat-box" @touchstart="onTouchstart">
						<view v-for="(item, index) in messages" :key="index" class="message-item"
							:class="[item.isUser ? 'user' : 'ai']">
							<view class="message-content">
								<uni-collapse v-if="!item.isUser">
									<uni-collapse-item :open="true" titleBorder="none">
										<template v-slot:title>
											<view class="flex-c" style="margin-bottom: 8px;">
												<view :class="item.loading ? 'rotate-icon' : ''"
													style="position: relative; width: 24px; height: 24px">
													<image style="width: 90%; height: 90%; border-radius: 50%"
														src="/static/images/logo.png">
													</image>
												</view>
												<view>
													<text> {{ item.title }}</text>
												</view>
											</view>
										</template>
										<zero-markdown-view themeColor="#4c4c4c" class="assistant-box"
											v-if="item.assistant" :markdown="item.assistant"></zero-markdown-view>
									</uni-collapse-item>
								</uni-collapse>
								<view>
									<template v-if="item.isUser">
										<zero-markdown-view themeColor="#4c4c4c" class="chat-msg-box"
											v-if="item.content" :markdown="item.content"></zero-markdown-view>
										<view class="flex-c flex-end cc-tool">
											<uni-icons custom-prefix="iconfont" type="icon-zhongxinshengcheng" size="20"
												color="#c1c1c1" @click="refreshCreate(item)"></uni-icons>
											<uni-icons custom-prefix="iconfont" type="icon-fuzhi" size="18"
												color="#c1c1c1" @click="copyTxt(item,item.content)"></uni-icons>
										</view>
									</template>
									<template v-else>
										<view :id="item.flagId+'dom'">
											<zero-markdown-view :ref="item.flagId" :refid="item.flagId + '1'"
												themeColor="#4c4c4c" class="chat-msg-box" v-if="item.content"
												:markdown="item.content"></zero-markdown-view>
										</view>
									</template>
									<template v-if="!item.isUser&&item.end">
										<view class="flex-c flex-end cc-tool">
											<uni-icons type="trash" size="22" color="#c1c1c1"
												@click="deleteChat(item)"></uni-icons>
											<uni-icons custom-prefix="iconfont" type="icon--T" size="18" color="#c1c1c1"
												@click="parseTitle(item)"></uni-icons>
											<uni-icons custom-prefix="iconfont" type="icon-zhongxinshengcheng" size="20"
												color="#c1c1c1" @click="refreshCreate(item)"></uni-icons>
											<uni-icons custom-prefix="iconfont" type="icon-fuzhi" size="20"
												color="#c1c1c1" @click="copyTxt(item)"></uni-icons>
											<uni-icons custom-prefix="iconfont" type="icon-editor_1" size="20"
												color="#c1c1c1" @click="goEdit(item)"></uni-icons>
											<uni-icons custom-prefix="iconfont" type="icon-xiezuo2" size="20"
												color="#c1c1c1" @click="goEdit2(item)"></uni-icons>
										</view>
									</template>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
			<view class="bottom-container">
				<view class="botttom-tools">
					<text class="tb-tag mr-1" @click="openPopup">解析</text>
					<text class="tb-tag mr-1" @click="onOpenCodeLib">指令库</text>
					<text class="tb-tag mr-1" @tap="goEdit">文章</text>
				</view>
				<view class="input-tools-container">
					<text v-if="isShowUpDownIcon" class="input-updown" @click="isOpenInput=!isOpenInput"><uni-icons
							:type="isOpenInput?'down':'up'" color="#909399" size="16"></uni-icons></text>
					<view class="input-box" :class="isOpenInput?'input-box open':'input-box'">
						<textarea ef="chatEasyinput" class="chat-easyinput" type="textarea" :inputBorder="false"
							maxlength="-1" :trim="true" v-model="inputMessage" @confirm="sendMessage" autoHeight
							placeholder-style="fontSize:14px" placeholder="请输入内容"></textarea>
					</view>
					<view class="flex-c-sb tool-box">
						<view class="item-2">

							<uni-data-select style="width: 140px;" v-model="aiKey" :localdata="aiModules"
								@change="onAiModuleChange" placement="top" :clear="false"></uni-data-select>

						</view>
						<view class="item-2 flex-c-sb">
							<view class="">

							</view>
							<text class="operate-btn">
								<uni-icons v-if="!sendloading" @click="sendMessage" type="navigate-filled" size="36"
									:class="!sendloading && inputMessage ?'active':'disabled'"></uni-icons>
								<uni-icons v-else @click="stopChat" color="#07c160" type="smallcircle"
									size="36"></uni-icons>
							</text>
						</view>

					</view>
				</view>

			</view>
		</view>
		<tbImageLib ref="imglib" type="bottom" :showBottom="false" :parseSuccessClose="true"
			@parseChange="onParseChange" :showph="false" :autoCli="true"></tbImageLib>
		<uni-popup ref="codelib" type="bottom" class="popup-container" background-color="#fff"
			borderRadius="10px 10px 0 0">
			<view class="codelib-container tb-bottom-popup">
				<view class="flex-c-sb  code-header">
					<view class="item-2">
						<uni-segmented-control style="height: 26px;" activeColor="#07c160" :current="currentCodeTag"
							:values="codeTags" @clickItem="onClickItem" />
					</view>
					<view class="">
						<button v-if="!isCreateCode" @click="openCreateCode"
							class="tb-btn-min tb-btn_primary_plain">创建指令</button>
						<template v-else>
							<button v-if="inputCode.length>0" @click="addCode"
								class="tb-btn-min tb-btn_primary">保存指令</button>
							<button v-else @click="isCreateCode=false" class="tb-btn-min tb-btn_info">关闭创建</button>
						</template>

					</view>
				</view>

				<view class="code-body">
					<template v-if="isCreateCode">
						<view class="mt20" style="width: 100%;">
							<textarea v-model="inputCode" placeholder="从这里创建新的指令" maxlength="-1"></textarea>
						</view>
					</template>
					<template v-else>
						<template v-if="currentCodeTag === 0">
							<view class="" v-for="code in codelibs">
								<view v-if="code.type==='1'" class="code-item">
									<text class="code flex1"
										@click="onSeletedCode(code.command)">{{code.command}}</text>
									<view class="action" style="width: 10px;"></view>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="" v-for="code in codelibs">
								<view v-if="code.type==='0'" class="code-item">
									<text class="code flex1"
										@click="onSeletedCode(code.command)">{{code.command}}</text>
									<view class="action" @click="deleteCode(code)">
										<uni-icons type="trash" color="#999" size="20"></uni-icons>
									</view>
								</view>
							</view>
						</template>
					</template>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="leftPopup" background-color="#fff">
			<view class="leftPopup-conatiner" style="width: 70vw;">
				<view class="body">
					<uni-nav-bar :border="false" :fixed="true" :leftWidth="100" :statusBar="true"
						background-color="#fff">
						<block slot="left">
							<view class="tb-title">
								小书·AI<text class="font-10 tip">懂你所想</text>
							</view>
						</block>
						<block slot="right">
							<view></view>
						</block>
					</uni-nav-bar>
					<view class="tb-line"></view>
					<view class="chat-history-container">
						<scroll-view scroll-y class="scroll-view">
							<view class="flex-sb mt-1 tb-999 font-sm" v-for="(item, index) in chatListStorage"
								:key="index">
								<view @click="revertHistory(item)">
									{{ item.title}}
								</view>
								<view class="">
									<uni-icons type="trash" color="#999" size="20"
										@click="deleteHistory(item)"></uni-icons>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="bottom">
					<view class="flex-c-sb ">
						<view class="">
							{{nickName}}
						</view>
						<view class="">
							<view @tap="resetLogin" style="transform: rotate(270deg);"><uni-icons type="download"
									color="#999" size="28"></uni-icons></view>
						</view>
					</view>
					<view class="tb-999" style="font-size: 12px;">
						本机空间：{{storageTotal}} KB / 5120 KB
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import * from "@/config.js"
	import {
		SocketClient
	} from "@/static/js/SocketClient.js";
	import htmlFormat from "@/static/js/htmlFormatHelper.js"
	export default {
		components: {},
		data() {
			return {
				nickName: '',
				messages: [], // 消息列表
				inputMessage: "", // 输入内容
				scrollTop: 0, // 滚动位置
				autoScroll: true, // 是否自动滚动
				windowHeight: 0, // 可视区域高度
				lastScrollHeight: 0, // 记录上次滚动高度
				sendloading: false,
				socket: null,
				uniqueId: "",
				parseInput: ``,
				parseLoading: false,
				index: 0,
				title: "思考中...",
				time: 0,
				timer: null,
				navBarHeight: "",
				pageY: 0,
				codelibs: [],
				currentCodeTag: 0,
				codeTags: ['系统', '个人'],
				lastSeletedCode: '',
				aiKey: '',
				isOpenInput: false,
				isShowUpDownIcon: false,
				aiModules: [],
				status: 0,
				isAutoStop: false,
				isCreateCode: false,
				inputCode: '',
				sessionId: '',
				aiTokenNumber: 0,
				lastAiTokenNumber: 0,
				maxAiTokenNumber: 32000,
				storageTotal: 0,
				chatListStorage: [],
			};
		},
		watch: {
			inputMessage(newVal) {
				let len = newVal.split('\n')
				this.isShowUpDownIcon = len.length >= 2 || newVal.length > 60
			}
		},
		mounted() {
			this.initSocket();
			// 获取屏幕高度（需减去其他元素高度）
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight - 50; // 示例：减去顶部栏高度
				},
			});
		},

		onReady() {
			this.getNavBarHeight();
		},
		beforeDestroy() {
			if (this.socket) {
				this.socket.disconnect();
			}
			clearInterval(this.timer);
			this.timer = null;
		},
		onLoad() {
			this.sessionId = this.$tools.getRandomID(),
				this.init()
			uni.$on('refresh', () => {
				this.init()
				uni.$off('refresh')
			})
			this.$nextTick(() => {})
		},
		onUnload() {
			uni.$off('refresh')
		},
		methods: {
			deleteHistory(row) {
				var items = this.getStorageMessage()
				items = items.filter(n => n.sid != row.sid);
				this.chatListStorage = items
				uni.setStorageSync('chatRecords', items);
			},
			revertHistory(row) {
				this.sessionId = row.sid;
				this.messages = row.items;
				this.aiTokenNumber = 0;
				this.lastAiTokenNumber = 0;
				this.scrollToBottom();
			},
			saveStorageMessage(msg, usrMmsg) {
				let sessionid = msg.sessionId
				var items = this.getStorageMessage()
				var index = items.findIndex(n => n.sid == sessionid)
				if (index > -1) {
					var cItems = items[index].items || []
					cItems.push(usrMmsg)
					cItems.push(msg)
					items[index].items = cItems
				} else {
					var sessionObj = {
						sid: sessionid,
						items: [],
						title: usrMmsg.content.trim().substring(0, 30),
						timestamp: new Date().getTime()
					}
					sessionObj.items.push(usrMmsg)
					sessionObj.items.push(msg)
					items.push(sessionObj)
				}
				uni.setStorageSync('chatRecords', items);
			},
			getStorageMessage() {
				return uni.getStorageSync('chatRecords') || [];
			},
			init() {
				this.aiKey = uni.getStorageSync("ai")
				Promise.all([uni.$http.getInfo(), uni.$http.getCommands(), uni.$http.getAiModules()]).then(resItems => {
					if (resItems[0].code == 200) {
						this.nickName = resItems[0].user.nickName
					}
					if (resItems[1].code == 200 && resItems[1].total > 0) {
						this.codelibs = resItems[1].rows
					}
					if (resItems[2].code == 200 && resItems[2].data) {
						if (this.aiKey == undefined || this.aiKey == '') {
							this.aiKey = resItems[2].data[0].modelId;
						}
						resItems[2].data.forEach(item => {
							this.aiModules.push({
								value: item.modelId,
								text: item.name
							})
						})
					}
				})
			},
			deleteCode(row) {
				this.$tools.showModel("确认指令删除？", () => {
					this.$tools.showLoading()
					uni.$http.deleteCommand(row.id).then(res => {
						if (res.code === 200) {
							this.codelibs = this.codelibs.filter(n => n.id != row.id);
							this.$tools.toast("删除成功");
						} else {
							this.$tools.toast("删除失败:" + res.msg);
						}
						uni.hideLoading()
					}).catch(err => {
						this.$tools.toast("删除失败" + err);
						uni.hideLoading()
					})
				})
			},
			openCreateCode() {
				this.isCreateCode = true
				this.inputCode = ''
			},
			addCode() {
				uni.$http.addCommand(this.inputCode).then(res => {
					if (res.code == 200) {
						this.$tools.toast('添加指令成功')
						uni.$http.getCommands().then(res2 => {
							if (res2.code == 200) {
								this.codelibs = res2.rows
							}
							uni.hideLoading()
						}).catch(err => {
							uni.hideLoading()
						})
						this.inputCode = ''
						this.isCreateCode = false
					} else {
						this.$tools.toast('添加失败')
					}
				}).catch(err => {
					uni.hideLoading()
				})
			},
			openLeftMain() {
				this.$refs.leftPopup.open('left')
				this.$tools.getStorageSizeAsync().then(res => {
					this.storageTotal = res.kb
				});
				this.chatListStorage = this.getStorageMessage()
			},
			onAiModuleChange(e) {
				uni.setStorageSync("ai", e)
			},
			resetLogin() {
				this.$tools.showModel("确认切换账号？", () => {
					uni.setStorageSync("token", '')
					window.localStorage.clear()
					uni.redirectTo({
						url: `/pages/public/login`,
					});
				})
			},
			onClickItem(e) {
				if (this.currentCodeTag !== e.currentIndex) {
					this.currentCodeTag = e.currentIndex
				}
				this.isCreateCode = false
			},
			onSeletedCode(code) {
				let txt = this.inputMessage;
				if (this.lastSeletedCode != '') {
					txt = txt.replace(this.lastSeletedCode, '')
				}
				let cc = code;
				if (txt.trim().length > 0) {
					cc = '\n' + code;
				}
				this.inputMessage = txt + cc;
				this.lastSeletedCode = cc
				this.$refs.codelib.close()
			},
			onOpenCodeLib() {
				this.$refs.codelib.open()
			},
			onParseChange(e) {
				this.inputMessage += e
			},
			onTouchstart(e) {
				this.autoScroll = false;
				this.lastScrollHeight = 0;
			},
			onTouchend(e) {},
			handleScroll: function(e) {
				const scrollTop = e.detail.scrollTop;
				const scrollHeight = e.detail.scrollHeight;
				const clientHeight = this.windowHeight;
				if (!this.autoScroll && this.lastScrollHeight == 0) {
					this.lastScrollHeight = scrollHeight;
				}
				if (!this.autoScroll) {
					setTimeout(() => {
						uni
							.createSelectorQuery()
							.select(".chat-list")
							.boundingClientRect((res) => {
								let m = res.height + scrollTop;
								if (m >= this.lastScrollHeight) {
									//恢复自动混动
									this.autoScroll = true;
									console.log("恢复自动混动");
								}
							})
							.exec();
					}, 300);
				}
			},
			onClear() {
				this.messages = [];
				this.sendloading = false;
				this.aiTokenNumber = 0;
				this.lastAiTokenNumber = 0;
			},
			parseTitle(row) {
				let mpc = this.$refs[row.flagId][0];
				let txt = mpc.getTxt();
				this.extractTitle(txt, true)
			},
			extractTitle(txt, isTip = false) {
				var app = getApp()
				if (txt) {
					var ts = this.$tools.extractTitles(txt)
					if (ts.length > 0) {
						ts.forEach(t => {
							if (!app.globalData.titleItems.includes(t)) {
								app.globalData.titleItems.push(t)
							}
						})
						if (isTip) {
							this.$tools.toast(`标题解析完成共${ts.length}`)
						}
					}
				}
			},
			deleteChat(row) {
				let flagid = row.flagId;
				let userobj = this.messages.filter(n => n.flagId == flagid && n.isUser)[0]
				if (userobj) {
					//回填内容到输入框
					this.inputMessage = userobj.content
				}
				this.messages = this.messages.filter(n => n.flagId != flagid);
			},
			copyTxt(row, txt = '') {
				if (txt) {
					this.$tools.copyTxt(row.content);
				} else {
					let mpc = this.$refs[row.flagId][0];
					let cc = mpc.getTxt();
					this.$tools.copyTxt(cc);
				}
			},
			refreshCreate(row) {
				this.inputMessage = row.content;
				const app = getApp();
				let content = "";
				if (row.content) {
					content = row.content;
				}

				let mpc = this.$refs[row.flagId][0];
				app.globalData.content = mpc.getTxt();
				this.extractTitle(app.globalData.content)
				uni.navigateTo({
					url: url
				});
			},
			goEdit2(row) {
				let url = `/pages/editor/index?id=${row.flagId}`
				let dom = document.getElementById(row.flagId + "dom");
				let cc = dom.innerHTML;
				const app = getApp();
				cc = htmlFormat.replaceLable(cc, 'uni-view', 'p')
				cc = htmlFormat.replaceLable(cc, 'uni-view', 'p')
				cc = htmlFormat.replaceLable(cc, 'uni-rich-text', 'p')
				cc = htmlFormat.replaceLable(cc, 'uni-resize-sensor', 'p')
				cc = htmlFormat.replaceLable(cc, 'div', 'p')
				cc = htmlFormat.keepSpecificAttributes(cc)
				cc = htmlFormat.removeEmptyTags(cc)
				app.globalData.content = cc;
				this.extractTitle(cc)
				uni.navigateTo({
					url: url
				});
			},
			goEdit(row) {
				var url = `/pages/editor/index?id=${this.$tools.getRandomID()}`
				if (row.content) {
					url = `/pages/editor/index?id=${row.flagId}`
					const app = getApp();
					let content = "";
					if (row.content) {
						content = row.content;
					}
					let mpc = this.$refs[row.flagId][0];
					app.globalData.content = mpc.getTxt();
					this.extractTitle(app.globalData.content)
					uni.navigateTo({
						url: url
					});
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			getNavBarHeight() {
				const query = uni.createSelectorQuery().in(this);
				query
					.select(".nav-bar")
					.boundingClientRect((data) => {
						if (data) {
							this.navBarHeight = `calc(100vh - ${data.height}px)`;
						}
					})
					.exec();
			},
			startTimer() {
				this.timer = setInterval(() => {
					this.time += 1;
				}, 1000);
			},
			openPopup() {
				this.$refs.imglib.open();
			},
			closePopup() {
				this.$refs.popup.close();
			},
			initSocket() {
				this.socket = new SocketClient({
					url:sysConst.ws,
					reconnectLimit: 5,
				});
				let _this = this;
				this.socket
					.on("open", () => {
						console.log("Connected to server");
						this.status = 1
					})
					.on("message", (message) => {
						if (message === "" || message === "连接成功") return;
						var msg = _this.messages[_this.messages.length - 1];
						if (message === "[DONE]") {
							msg.end = true;
							msg.loading = false;
							if (this.isAutoStop) {
								msg.title = `已停止`;
								this.isAutoStop = false
							}
							_this.scrollToBottom();
							_this.sendloading = false;
							_this.lastAiTokenNumber = this.aiTokenNumber
							let userMsg = _this.messages.find(n => n.flagId == msg.flagId && n.isUser == true)
							_this.saveStorageMessage(msg, userMsg)
							return;
						}
						try {
							let result = JSON.parse(message);
							if (result.usage) {
								this.aiTokenNumber = result.usage.total_tokens + this.lastAiTokenNumber
							}
							let delta = result.choices[0].delta;
							if (delta) {
								let len = 0;
								let flag = 0;
								if (delta["content"]) {
									flag++;
									if (flag > 0) {
										clearInterval(this.timer);
										_this.timer = null;
										msg.title = `已深度思考（用时${this.time}秒）`;
										msg.loading = false;
									}
									let htmlString = msg.content + delta.content;
									msg.content = htmlString;
									len = msg.content.length;
								}
								if (delta["reasoning_content"]) {
									msg.assistant += delta.reasoning_content;
									len = msg.assistant.length;
								}
								if (this.autoScroll) {
									_this.scrollToBottom(len);
								}
							}
						} catch (error) {
							console.error(111, error);
						}
					})
					.on("close", (err) => {
						console.log(err);
						this.status = 0
					})
					.on("error", (err) => {
						console.warn("Connection error:", err);
						this.status = 0
					});
				this.socket.connect();
			},
			// 发送消息
			sendMessage() {
				if (this.aiTokenNumber >= this.maxAiTokenNumber) {
					this.$tools.toast("本轮对话超出，请新建会话");
					return;
				}
				if (this.sendloading) return;
				if (!this.inputMessage.trim() || this.sending) return;
				this.uniqueId = this.$tools.getRandomID()
				this.index += 1;
				const userMsg = {
					content: this.inputMessage,
					isUser: true,
					flagId: this.uniqueId,
					index: this.index,
					assistant: "",
					loading: true,
					end: false,
					sessionId: this.sessionId,
					title: ''
				};
				this.messages = [...this.messages, userMsg];
				this.inputMessage = "";
				this.isOpenInput = false;
				this.scrollToBottom();
				try {
					this.index += 1;
					this.sending = true;
					// 调用ChatGPT API
					const aiMsg = {
						content: ``,
						isUser: false,
						flagId: this.uniqueId,
						index: this.index,
						assistant: "",
						title: this.title,
						loading: true,
						end: false,
						sessionId: this.sessionId
					};
					//历史对话列表
					var historyItems = [];
					let msItems = this.messages;
					if (msItems.length > 0) {
						msItems.forEach((msg) => {
							let obj = {
								role: msg.isUser ? "user" : "assistant",
								content: msg.content,
							};
							historyItems.push(obj);
						});
					}
					this.messages = [...this.messages, aiMsg];
					this.socket.send({
						'model-id': this.aiKey,
						messages: historyItems,
						stream: true,
					});
					this.sendloading = true;
					this.startTimer();
				} catch (error) {
					this.$tools.toast("连接错误");
					console.log(error);
				} finally {
					this.sending = false;
				}
			},
			stopChat() {
				if (this.sendloading) {
					this.socket.stop();
					this.isAutoStop = true
				}
			},
			// 滚动到底部
			scrollToBottom(len = 0) {
				try {
					if (len == 0 || len % 4 == 0) {
						this.$nextTick(() => {
							this.scrollTop = Math.random() * 1000 + 10000;
						});
					}
				} catch (error) {
					//TODO handle the exception
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		height: 30px;
		border-radius: 15px;
		padding: 0 15px;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: 30px;
		justify-content: center;
		font-size: 16px;
	}

	.zero-markdown-view {
		padding: 0;
	}

	.container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.chat-list {
		flex: 1;

		overflow: hidden;

		.chat-box {
			padding: 10px;
		}
	}

	.message-item {
		display: flex;
		margin: 10px 0;

		&.user {
			flex-direction: row-reverse;

			.message-content {
				background-color: #f8f8f8;
			}
		}

		&.ai {
			.message-content {
				background-color: white;
			}
		}
	}

	.message-content {
		max-width: 100%;
		padding: 10px;
		border-radius: 12px;
		position: relative;
		font-size: $tb-font;
		width: 100%;
		flex: 1;

		.assistant-box {
			border-radius: 10px;
			padding: 10px 10px;
			font-size: $tb-font;
			color: #999;
			background: #f8f8f8;
		}

		.chat-msg-box {
			font-size: $tb-font;
		}
	}

	.bottom-container {
		background-color: white;
		position: relative;

		.botttom-tools {
			padding: 10px;
		}

		.input-tools-container {
			box-shadow: 1px -2px 12px 0px #dcdfe6;
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			padding: 15px;
			position: relative;
			padding-bottom: 20px;

			.input-updown {
				position: absolute;
				right: 20px;
				top: 0px;
				z-index: 1;

				/deep/.uni-icons {
					background: #d3d4d6;
					border-radius: 50%;
				}
			}

			.input-box {
				position: relative;
				max-height: 90px;
				overflow: hidden;
				min-height: 50px;
				overflow-y: auto;

				&.open {
					min-height: 70vh;
				}

				.chat-easyinput {
					width: 100%;
					min-height: 56px;
				}
			}

			.tool-box {
				padding: 10px 0 5px 0;

				/deep/.uni-select {
					border-radius: 50px;
					font-size: 12px;
					height: 30px;
				}

				/deep/.uni-select__selector-item {
					line-height: 30px;
					font-size: 12px;
				}

				.operate-btn {
					vertical-align: top;
					display: inline-block;

					.active {
						color: $tb-color-primary !important;
					}

					.disabled {
						color: $tb-color-info !important
					}
				}
			}
		}

	}

	.cc-tool {
		uni-text {
			margin-left: 15px;
			cursor: pointer;
		}
	}

	/deep/.md-p {
		font-size: inherit !important;
		letter-spacing: normal !important;
		line-height: 1.5 !important;
	}

	/deep/.uni-collapse-item__title-box {
		font-weight: normal;
		padding: 0;
		height: 20px;
		line-height: 20px;
		font-size: $tb-font;
		color: #007aff;
	}

	/deep/.uni-collapse-item__title-text {
		font-size: $tb-font;
	}

	.codelib-container {
		padding: 10px;

		.code-body {
			max-height: $tb-pupop-max-h;
			overflow: hidden;
			overflow-y: auto;
			margin-bottom: 20px;
		}

		.code-item {
			border-bottom: 1px solid #f1f1f1;
			padding: 10px 0;
			display: flex;
			align-items: center;

			.tag {
				width: 26px;
			}

			.code {
				padding: 0 4px;
				font-size: $font-sm;
				max-height: 90px;
				overflow: hidden;
				overflow-y: auto;
			}

			.action {
				width: 40px;
				text-align: center;
			}
		}
	}

	.leftPopup-conatiner {
		width: 70vw;
		height: 100%;
		display: flex;
		flex-direction: column;

		.body {
			flex: 1;
			padding: 10px;

			.tb-title {
				font-size: 14px;
				font-weight: bold;
				
				.tip {
					color: #999;
					font-weight: initial;
					margin-left: 4px;
				}
			}

		}

		.bottom {
			padding: 10px;
			border-top: 1px solid #f0f0f0;
		}
	}
</style>