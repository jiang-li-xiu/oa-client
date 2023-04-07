/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-09-19 17:41:25
 * @LastEditors: JLX
 * @LastEditTime: 2023-02-28 17:08:03
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 新增方案
export const addprodScheme = (params) => postAction('/prodScheme/scheme', params)

// 新增方案并选型
export const addProdAndScheme = (params) => postAction('/prodScheme/product', params)

//方案修改
export const EditprodScheme = (params) => putAction('/prodScheme/scheme', params)

// 详情
// export const getDetail = (id) => getAction(`/jeecg-supplier/prodScheme/${id}`)
// export const getDetail = (id) => getAction(`/prodScheme/${id}`)
export const getDetail = (id) => getAction(`/scrm/crmProject/${id}`)

// 获取部门列表树型
export const getDepartmentList = (params) => getAction(`/sys/sysDepart/queryTreeList`, params)

// 项目信息列表
export const getProjectList = (params) => getAction(`/jeecg-supplier/prodProject/list`, params)

// 详情审批
export const postDetailApproval = (params) => postAction(`/prodSchemeApprove/approve`, params)

// 新增审批
// export const postAddApproval = (params) => postAction(`/prodSchemeApprove/add/approve`, params)
export const postAddApproval = (params) => postAction(`/prodScheme/approve`, params) // 优化后

// 编辑审批
// export const postEditApproval = (params) => postAction(`/prodSchemeApprove/edit/approve`, params)
export const postEditApproval = (params) => postAction(`/prodScheme/edit/approve`, params) //优化后

// 审批通过
export const approvalPass = (params) => postAction(`/prodSchemeApprove/pass`, params)

// 审批不通过
export const approvalNoPass = (params) => postAction(`/prodSchemeApprove/not/pass`, params)

// 回退
export const approvalFallback = (params) => postAction(`/prodSchemeApprove/fallback`, params)

// 选型
export const selectionType = (params) => postAction(`/prodSchemeSupplierInquiry/select`, params)

// 提交审批（产品信息-新增）
export const productAddApproval = (params) => postAction(`/prodSchemeApprove/add/product/approve`, params)

// 提交审批（产品信息-编辑）
export const productEditApproval = (params) => postAction(`/prodSchemeApprove/edit/product/approve`, params)

//方案添加 
const addScheme = (params) => postAction(`/scheme/prodSchemeLibrary`, params)

// 方案编辑
const editScheme = (params) => putAction(`/scheme/prodSchemeLibrary`, params)

// 方案库列表
const getLibrary = (params) => getAction(`/scheme/prodSchemeLibrary/list`, params)

// 方案模板编辑
const editTemplateScheme = (params) => putAction(`/prod/prodSchemeTemplate`, params)


// 批量删除
const deleteLibrary = (params) => deletePathAction(`/scheme/prodSchemeLibrary/batch`, params)

// 当前行方案详情
const getDetailLibrary = (id) => getAction(`/scheme/prodSchemeLibrary/${id}`)

// 方案、选型保存
const saveProject = (params) => putAction(`/scrm/crmProject/edit2`, params)

// 提交审批
const submitLibraryApprove = (id) => postAction(`/scheme/prodSchemeLibrary/approve`, id)

// 审批信息
const approvalInfo = (params) => getAction(`/scheme/prodSchemeLibrary/approve/record`, params)

// 编辑利润表详情
const getProfitDetail = (params) => getAction(`/prodProfitsProduct/list`, params)

// 方案模板
const addSchemeTemplate = (params) => postAction(`/prod/prodSchemeTemplate`, params)

// 方案库导入
const importSchem = (params) => postAction(`/scheme/prodSchemeLibrary/import/scheme`, params)

// 方案模板导入
const importTemplateSchem = (params) => postAction(`/scheme/prodSchemeLibrary/import/template`, params)

// 方案模板详情
const getSchemeTmplateDetail = (id) => getAction(`/prod/prodSchemeTemplate/${id}`)


export {
    addScheme,
    editScheme,
    editTemplateScheme,
    getLibrary,
    deleteLibrary,
    getDetailLibrary,
    saveProject,
    submitLibraryApprove,
    approvalInfo,
    getProfitDetail,
    addSchemeTemplate,
    importSchem,
    importTemplateSchem,
    getSchemeTmplateDetail
}