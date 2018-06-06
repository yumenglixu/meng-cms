/*
* 基础信息配置
*/
let hostConfig = {
	development: 'http://39.105.28.121:8080/train-cms',
	production: 'http://39.105.28.121:8080/train-cms'
}
export default {
	// 本地
	HOST: hostConfig[process.env.NODE_ENV] || 'http://39.105.28.121:8080/train-cms',
	HOST_IMG: 'http://39.105.28.121:7777/img/',
	//  人员登录
	LOGIN: '/usr/sysusr/login',
	
	UPLOAD_FILE: '/comm/img/upload',
	UPLOAD_FILE_MULTI: '/comm/img/multi/upload',
	// 商户机构信息
	MERCHANTS_DETAIL: '/edu/corporat/detail',
	MERCHANTS_DETAIL_UPDATE: '/edu/corporat/update',
	MERCHANTS_DETAIL_ADD: '/edu/corporat/apply',

	// 机构落地页配置
	CORPORAT_INFO: '/edu/corporat/promotional',
	CORPORAT_UPDATE: '/edu/corporat/promotion',

	// 课程信息
	COURSE_LIST: '/edu/courses/list',
	COURSE_DETAIL: '/edu/courses/detail',
	COURSE_UPDATE: '/edu/courses/update',
	
	// 品类
	CATEGORY_LIST: '/comm/categories/list',
	// 预结算金额
	SETTLE_AMOUNT: '/edu/courses/settle/amount',
	// 省市区
	AREA: '/comm/address/selectLeaf',
}