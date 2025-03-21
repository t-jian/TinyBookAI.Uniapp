/** 标签格式助手 t-jian */

class htmlFormatHelper {
	/**
	 * 清楚所有标签
	 * @param {*} content
	 * @returns
	 */
	clearAllLable(content) {
		const regex = /<[^>]+>/g
		return content.replace(regex, '')
	}
	/**
	 * 清除标签包含内容
	 * @param {*} content  内容
	 * @param {*} lable  html 常规标签
	 * @param {*} replaceTxt  替换内容
	 * @returns content
	 */
	clearLable(content, lable, replaceTxt = '') {
		const regex = new RegExp(`<${lable}[^>]*?>[\\s\\S]*?<\/${lable}>`, 'gims')
		return content.replace(regex, replaceTxt)
	}
	/**
	 * 清除a标签 只保留内容
	 * @param {*} content
	 * @returns
	 */
	clearALable(content) {
		const regex = /<a.*?>([\s\S]*?)<\/a>/gims
		return content.replace(regex, '$1')
	}
	/**
	 * 清除所有标签里面的属性
	 * @param {*} content
	 * @param {*} isContainImg  默认不包含img 标签
	 * @returns
	 */
	clearAllLableAttribute(content, isContainImg = true) {
		const regex = isContainImg ? /(<(?!img)[a-zA-Z0-9]+).*?(>|\/>)/gims : /(<[a-zA-Z0-9]+).*?(>|\/>)/gims
		return content.replace(regex, '$1$2')
	}
	/**
	 * 清除img标签里面的除src外的属性
	 * @param {*} content
	 * @returns
	 */
	clearImgLableAttribute(content) {
		const regex = /(^<img).*?(src[^=]*=[\"']*[^\"'>]+[\"']*).*?(>|\/>)/gims
		return content.replace(regex, "$1 $2  alt='' $3")
	}

	/**
	 * 清除html注释
	 */
	clearNotes(content) {
		const regex = /(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/gims
		const reg2 = /(<!--.*?-->)/gims
		return content.replace(reg2, '').replace(regex, '')
	}
	/**
	 * 清除多余的空格 大于一个空格
	 * @param {} content
	 * @returns
	 */
	clearExtraSpace(content) {
		const regex = /\s(?=\s)/gims
		return content.replace(regex, '').trim()
	}
	/**
	 * 清除多余的换行 大于一个换行
	 * @param {} content
	 * @returns
	 */
	clearExtraLine(content) {
		const regex = /\n(?=\n)/gims
		return content.replace(regex, '').trim()
	}
	/**
	 * 清除多余的nbsp 大于一个nbsp
	 * @param {} content
	 * @returns
	 */
	clearExtranbsp(content) {
		const regex = /\&nbsp;(?=\&nbsp;)/gims
		return content.replace(regex, '').trim()
	}

	/**
	 * 替换标签
	 * @param {*} content  内容
	 * @param {*} lable  html 常规标签
	 * @param {*} replaceTxt  替换内容
	 * @returns
	 */
	replaceLable(content, lable, replaceTxt = '') {
		const regex = new RegExp(`(<)${lable}.*?(>)|(</).?${lable}(>)`, 'gims')
		replaceTxt = replaceTxt === '' ? replaceTxt : `$1$3${replaceTxt}$2$4`
		return content.replace(regex, replaceTxt)
	}

	/**
	 * 替换标签内的属性
	 * @param {*} content
	 * @param {*} lable
	 * @param {*} replaceTxt
	 * @returns
	 */
	replaceLableAttr(content, lable, replaceTxt = '') {
		const regex = new RegExp(`${lable}=*=[\"']*[^\"'>]+[\"']*`, 'gims')
		return content.replace(regex, replaceTxt)
	}
	removeClassAttributes(html) {
		// 正则匹配所有 class 属性（包含单/双引号及无引号的情况）
		return html.replace(/\s+class\s*=\s*(?:"[^"]*"|'[^']*'|\w+)/gi, '');
	}
	removeEmptyTags(html) {
		let previousHtml;
		do {
			previousHtml = html;
			// 仅匹配无属性的空标签，允许标签名后有空格
			html = html.replace(/<(\w+)\s*>\s*<\/\1>/gi, '');
		} while (html !== previousHtml);
		return html;
	}

	/**
	 * 正则表达式替换
	 * @param {*} content
	 * @param {*} regex
	 * @param {*} replaceTxt
	 * @returns
	 */
	replaceRegex(content, regex, replaceTxt = '') {
		console.log(content, eval(regex), replaceTxt, 66)
		return content.replace(eval(regex), replaceTxt)
	}
	/**
	 * 判断是否为正则表达式
	 * @param {} v
	 * @returns
	 */
	isRegExp(v) {
		var isreg;
		try {
			isreg = eval(v) instanceof RegExp
		} catch (e) {
			isreg = false
		}
		return isreg;
	}
	extractImgUrls(htmlString) {
		// 正则表达式匹配 <img> 标签的 src 属性
		const imgRegex = /<img[^>]+src="([^">]+)"/g;
		const imgUrls = [];
		let match;

		// 使用正则表达式循环匹配
		while ((match = imgRegex.exec(htmlString)) !== null) {
			imgUrls.push(match[1]); // 将匹配到的 src 值存入数组
		}
		return imgUrls;
	}
	keepSpecificAttributes(html) {
		// 定义允许保留的属性列表（不区分大小写）
		const allowedAttrs = ['width', 'height', 'style', 'src', 'alt'];
		// 正则匹配所有开始标签及其属性
		return html.replace(/<(\w+)(\s+[^>]*)?>/gi, (match, tag, attrs) => {
			// 若标签无属性，直接返回
			if (!attrs) return `<${tag}>`;
			// 提取并过滤属性
			const filteredAttrs = [];
			const attrRegex = /(\w+)\s*=\s*(?:"[^"]*"|'[^']*'|\S+)|(\w+)/gi;

			let attrMatch;
			while ((attrMatch = attrRegex.exec(attrs)) !== null) {
				const attrName = (attrMatch[1] || attrMatch[2]).toLowerCase();
				if (allowedAttrs.includes(attrName)) {
					// 保留带值的属性（如 width="100"）
					if (attrMatch[0].includes('=')) {
						filteredAttrs.push(attrMatch[0]);
					}
					// 处理无值的布尔属性（如 disabled）
					else {
						filteredAttrs.push(`${attrName}=""`);
					}
				}
			}
			// 重建标签
			return filteredAttrs.length > 0 ?
				`<${tag} ${filteredAttrs.join(' ')}>` :
				`<${tag}>`;
		});
	}
}

export default new htmlFormatHelper()