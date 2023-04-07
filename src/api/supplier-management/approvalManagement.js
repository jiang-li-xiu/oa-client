/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-06 09:53:37
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-09 10:49:51
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'

// 审批账号
export const passProduct = (realname, approvalComment, id, approval) => putAction(`/jeecg-supplier/prodSupplierDetail/approval/${realname}`, approvalComment, id, approval)