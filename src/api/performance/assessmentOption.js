import request from '@/utils/request'

// 查询考核项列表
export function listAssessmentOptions(query) {
  return request({
    url: '/business/assessmentOption/list',
    method: 'get',
    params: query
  })
}

// 查询考核项列表
export function allListAssessmentOptions(query) {
  return request({
    url: '/business/kpiCheckNape/alllist',
    method: 'get',
    params: query
  })
}

// 查询考核项初评纪录列表
export function firstRecordListAssessmentOptions(query) {
  return request({
    url: '/business/kpiCheckNape/firstRecordList',
    method: 'get',
    params: query
  })
}

// 查询考核项初评列表
export function firstListAssessmentOptions(query) {
  return request({
    url: '/business/kpiCheckNape/firstList',
    method: 'get',
    params: query
  })
}

// 查询考核项终评纪录列表
export function finalRecordListAssessmentOptions(query) {
  return request({
    url: '/business/kpiCheckNape/finalRecordList',
    method: 'get',
    params: query
  })
}


// 查询考核项终评列表
export function finalListAssessmentOptions(query) {
  return request({
    url: '/business/kpiCheckNape/finallist',
    method: 'get',
    params: query
  })
}
// 查询所有申诉的考核项
export function allAppealAssessmentOptionsList(query) {
  return request({
    url: '/business/kpiCheckNape/allAppeal',
    method: 'get',
    params: query
  })
}

// 查询考核项详细
export function getAssessmentOption(assessmentOptionId) {
  return request({
    url: '/business/kpiCheckNape/info/' + assessmentOptionId,
    method: 'get'
  })
}

// 新增考核项
export function addAssessmentOption(data) {
  return request({
    url: '/business/assessmentOption',
    method: 'post',
    data: data
  })
}

// 修改考核项
export function updateAssessmentOption(data) {
  return request({
    url: '/business/assessmentOption',
    method: 'put',
    data: data
  })
}

// 发回初评
export function assessmentOptionSendPreliminarys(data) {
  return request({
    url: '/business/kpiCheckNape/send-preliminary ',
    method: 'put',
    data: data
  })
}

// 初评
export function firstCommentAssessmentOption(data) {
  return request({
    url: '/business/kpiCheckNape/firstComment',
    method: 'put',
    data: data
  })
}

// 终评
export function finalCommentAssessmentOption(data) {
  return request({
    url: '/business/kpiCheckNape/finalComment',
    method: 'put',
    data: data
  })
}
// 跳过初评
export function skipFirstOption(assessmentOptionId) {
  return request({
    url: '/business/kpiCheckNape/skipFirst/' + assessmentOptionId,
    method: 'put'
  })
}

// 删除考核项
export function delAssessmentOption(assessmentOptionId) {
  return request({
    url: '/business/kpiCheckNape/' + assessmentOptionId,
    method: 'delete'
  })
}

// 导出考核项
export function exportAssessmentOption(query) {
  return request({
    url: '/business/kpiCheckNape/export',
    method: 'get',
    params: query
  })
}
