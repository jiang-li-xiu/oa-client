/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:07:47
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-19 17:07:55
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增项目
export const addProject = (params) => postAction('/jeecg-supplier/prodProject', params)

// 编辑修改
export const editProject = (params) => putAction(`/jeecg-supplier/prodProject`, params)

// 详情
export const getDetail = (id) => getAction(`/jeecg-supplier/prodProject/${id}`)