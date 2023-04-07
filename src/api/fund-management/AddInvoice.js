/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-12-02 15:46:29
 * @LastEditors: JLX
 * @LastEditTime: 2022-12-02 15:46:41
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 添加合同
export const addInvoice = (params) => postAction(`/prodInvoice`, params)

// 详情
export const getDetail = (id) => postAction(`/prodInvoice/${id}`)