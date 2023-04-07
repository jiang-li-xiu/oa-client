/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-12-26 17:01:55
 * @LastEditors: JLX
 * @LastEditTime: 2023-03-13 15:46:28
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 保存
export const addProcurement = (params) => postAction('/pcmProcurement/add', params)

// 保存提交审批
export const addAndSubmit = (params) => postAction('/pcmProcurement/add/approve', params)

// 编辑
export const editProcurement = (params) => putAction('/pcmProcurement/put', params)

// 编辑-提交
// export const editAndSubmit = (params) => postAction(`/pcmProcurement/put/approve`, params)

// 详情
export const getDetail = (id) => getAction(`/pcmProcurement/${id}`)

// 可关联采购申请列表
export const getProcurment = (params) => getAction(`/pcmProcurement/binding/first`, params)

// 查询关联的采购申请
export const getProcurmentApproList = (id) => getAction(`/pcmProcurement/correlation/${id}`)

// 查询关联采购申请的客户 项目
export const getPcmProcurement = (id) => getAction(`/pcmProcurement/correlation/${id}`)

// 取消
export const cancel = (id) => postAction(`/pcmProcurement/cancel/${id}`)