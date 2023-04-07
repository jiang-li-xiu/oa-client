/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-06 11:01:02
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-18 17:10:53
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增产品
export const addProduct = (params) => postAction('/jeecg-supplier/prodProduct', params)

// 编辑
export const editProdect = (params) => putAction(`/jeecg-supplier/prodProduct`, params)

// 删除
export const deleteProdect = (id) => deleteAction(`/prodProduct/batch/${id}`)

// 获取辅材列表
export const getProductAuxiliaryList = (id) => deleteAction(`/jeecg-supplier/prodProduct/list?${productType=2}/${id}`)

// 获取产品单价变更记录
export const getPriceList = (productId) => getAction(`/oa-base/product/record/list`, productId)

// 详情
export const getDetail = (id) => getAction(`/jeecg-supplier/prodProduct/${id}`)

// 产品库详情
export const getProductEntreDetail = (id) => getAction(`/jeecg-supplier/prodProductEntrepot/${id}`)

// 供应商列表
// export const getSupplierList = (params) => getAction(`/sys/user/list/supplier?roleCode=gongying`, params)
export const getSupplierList = (params) => getAction(`/jeecg-supplier/prodSupplier/list`, params)

// 获取所有供应商列表
export const getAllSupplierList = (params) => getAction(`/prodSupplier/list/all`, params)

// 维修联系人电话
export const getDetailInfo = (id) => getAction(`/oa-base/supplier/${id}`)

// 上架
export const putShelf = (id) => putAction(`/jeecg-supplier/prodProductEntrepot/up/${id}`)