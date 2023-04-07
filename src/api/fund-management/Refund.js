/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-11-30 17:19:33
 * @LastEditors: JLX
 * @LastEditTime: 2022-12-05 17:47:46
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 添加回款单
export const addReturnedMoney = (params) => postAction(`/prodReturnedMoney`, params)

// 详情
export const getDetail = (id) => getAction(`/prodReturnedMoney/${id}`)

// 应收款列表
export const getReceivableList = (contractId, customerId) => getAction(`/prodReceivable/return/list?contractId=${contractId}&customerId=${customerId}`)

// 回款单列表
// export const getReturnList = (contractId, customerId) => getAction(`/prodReturnedMoney/list?contractId=${contractId}&customerId=${customerId}`)

// 应收/回款列表
export const getReceivableReturnList = (contractId, customerId, type) => getAction(`/prodInvoice/invoice/list?contractId=${contractId}&customerId=${customerId}&type=${type}`)

// 修改负责团队
export const putReturnedMoney = (params) => putAction(`/prodReturnedMoney/modify`, params)