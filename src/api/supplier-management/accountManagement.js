/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-23 11:27:22
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-13 15:03:32
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'

// 新增
export const addAccount = (params) => postAction('/jeecg-supplier/prodSupplier/add', params)

// 编辑
export const editAccount = (params) => putAction('/jeecg-supplier/prodSupplier/edit', params)

// 详情
export const getDetail = (params) => getAction('/jeecg-supplier/prodSupplier/queryById', params)