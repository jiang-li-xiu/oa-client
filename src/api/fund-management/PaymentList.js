/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-12-30 09:57:36
 * @LastEditors: JLX
 * @LastEditTime: 2022-12-30 10:51:22
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增付款单
export const addPayment = (id, params) => putAction(`/prod/prodPayable/add/bill/${id}`, params)

// 修改付款单
export const editPayment = (params) => putAction(`/prod/prodPayable/update/bill`, params)

// 删除
export const deletePayment = (params) => putAction(`/prod/prodPayable/del/bill`, params)

// 新增发票
export const addInvoice = (id, params) => putAction(`/prod/prodPayable/add/invoice/${id}`, params)

// 修改发票
export const editInvoice = (params) => putAction(`/prod/prodPayable/update/invoice`, params)

// 删除发票
export const deleteInvoice = (params) => putAction(`/prod/prodPayable/del/invoice`, params)

// 详情
export const getDetail = (id) => getAction(`/prod/prodPayable/${id}`)