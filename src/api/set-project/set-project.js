/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-12-08 17:26:07
 * @LastEditors: JLX
 * @LastEditTime: 2022-12-26 10:18:14
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 报价申请-详情
export const getQuotationDetail = (projectId) => getAction(`/prodQuoteApply/project/${projectId}`)

// 报价新增（保存）
export const addQuotationSave = (params) => postAction(`/prodQuoteApply`, params)

// 报价-提交审批
export const addQuotationSubmit = (params) => postAction(`/prodQuoteApplyApprove/add/approve`, params)

// 方案详情
export const getPlanDetail = (id) => postAction(`/prodScheme/${id}`)

// 询价详情
export const getInquiryDetail = (code) => postAction(`/prodSchemeInquiry/schemeCode/${code}`)

// 询价列表
export const getInquiryList = (schemeCode, params) => getAction(`/prodSchemeSupplierInquiry/schemeCode/${schemeCode}`, params)

// 详情-采购列表
export const getPurchaseListDetail = (projectId) => getAction(`/prodPurchaseList/list?projectId=${projectId}`)

// 详情-利润列表
export const getProfitsListDetail = (projectId) => getAction(`/prodProfits/list?projectId=${projectId}`)

// 详情-方案列表
export const getSchemeListDetail = (projectId) => getAction(`/prodScheme/list?projectId=${projectId}`)

// 方案库列表
export const getLibrary = (params) => getAction(`/scheme/prodSchemeLibrary/list`, params)

// 提交审批
export const submitApproval = (params) => postAction(`/prodApprove/add`, params)

// 审批通过
export const approvalPass = (params) => postAction(`/prodApprove/pass`, params)

// 审批不通过
export const approvalNotPass = (params) => postAction(`/prodApprove/not/pass`, params)

// 流程信息
export const getApprovalInfo = (id) => getAction(`/scrm/crmProject/${id}`)