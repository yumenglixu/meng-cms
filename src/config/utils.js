import moment from 'moment';
import config from './config';
import Service from './service';
import {message} from 'antd';
export default {
	
	phoneValid(phone){
        // let myreg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        return /^1[3578][0-9]{9}$/.test(phone);
	},
	emailValid(email){
		return /[0-9a-zA-Z]+([-_.][0-9a-zA-Z]+)*@[0-9a-zA-Z]+([-_.][0-9a-zA-Z]+)*(\.[0-9a-zA-Z])+/.test(email);
    },
 	isWeiXin() {
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) === 'micromessenger') {
			return true;
		}
		return false;
	},
	timeProcess(time) {
		if (time) {
			time = time.toString();
			time = time.substr(5);
			time = time.substr(0, time.length - 3);
		}
		return time;
	},
	// 账号信息脱敏
	publicDesensitization(str) {
		if (str) {
			if (/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
				|| /^(13[0-9]|16[0-9]|19[0-9]|147|15[0-9]|17[6-8]|18[0-9])\d{8}|17[0-9]\d{8}$/.test(str)) {
				// 身份证号 || 手机号
				str = str.substr(0, 3) + '****' + str.substr(-4);
			}
			else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(str)) {
				// 邮箱号码  前二 后以 @ 分割
				str = str.substr(0, 2) + '****' + str.substr(str.indexOf('@'));
			}
			else if (/^\d{16}|\d{19}$/.test(str)) {
				// 银行卡号  后四位
				str = '****' + str.substr(-4);
			}
			else {
				str = str.split('');
				// 普通姓名
				for (let i = 0; i < str.length; i++) {
					if (i < str.length / 2) {
						str[i] = '*';
					}
				}
				str = str.join('');
			}
			return str;
		}
	},

	// 将分转成元
	converMoney(money = 0, type = '', decimals = 2, decimalPoint = '.', separator = ',') {
		money = +money;
		if (isNaN(money) || money === 0) { // 非 “数字” 或 0 返回 "0.00"
			return '0.00';
		}
	
		money = '' + (money / 100).toFixed(decimals); // 转化 decimals 位数的小数
		let [integerPart, decimalPart] = money.split('.');
		let reg = /(\d+)(\d{3})/;
	
		while (reg.test(integerPart)) { // 循环添加千位分隔符
			integerPart = integerPart.replace(reg, `$1${separator}$2`);
		}
	
		if (/^0+$/.test(decimalPart)) { // 整数
			money = integerPart;
		}
		else {
			money = `${integerPart}${decimalPoint}${decimalPart}`; // 小数
		}
	
		switch (type) {
			case 'cn':
				money = `${money}元`; // 标题和其他描述性文案使用 “元”
				break;
			case 'en':
				money = `¥${money}`; // 金额独立展示时使用 “￥”
				break;
			default:
				money = `${money}`; // 默认无修饰符
				break;
		}
		return money;
	},
	// 将数字转成中文
	convertCurrency(currencyDigits) {
		// Constants:

		let MAXIMUM_NUMBER = 99999999999.99;
		// Predefine the radix characters and currency symbols for output:

		let CN_ZERO = "零";
		let CN_ONE = "壹";
		let CN_TWO = "贰";
		let CN_THREE = "叁";
		let CN_FOUR = "肆";
		let CN_FIVE = "伍";
		let CN_SIX = "陆";
		let CN_SEVEN = "柒";
		let CN_EIGHT = "捌";
		let CN_NINE = "玖";
		let CN_TEN = "拾";
		let CN_HUNDRED = "佰";
		let CN_THOUSAND = "仟";
		let CN_TEN_THOUSAND = "万";
		let CN_HUNDRED_MILLION = "亿";
		let CN_SYMBOL = "人民币";
		let CN_DOLLAR = "元";
		let CN_TEN_CENT = "角";
		let CN_CENT = "分";
		let CN_INTEGER = "整";

		// Variables:

		let integral; // Represent integral part of digit number.

		let decimal; // Represent decimal part of digit number.

		let outputCharacters; // The output result.

		let parts;
		let digits,
			radices,
			bigRadices,
			decimals;
		let zeroCount;
		let i,
			p,
			d;
		let quotient,
			modulus;

		// Validate input string:

		currencyDigits = currencyDigits.toString();
		if (currencyDigits == "") {
			return "暂无";
		}
		if (currencyDigits.match(/[^,.\d]/) != null) {
			return "暂无";
		}
		if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
			return "暂无";
		}

		// Normalize the format of input digits:

		currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.

		currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.

		// Assert the number is not greater than the maximum number.

		if (Number(currencyDigits) > MAXIMUM_NUMBER) {
			return "金额不能大于1000亿";
		}

		// Process the coversion from currency digits to characters: Separate integral
		// and decimal parts before processing coversion:

		parts = currencyDigits.split(".");
		if (parts.length > 1) {
			integral = parts[0];
			decimal = parts[1];
			// Cut down redundant decimal digits that are after the second.

			decimal = decimal.substr(0, 2);
		} else {
			integral = parts[0];
			decimal = "";
		}
		// Prepare the characters corresponding to the digits:

		digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
		radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
		bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
		decimals = new Array(CN_TEN_CENT, CN_CENT);
		// Start processing:

		outputCharacters = "";
		// Process integral part if it is larger than 0:

		if (Number(integral) > 0) {
			zeroCount = 0;
			for (i = 0; i < integral.length; i++) {
				p = integral.length - i - 1;
				d = integral.substr(i, 1);
				quotient = p / 4;
				modulus = p % 4;
				if (d == "0") {
					zeroCount++;
				} else {
					if (zeroCount > 0) {
						outputCharacters += digits[0];
					}
					zeroCount = 0;
					outputCharacters += digits[Number(d)] + radices[modulus];
				}
				if (modulus == 0 && zeroCount < 4) {
					outputCharacters += bigRadices[quotient];
				}
			}
			outputCharacters += CN_DOLLAR;
		}
		// Process decimal part if there is:

		if (decimal != "") {
			for (i = 0; i < decimal.length; i++) {
				d = decimal.substr(i, 1);
				if (d != "0") {
					outputCharacters += digits[Number(d)] + decimals[i];
				}
			}
		}
		// Confirm and return the final output string:

		if (outputCharacters == "") {
			outputCharacters = CN_ZERO + CN_DOLLAR;
		}
		if (decimal == "") {
			outputCharacters += CN_INTEGER;
		}
		outputCharacters = CN_SYMBOL + outputCharacters;
		return outputCharacters;
	},

	// 上传图片
	uploadImg(file){
		message.loading('图片上传中', 10);
		return new Promise((resolve, reject)=>{
			Service.uploadFile(file).then((res)=>{
				message.destroy()
				if (res.rspCode === '0000000000') {
                    resolve(res.body);
                }
                else {
					reject('图片上传失败');
                    message.error(res.message || '图片更新失败', 3);
                }
			}).catch(()=>{
				reject('图片上传失败');
			});
		});	
	}
}