/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-25 11:56:33
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-06 10:45:18
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 编辑
export const editBasicInfo = (params) => putAction('/oa-base/supplier', params)

// 详情
// export const getDetail = (id) => getAction(`/oa-base/supplier/${id}`)
export const getDetail = (params) => getAction(`/jeecg-supplier/prodSupplier/queryById`, params)