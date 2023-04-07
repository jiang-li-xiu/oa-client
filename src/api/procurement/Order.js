/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-10-17 17:31:54
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-18 11:21:18
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 一个采购列表下所有的产品
export const getDetail = (id) => getAction(`/jeecg-supplier/prodOrder/${id}`)

// 删除某一订单下的产品
export const deleteOrderProd = (params) => deleteAction(`/jeecg-supplier/prodOrder/del/product`, params)

// 编辑
export const editOrder = (params) => putAction(`/prodOrder`, params)

// 获取部门列表树型
export const getDepartmentList = (params) => getAction(`/sys/sysDepart/queryTreeList`, params)

// 设备序列号列表
export const getEqumentList = (params) => getAction(`/prodOrderSerialNumber/list`, params)

// 编辑序列号
export const editEqumentNum = (params) => putAction(`/prodOrderSerialNumber`, params)

// 收货
export const confirmGoods = (params) => postAction(`/prodOrder/receive`, params)

// 签收
export const confirmGoodsSign = (params) => postAction(`/prodOrder/sign`, params)

// 查询快递
export const getExpressInfo = (id) => getAction(`/prodOrder/express`, id)

// 添加售后
export const addAfterSale = (params) => postAction(`/prodOrderAfterSales`, params)

// 编辑售后
export const editAfterSale = (params) => putAction(`/prodOrderAfterSales`, params)

// 售后单详情
export const getDetailAfterSale = (id) => getAction(`/prodOrderAfterSales/${id}`)