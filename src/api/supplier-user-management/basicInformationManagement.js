/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-25 11:56:33
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-03 11:50:13
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 编辑
export const editBasicInfo = (params) => putAction('/oa-base/supplier', params)

// 详情
// export const getDetail = (id) => getAction(`/oa-base/supplier/${id}`)
export const getDetail = (params) => getAction(`/jeecg-supplier/prodSupplier/queryById`, params)

// 审批的详情
export const getApprovalDetail = (params) => getAction(`/prodSupplier/queryById2`, params)

// 修改账号基础信息（保存按钮）
export const saveBasicInfo = (params) => putAction(`/jeecg-supplier/prodSupplierDetail/save`, params)

// 修改账号基础信息（提交按钮）
export const submitBasicInfo = (params) => putAction(`/jeecg-supplier/prodSupplierDetail/submit`, params)

// 信息更新历史记录
export const getSupplierHistory = (params) => getAction(`/jeecg-supplier/prodSupplierDetailHistory/list`, params)

// 信息提交审批记录（审批记录）
export const geteDetailAudit = (params) => getAction(`/jeecg-supplier/detailAudit/list`, params)