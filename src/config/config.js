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
	LOGOUT: '/usr/sysusr/logout',
	
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
	COURSE_ADD: '/edu/courses/add',
	
	// 班级信息
	CLASS_LIST: '/edu/classes/list',
	CLASS_UPDATE: '/edu/classes/update',
	CLASS_ADD: '/edu/classes/add',
	CLASS_DEL: '/edu/classes/delete',

	// 优惠券
	COUPON_LIST: '/edu/coupons/list',
	COUPON_DETAIL: '/edu/coupons/detail',
	COUPON_UPDATE: '/edu/coupons/update',
	COUPON_ADD: '/edu/coupons/add',
	COUPON_DEL: '/edu/coupons/delete',
	COUPON_OPER_DETAIL: '/edu/coupons/oper/list',
	// 品类
	CATEGORY_LIST: '/comm/categories/list',
	// 预结算金额
	SETTLE_AMOUNT: '/edu/courses/settle/amount',
	// 省市区
	AREA: '/comm/address/selectLeaf',


	couponSource: [{
		key: '0',
		name: '平台优惠券'
	}, {
		key: '1',
		name: '商户优惠券'
	}, {
		key: '2',
		name: '其他'
	}]
}