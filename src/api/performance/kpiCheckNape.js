import request from '@/utils/request'

// 查询考核项列表
export function listKpiCheckNape(query) {
  return request({
    url: '/business/kpiCheckNape/list',
    method: 'get',
    params: query
  })
}

// 查询考核项详细
export function listKpiCheckNapeByAssessmentConfigureId(assessmentConfigureId) {
  return request({
    url: '/business/kpiCheckNape/listKpiCheckNapeByAssessmentConfigureId?assessmentConfigureId='+assessmentConfigureId,
    method: 'get'
  })
}


// 查询考核项详细
export function getKpiCheckNape(assessmentOptionId) {
  return request({
    url: '/business/kpiCheckNape/' + assessmentOptionId,
    method: 'get'
  })
}

// 新增考核项
export function addKpiCheckNape(data) {
  return request({
    url: '/business/kpiCheckNape',
    method: 'post',
    data: data
  })
}

// 修改考核项
export function updateKpiCheckNape(data) {
  return request({
    url: '/business/kpiCheckNape',
    method: 'put',
    data: data
  })
}

// 删除考核项
export function delKpiCheckNape(assessmentOptionId) {
  return request({
    url: '/business/kpiCheckNape/' + assessmentOptionId,
    method: 'delete'
  })
}

// 导出考核项
export function exportKpiCheckNape(query) {
  return request({
    url: '/business/kpiCheckNape/export',
    method: 'get',
    params: query
  })
}
