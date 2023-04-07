import request from '@/utils/request'

// 查询kpi考核项申诉列表
export function listKpiAppeal(query) {
  return request({
    url: '/business/kpiAppeal/list',
    method: 'get',
    params: query
  })
}

// 查询kpi考核项申诉详细
export function getKpiAppeal(appealId) {
  return request({
    url: '/business/kpiAppeal/' + appealId,
    method: 'get'
  })
}

// 新增kpi考核项申诉
export function addKpiAppeal(data) {
  return request({
    url: '/business/kpiAppeal',
    method: 'post',
    data: data
  })
}

// 修改kpi考核项申诉
export function updateKpiAppeal(data) {
  return request({
    url: '/business/kpiAppeal',
    method: 'put',
    data: data
  })
}
// 驳回kpi考核项申诉
export function rejectKpiAppeal(data) {
  return request({
    url: '/business/kpiAppeal/reject',
    method: 'put',
    data: data
  })
}

// kpi考核项申诉通过
export function adoptKpiAppeal(data) {
  return request({
    url: '/business/kpiAppeal/adopt',
    method: 'put',
    data: data
  })
}

// 删除kpi考核项申诉
export function delKpiAppeal(appealId) {
  return request({
    url: '/business/kpiAppeal/' + appealId,
    method: 'delete'
  })
}

// 导出kpi考核项申诉
export function exportKpiAppeal(query) {
  return request({
    url: '/business/kpiAppeal/export',
    method: 'get',
    params: query
  })
}
