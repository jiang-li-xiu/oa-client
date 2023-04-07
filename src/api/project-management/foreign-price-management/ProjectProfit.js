/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-21 09:37:55
 * @LastEditors: JLX
 * @LastEditTime: 2023-01-05 11:34:24
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增
export const addprodProfits = (params) => postAction('/jeecg-supplier/prodProfits', params)

// 编辑
export const editprodProfits = (params) => putAction('/jeecg-supplier/prodProfits', params)

// 详情
// export const getDetail = (id) => getAction(`/jeecg-supplier/prodProfits/${id}`)
export const getDetail = (id) => getAction(`/scrm/crmProject/${id}`)

// 报价单详情
export const getQuotationDetail = (id) => getAction(`/jeecg-supplier/prodQuote/${id}`)

// 采购单详情
export const getProcurementDetail = (id) => getAction(`/jeecg-supplier/prodPurchaseList/${id}`)

// 获取部门列表树型
export const getDepartmentList = (params) => getAction(`/sys/sysDepart/queryTreeList`, params)

// 项目信息列表
// export const getProjectList = (params) => getAction(`/jeecg-supplier/prodProject/list`, params)
export const getProjectList = (params) => getAction(`/scrm/crmProject/list`, params)

// 添加审批
// export const addApproval = (params) => postAction(`/jeecg-supplier/ProdProfitsApprove`, params)

// 新增审批
export const addApproval = (params, name) => postAction(`/ProdProfitsApprove/add/withProfits/${name}`, params)

// 编辑审批
export const editApproval = (params, ) => postAction(`/prodProfits/approve/edit`, params)

// 详情审批
export const detailApproval = (params, name) => postAction(`/ProdProfitsApprove/${name}`, params)

// 提交审批（优化后）
export const submitApproval = (params) => postAction(`/prodProfits/approve`, params) //（优化后）

// 审批通过
export const passProduct = (params) => postAction(`/jeecg-supplier/ProdProfitsApprove/pass`, params)

// 审批不通过
export const noPassProduct = (params) => postAction(`/jeecg-supplier/ProdProfitsApprove/not/pass`, params)

// 历史报价
export const getHistoryQuto = (params) => getAction(`/jeecg-supplier/prodProductQuoteHistory/list`, params)

// 审批流程列表
export const getProcessList = (params) => getAction(`/jeecg-supplier/prodApprovalProcess/list`, params)

// 导出报价单
export const getQuotationExcel = (id) => getAction(`/prodQuote/export/${id}`, )

// 回退审批
export const postApprovalBack = (params) => postAction(`/ProdProfitsApprove/fallback`, params)

// 方案库列表
const getLibrary = (params) => getAction(`/scheme/prodSchemeLibrary/list`, params)

// 保存
const saveProject = (params) => putAction(`/scrm/crmProject/edit2`, params)

// 编辑 利润表
const getEditProfitsDetail = (params) => getAction(`/prodProfitsProduct/list`, params)

// 删除
const deleteProfit = (id) => deleteAction(`/prodProfitsProduct/${id}`)

// 编辑利润表-保存
const editProfit = (params) => putAction(`/prodProfitsProduct`, params)

// 利润审批
const approvalProfit = (params) => postAction(`/prodProfits/approve`, params)

// 审批信息
const approvalInfo = (params) => getAction(`/scheme/prodSchemeLibrary/approve/record`, params)

// 报价单详情里的产品列表
const quoteInfoList = (params) => getAction(`/prod/quoteInfo/product/list`, params)
export {
    getLibrary,
    saveProject,
    getEditProfitsDetail,
    deleteProfit,
    editProfit,
    approvalProfit,
    approvalInfo,
    quoteInfoList
}