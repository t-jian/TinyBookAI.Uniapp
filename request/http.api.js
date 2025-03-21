import { sysConst } from "../config";
import { request } from "./httpRequest";
const host =sysConst.host
//从这里统一注册API
const parseXhs=function(params={}){
	{
		 return request({
		   url: `${host}/queryimg?url=${params.url}`,
		   method: "GET",
		 });
	}
}
const parseXhsItems=function(urls){
	{
	   var req=[]
	   urls.forEach(function(url) {
	   	req.push(request({
		   url: `${host}/queryimg?url=${url}`,
		   method: "GET",
		 }));
	   });
		 return req;
	}
}

const getWxAccount=(params = {})=>{
	return request({
	  url: `${host}/prod-api/weixin-mp/account/listNoAuth`,
	  method: "GET",
	});
}
// 定义一个addMaterial函数，用于添加素材
const addDraft = (
  appId,
  title,
  content,
  thumb_media_id,
  author='',
  need_open_comment=1,
  only_fans_can_comment=0,
  article_type = "news"
) => {
  return request({
    url: `${host}/prod-api/weixin-mp/draft/add?appId=${appId}`,
    method: "POST",
    data: {
      articles: [{ title, content, thumb_media_id, article_type,author,need_open_comment,only_fans_can_comment }],
    },
  });
};

const uploadImage=(path,appId)=> {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: `${host}/prod-api/weixin-mp/material/uploadimg?appId=${appId}`,
			fileType: "image",
			filePath: path,
			name: "file",
			header: {
				
			},
			success(res) {
				resolve(JSON.parse(res.data))
			},
			fail(err) {
				reject(err)
			}
		});
	})			
}
const uploadThumb=(path,appId)=>{
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: `${host}/prod-api/weixin-mp/material/add_material?appId=${appId}`,
			filePath:path,
			name: "file",
			success(res) {
				resolve(JSON.parse(res.data))
			},
			fail(err) {
				reject(err)
			}
		});
	})	
}

const login=(username,password)=>{
	return request({
	  url: `${host}/prod-api/login`,
	  method: "POST",
	  data: {
	    password,
	    username
	  },
	});
}
const getInfo=()=>{
	return request({
	  url: `${host}/prod-api/getInfo`,
	  method: "GET",
	});
}
const getCommands=()=>{
	return request({
	  url: `${host}/prod-api/weixin-mp/command/list`,
	  method: "GET",
	});
}

const addCommand=(txt)=>{
	return request({
	  url: `${host}/prod-api/weixin-mp/command/personal`,
	  method: "POST",
	  data:{command:txt,createTime:null,id:null,status: "0",type: "0",updateTime:null}
	});
}

const deleteCommand=(id)=>{
	return request({
	  url: `${host}/prod-api/weixin-mp/command/personal/${id}`,
	  method: "DELETE",
	});
}


const getAiModules=()=>{
	return request({
	  url: `${host}/prod-api/ai/models`,
	  method: "GET",
	});
}


export const setupApis = (Vue, vm) => {
  const httpInstance = {
    parseXhs,
	parseXhsItems,
    addDraft,
	getWxAccount,
	uploadImage,
	uploadThumb,
	login,
	getInfo,
	getCommands,
	getAiModules,
	addCommand,
	deleteCommand
  };
  Vue.prototype.$http = httpInstance;
  uni.$http = httpInstance;
};
