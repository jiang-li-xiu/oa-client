/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-10-26 09:38:45
 * @LastEditors: JLX
 * @LastEditTime: 2022-10-27 16:05:25
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 添加付款管理
export const addPayment = (params) => postAction(`/prodPayment`, params)

// 编辑
export const editPayment = (params) => putAction(`/prodPayment`, params)

// 详情
export const getDetail = (id) => getAction(`/prodPayment/${id}`)

// 项目信息列表
export const getProjectList = (params) => getAction(`/jeecg-supplier/prodProject/list`, params)