/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-31 14:08:40
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-31 16:00:09
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 编辑基础信息
export const editBasicInfo = (params) => putAction('/oa-base/construction', params)

// 详情
export const getDetail = (id) => getAction(`/oa-base/construction/${id}`)