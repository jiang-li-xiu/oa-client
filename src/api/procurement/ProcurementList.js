/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-10-11 09:08:01
 * @LastEditors: JLX
 * @LastEditTime: 2023-01-05 09:14:56
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 一个采购列表下所有的产品
export const getProcurements = (id) => getAction(`/jeecg-supplier/prodPurchaseList/products/${id}`)

// 采购列表详情
export const getDetail = (id) => getAction(`/jeecg-supplier/prodPurchaseList/${id}`)

// 生成采购单
export const postGenerateOrder = (params) => postAction(`/jeecg-supplier/prodPurchaseOrder`, params)

// 采购列表下的采购单
export const getPurchaseOrder = (params) => getAction(`/jeecg-supplier/prodPurchaseOrder/list`, params)

// 项目信息列表
// export const getProjectList = (params) => getAction(`/jeecg-supplier/prodProject/list`, params)
export const getProjectList = (params) => getAction(`/scrm/crmProject/list`, params)

// 获取部门列表树型
export const getDepartmentList = (params) => getAction(`/sys/sysDepart/queryTreeList`, params)

// 采购单的详情
export const getProcurementDetail = (id) => getAction(`/jeecg-supplier/prodPurchaseOrder/${id}`)

// 采购列表的详情
export const getProcurementListDetail = (id) => getAction(`jeecg-supplier/prodPurchaseList/${id}`)

// 采购审批
export const postProcurementApproval = (people, params) => postAction(`/jeecg-supplier/prodPurchaseApprove/approve/${people}`, params)

// 某一采购单审批历史
// export const getApprovalHistory = (id) => getAction(`/jeecg-supplier/prodPurchaseApproveHistory/list?prodPurchaseOrder=*${id}*`)
export const getApprovalHistory = (details) => getAction(`/prodPurchaseApprove/purchaseOrder/${details}`)

// 审批通过
export const approvalPass = (params) => postAction(`/jeecg-supplier/prodPurchaseApprove/pass`, params)

// 审批不通过
export const approvalNoPass = (params) => postAction(`/jeecg-supplier/prodPurchaseApprove/not/pass`, params)