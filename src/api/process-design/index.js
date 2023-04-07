/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-05 10:00:15
 * @LastEditors: JLX
 * @LastEditTime: 2022-09-05 10:25:53
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 获取部门列表树型（包含人员）
export const getDepartmentList = (params) => getAction('/sys/sysDepart/queryTreeList', params)

// 角色列表（包含人员）
export const getRoleList = (params) => getAction('/sys/role/list/tree', params)