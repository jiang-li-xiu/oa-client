/*
 * @Descripttion: 产品库
 * @Author: JLX
 * @Date: 2022-09-08 14:13:41
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-13 17:09:39
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 下架
export const upProduct = (id) => putAction(`/jeecg-supplier/prodProductEntrepot/down/${id}`)

// 移除产品库
export const removingProduct = (id) => deleteAction(`/jeecg-supplier/prodProductEntrepot/${id}`)

// 供应商列表
export const getSupplierList = (params) => getAction(`/jeecg-supplier/prodSupplier/list`, params)