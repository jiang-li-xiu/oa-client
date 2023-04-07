/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-25 14:16:21
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-07 11:20:55
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增产品
export const addProduct = (params) => postAction('/oa-base/product', params)

// 编辑
export const editProdect = (params) => putAction(`/oa-base/product`, params)

// 删除
export const deleteProdect = (id) => deleteAction(`/jeecg-supplier/prodProduct/${id}`)

// 获取产品单价变更记录
export const getPriceList = (productId) => getAction(`/oa-base/product/record/list`, productId)

// 详情
export const getDetail = (id) => getAction(`/oa-base/product/${id}`)

// 供应商列表
export const getSupplierList = (params) => getAction(`/sys/user/list/supplier?roleCode=gongying`, params)

// 维修联系人电话
export const getDetailInfo = (id) => getAction(`/oa-base/supplier/${id}`)