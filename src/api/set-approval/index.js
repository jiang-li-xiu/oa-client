/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-10-09 11:22:02
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-23 14:13:58
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增流程审批
export const addApproval = (params) => postAction('/jeecg-supplier/prodApprovalProcess', params)

// 修改
export const editApproval = (params) => putAction('/jeecg-supplier/prodApprovalProcess', params)

// 详情
export const getDetail = (id) => getAction(`/jeecg-supplier/prodApprovalProcess/${id}`, )

// 获取部门列表树型
export const getDepartmentList = (params) => getAction(`/sys/sysDepart/queryTreeList`, params)

// 禁用
export const disableApproval = (id) => putAction(`/jeecg-supplier/prodApprovalProcess/ban/${id}`, )

// 启用
export const enAbleApproval = (id) => putAction(`/prodApprovalProcess/on/${id}`)