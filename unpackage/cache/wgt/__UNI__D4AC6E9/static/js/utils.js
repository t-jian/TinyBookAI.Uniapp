const toast = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const copyTxt = (text) => {
	// 调用剪贴板API
	uni.setClipboardData({
		data: text,
		success: () => {
			toast('复制成功')
		},
		fail: (err) => {
			toast('复制失败')
		}
	});
}
const extractTitles = (text, left = '《', right = '》') => {
	const escapedLeft = escapeRegExp(left);
	const escapedRight = escapeRegExp(right);
	const regex = new RegExp(`${escapedLeft}([^${escapedLeft}${escapedRight}]+)${escapedRight}`, 'g');
	return Array.from(text.matchAll(regex), m => m[1]);
}
function extractUrls(text) {
	// 匹配 http/https 或 www 开头的 URL
	const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
	// 获取所有匹配结果，若无则返回空数组
	const matches = text.match(urlRegex) || [];
	// 处理每个 URL，去除末尾的标点
	let urls = matches.map(url => url.replace(/[.,?!]*$/, ''));
	if (urls.length > 0) {
		var ss = [];
		urls.forEach(item => {
			ss.push(removeXsecSource(item))
		})
		return ss
	}
	return []
}

function removeXsecSource(url) {
	// 使用正则表达式匹配并替换掉 &xsec_source=pc_sharexxx
	return url.replace(/&xsec_source=pc_share[^&]*/, '');
}

// 正则特殊字符转义函数
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isXhsContent(txt) {
	if (txt == '') return false
	return txt.includes('xhslink.com') || txt.includes('xiaohongshu.com')
}

function getClipboardDataH5() {
	return new Promise((resolve, reject) => {
		// 检查浏览器是否支持Clipboard API
		if (navigator.clipboard && navigator.clipboard.readText) {
			navigator.clipboard.readText().then(clipboardText => {
				resolve(clipboardText)
			}).catch(err => {
				console.info('clipboard err=>' + err)
				reject(err)
			});
		} else {
			console.info('当前浏览器不支持Clipboard API');
			reject()
		}
	})
}

function getRandomID() {
	return new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 6);
}

function formatTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string')) {
			time = time.replace('T', ' ')
			if ((/^[0-9]+$/.test(time))) {
				time = parseInt(time)
			} else {
				time = time.replace(new RegExp(/-/gm), '/')
			}
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		return value.toString().padStart(2, '0')
	})
	return time_str
}

function showModel(content, sunccessCallback, cancelCallback, title = "", confirmText = "确认", options) {
	uni.showModal({
		title: title || '小书提示',
		content: content || '',
		confirmText: confirmText,
		...options,
		success: function(res) {
			if (res.confirm) {
				if (typeof(sunccessCallback) == "function") {
					sunccessCallback();
				}

			} else if (res.cancel) {
				if (typeof(cancelCallback) === "function") {
					cancelCallback();
				}
			}
		}
	});
}

function showLoading(txt) {
	return uni.showLoading({
		title: txt || "提交中..."
	})
}

function base64ToBlob(base64Data) {
	//H5 可用	
	// 分离 MIME 类型和 Base64 数据
	const parts = base64Data.split(';base64,');
	const mimeType = parts[0].split(':')[1];
	const rawData = atob(parts[1]);

	// 转换为 Uint8Array
	const uint8Array = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; i++) {
		uint8Array[i] = rawData.charCodeAt(i);
	}
	// 创建 Blob 对象
	const blob = new Blob([uint8Array], {
		type: mimeType
	});
	return URL.createObjectURL(blob);
}

function getStorageSizeAsync() {
	return new Promise((resolve) => {
		uni.getStorageInfo({
			success: (res) => {
				let totalBytes = 0;
				res.keys.forEach(key => {
					const value = uni.getStorageSync(key);
					if (value) {
						const valueStr = JSON.stringify(value) || '';
						totalBytes += key.length + valueStr.length;
					}
				});
				resolve({
					bytes: totalBytes,
					kb: +(totalBytes / 1024).toFixed(2),
					mb: +(totalBytes / 1024 / 1024).toFixed(2)
				});
			},
			fail: () => resolve({
				bytes: 0,
				kb: 0,
				mb: 0
			})
		});
	});
}

export {
	extractUrls,
	toast,
	copyTxt,
	extractTitles,
	isXhsContent,
	getClipboardDataH5,
	getRandomID,
	formatTime,
	showModel,
	showLoading,
	base64ToBlob,
	getStorageSizeAsync,
}