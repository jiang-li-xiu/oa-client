/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-11-23 14:31:15
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-25 14:12:26
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 客户联系人
export const getCustomLiaison = (customId) => getAction(`/scrm/crmCustomLiaison/list`, customId)

//新增
export const addQuotation = (params) => postAction(`/prodQuoteApply`, params)

// 编辑
export const editQuotation = (params) => putAction(`/prodQuoteApply`, params)

// 详情
export const getDetail = (id) => getAction(`/prodQuoteApply/${id}`)

// 新增审批
export const addApprove = (params) => postAction(`/prodQuoteApplyApprove/add/approve`, params)

// 编辑审批
export const editApprove = (params) => postAction(`/prodQuoteApplyApprove/edit/approve`, params)

// 详情审批
export const detailApprove = (params) => postAction(`/prodQuoteApplyApprove/approve`, params)

// 审批不通过
export const notPass = (params) => postAction(`/prodQuoteApplyApprove/not/pass`, params)

// 通过
export const pass = (params) => postAction(`/prodQuoteApplyApprove/pass`, params)

// 回退
export const fallback = (params) => postAction(`/prodQuoteApplyApprove/fallback`, params)