/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-11-28 17:28:19
 * @LastEditors: JLX
 * @LastEditTime: 2023-01-05 10:09:12
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 获取合同列表
// export const getContractList = (params) => getAction(`/jeecg-supplier/prodContract/list`, params)
export const getContractList = (params) => getAction(`/ctt/ContractLedger/list`, params)

// 批量添加
export const addReceivable = (params) => postAction(`/prodReceivable`, params)

// 批量应收
export const addReceivablebatch = (params) => postAction(`/prodReceivable/get/batchInfo`, params)


// 编辑
export const editReceivable = (params) => putAction(`/prodReceivable`, params)

// 删除
export const deleteReceivable = (id) => deleteAction(`/prodReceivable/${id}`)

// 回款详情
export const getDetail = (id) => getAction(`/prodReceivable/${id}`)

// 获取部门列表树型
export const getDepartmentList = (params) => getAction(`/sys/sysDepart/queryTreeList`, params)

// 修改负责团队
export const putReceivable = (params) => putAction(`/prodReceivable/modify`, params)

// 应收款列表
export const getReceivableList = (contractId, customerId) => getAction(`/prodReceivable/list?contractId=${contractId}&customerId=${customerId}`)

// 开票历史列表
export const getInvoiceHistory = (items, params) => getAction(`/prodInvoice/list?items=*${items}*`, params)

// 发票详情
export const getInvoiceDetail = (id) => getAction(`/prodInvoice/${id}`)

// 回款单
export const getReturnList = (params) => getAction(`/prodReceivable/get/return/list`, params)