/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-08 17:11:47
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-08 17:13:55
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'

// 产品审批
export const passProduct = (approvalComment, id, approval) => putAction('/jeecg-supplier/prodProduct/pass ', approvalComment, id, approval)