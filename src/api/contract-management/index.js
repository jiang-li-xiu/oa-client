/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-15 15:36:16
 * @LastEditors: JLX
 * @LastEditTime: 2023-01-05 10:09:03
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增合同
export const addContract = (params) => postAction('/jeecg-supplier/prodContract', params)

// 编辑修改
export const editContract = (params) => putAction(`/jeecg-supplier/prodContract`, params)

// 详情
// export const getDetail = (id) => getAction(`/jeecg-supplier/prodContract/${id}`)
export const getDetail = (id) => getAction(`/ctt/ContractLedger/${id}`) //优化后

// 归档
// export const postArchive = (params) => postAction(`/jeecg-supplier/prodContract/archive`, params)
export const postArchive = (id) => putAction(`/ctt/ContractLedger/entrepot/${id}`)

// 台账列表（主合同）
// export const getContractList = (params) => getAction(`/jeecg-supplier/prodContract/list`, params)
export const getContractList = (params) => getAction(`/ctt/ContractLedger/list/main`, params)

// 获取部门列表树型
export const getDepartmentList = (params) => getAction(`/sys/sysDepart/queryTreeList`, params)

// 项目信息列表
export const getProjectList = (params) => getAction(`/jeecg-supplier/prodProject/list`, params)