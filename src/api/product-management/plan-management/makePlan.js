/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-01 17:38:59
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-02 08:59:43
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增方案
export const addPlan = (params) => postAction('/oa-base/plans', params)

// 详情
export const getDetail = (id) => getAction(`/oa-base/plans/${id}`)

// 获取产品列表
export const getProductList = (params) => getAction(`/oa-base/product/list`, params)

// 获取供应商列表
export const getSupplierList = (params) => getAction(`/sys/user/list/supplier?roleCode=gongying`, params)