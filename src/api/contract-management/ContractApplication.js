/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-12-28 14:22:06
 * @LastEditors: JLX
 * @LastEditTime: 2022-12-30 17:00:30
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增合同申请
export const addContractAppro = (params) => postAction('/ctt/ContractLedger', params)

// 新增-提交
// export const addContractSubmit = (params) => postAction('/ctt/ContractLedger/add/approve', params)

// 编辑-提交
// export const editContractSubmit = (params) => postAction('/ctt/ContractLedger/put/approve', params)

// 提交审批
export const contractSubmit = (params) => postAction('/ctt/ContractLedger/approve', params)

// 编辑
export const editContract = (params) => putAction('/ctt/ContractLedger', params)

// 详情
export const getDetail = (id) => getAction(`/ctt/ContractLedger/${id}`)

// 取消
export const cancel = (id) => postAction(`/ctt/ContractLedger/cancel/${id}`)