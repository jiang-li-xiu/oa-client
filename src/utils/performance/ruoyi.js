
import { downFile } from '@/api/manage'
/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
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
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
	var search = params;
	search.params = {};
	if (null != dateRange && '' != dateRange) {
		if (typeof(propName) === "undefined") {
			search.params["beginTime"] = dateRange[0];
			search.params["endTime"] = dateRange[1];
		} else {
			search.params["begin" + propName] = dateRange[0];
			search.params["end" + propName] = dateRange[1];
		}
	}
	return search;
}

// 回显数据字典
export function selectDictLabel(data, value) {
  const actions = [];
  Object.keys(data).some((key) => {
		if (data[key].value === ('' + value)) {
			actions.push(data[key].label);
			return true;
		}
	})
	return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
	var actions = [];
	var currentSeparator = undefined === separator ? "," : separator;
	var temp = value.split(currentSeparator);
	Object.keys(value.split(currentSeparator)).some((val) => {
		Object.keys(datas).some((key) => {
			if (datas[key].dictValue == ('' + temp[val])) {
				actions.push(datas[key].dictLabel + currentSeparator);
			}
		})
	})
	return actions.join('').substring(0, actions.join('').length - 1);
}

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + false;
}

export function exportXls(url, param, fileName){
	if(!fileName || typeof fileName != "string"){
	  fileName = "导出文件"
	}
	fileName = fileName + "-" + new Date().getTime()
	downFile(url, param, 'post').then((data)=>{
	  if (!data) {
		this.$message.warning("文件下载失败")
		return
	  }
	  if (typeof window.navigator.msSaveBlob !== 'undefined') {
		window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName +'.xls')
	  }else{
		let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
		let link = document.createElement('a')
		link.style.display = 'none'
		link.href = url
		link.setAttribute('download', fileName +'.xls')
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link); //下载完成移除元素
		window.URL.revokeObjectURL(url); //释放掉blob对象
	  }
	})
  }

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData = cloneData.filter(father => {
		let branchArr = cloneData.filter(child => {
			//返回每一项的子级数组
			return father[id] === child[parentId]
		});
		branchArr.length > 0 ? father.children = branchArr : '';
		//返回第一层
		return father[parentId] === rootId;
	});
	return treeData !== '' ? treeData : data;
}

/**
 * 文件大小单位转换
 * @param fileSizeKb 文件大小
 * @returns {string}
 */
export function formatFileSize(fileSizeKb) {
  let fileSizeString = "";
  let wrongSize = "0B";
  if (fileSizeKb === 0) {
    return wrongSize;
  }
  if (fileSizeKb < 1024) {
    fileSizeString = fileSizeKb.toFixed(2) + "B";
  } else if (fileSizeKb < 1048576) {
    fileSizeString = (fileSizeKb / 1024).toFixed(2) + "KB";
  } else if (fileSizeKb < 1073741824) {
    fileSizeString = (fileSizeKb / 1048576).toFixed(2) + "MB";
  } else {
    fileSizeString = (fileSizeKb / 1073741824).toFixed(2) + "GB";
  }
  return fileSizeString;
}
