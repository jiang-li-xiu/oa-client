/*
 * @Author: Yelucc
 * @Date: 2021-03-24 09:14:28
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-03-24 09:19:28
 * @Description:
 */
import request from '@/utils/request'

// 查询KPI考核项配置列表
export function listAssessmentConfigure(query) {
  return request({
    url: '/business/kpiCheckConfig/list',
    method: 'get',
    params: query
  })
}

// 查询KPI考核项配置列表
export function managerList(query) {
  return request({
    url: '/business/kpiCheckConfig/managerList',
    method: 'get',
    params: query
  })
}

//考核配置列表（绩效管理员）
export function listAssessmentConfigureAdmin(query) {
  return request({
    url: '/business/kpiCheckConfig/adminList',
    method: 'get',
    params: query
  })
}

//催填
export function urgeFillAssessment(query) {
  return request({
    url: '/business/kpiCheckConfig/urgeFill',
    method: 'get',
    params: query
  })
}

//我的初评考核配置列表
export function listAssessmentConfigureFirst(query) {
  return request({
    url: '/business/kpiCheckConfig/firstList',
    method: 'get',
    params: query
  })
}

//我的初评纪录列表
export function listAssessmentConfigureFirstRecord(query) {
  return request({
    url: '/business/kpiCheckConfig/firstRecordList',
    method: 'get',
    params: query
  })
}


//我的终评纪录列表
export function listAssessmentConfigureFinalRecord(query) {
  return request({
    url: '/business/kpiCheckConfig/finalRecordList',
    method: 'get',
    params: query
  })
}

//我的终评考核配置列表
export function listAssessmentConfigureFinal(query) {
  return request({
    url: '/business/kpiCheckConfig/finalList',
    method: 'get',
    params: query
  })
}

//我的考核配置列表
export function listAssessmentConfigureMylist(query) {
  return request({
    url: '/business/kpiCheckConfig/my-list',
    method: 'get',
    params: query
  })
}

// 查询KPI考核项配置详细
export function getAssessmentConfigure(kpiCheckConfig) {
  return request({
    url: '/business/kpiCheckConfig/' + assessmentConfigureId,
    method: 'get'
  })
}

// 新增KPI考核项配置
export function addAssessmentConfigure(data) {
  return request({
    url: '/business/kpiCheckConfig',
    method: 'post',
    data: data
  })
}

// 修改KPI考核项配置
export function updateAssessmentConfigure(data) {
  return request({
    url: '/business/kpiCheckConfig',
    method: 'put',
    data: data
  })
}

// Kpi考核管理发起考核
export function initiateAssessment(data) {
  return request({
    url: '/business/kpiCheckConfig/initiateAssessment',
    method: 'put',
    data: data
  })
}

// 删除KPI考核项配置
export function delAssessmentConfigure(assessmentConfigureId) {
  return request({
    url: '/business/kpiCheckConfig/' + assessmentConfigureId,
    method: 'delete'
  })
}

// 导出KPI考核项配置
export function exportAssessmentConfigure(query) {
  return request({
    url: '/business/kpiCheckConfig/export',
    method: 'get',
    params: query
  })
}
