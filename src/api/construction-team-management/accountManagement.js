/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-08-31 09:14:27
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-31 16:04:19
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'

// 新增施工队账号
export const addAccount = (params) => postAction('/sys/user/add/basic', params)

// 编辑
export const editAccount = (params) => putAction('/sys/user/edit', params)