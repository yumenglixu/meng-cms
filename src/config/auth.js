import {extendObservable} from "mobx";
import Service from './service';
import config from './config';
import Cookies from 'js-cookie';

class User{
	constructor(){
		extendObservable(this,{
			entity: null
		})
	}
}

var checkPromise = null;

export const UserObj = new User();

export default {

	// 获取用户信息以检测用户状态
	checkStatus: ()=>{
		if (checkPromise == null) {
			checkPromise = new Promise((resolve, reject)=>{
				if (UserObj.entity) {
					checkPromise = null;
					resolve(true);
				}
				else {
					let sessionId = Cookies.get('sessionId');
					if (sessionId) {
						UserObj.entity = true;
						resolve(true);
					}
					else {
						resolve(false);
					}
					checkPromise = null;
					// Service.getUserInfo().then((res)=>{
					// 	if (res.status_code === 200) {
					// 		UserObj.entity = true;
					// 		// 存储用户id
					// 		Cookies.set('uid', res.data.id);
					// 		resolve(true);
					// 	}
					// 	else {
					// 		resolve(false);
					// 	}
					// 	checkPromise = null;
					// }).catch(()=>{
					// 	resolve(false);
					// 	checkPromise = null;
					// });
				}
			});
		}
		return checkPromise;
	},
	// 是否授权
	isAuthorized: ()=>{
		if (Cookies.get('sessionId')) {
			UserObj.entity = true; 
		}
		return UserObj.entity ? true : false;
	},
	toLogin: (redirect_uri)=>{
		if (redirect_uri) {
			window.location.href =  '/login?redirect=' + encodeURIComponent(redirect_uri);
        }
        else {
			window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href);			
		}	
	}
}