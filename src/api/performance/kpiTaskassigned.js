import request from '@/utils/request'

// 查询kpi任务下达列表
export function listKpiTaskassigned(query) {
  return request({
    url: '/business/kpiTaskassigned/list',
    method: 'get',
    params: query
  })
}

// 查询kpi考核管理列表
export function managerListKpiTaskassigned(query) {
  return request({
    url: '/business/kpiTaskassigned/managerList',
    method: 'get',
    params: query
  })
}

// 查询kpi任务下达详细
export function getKpiTaskassigned(kpiTaskassignedId) {
  return request({
    url: '/business/kpiTaskassigned/' + kpiTaskassignedId,
    method: 'get'
  })
}

// 新增kpi任务下达
export function addKpiTaskassigned(data) {
  return request({
    url: '/business/kpiTaskassigned',
    method: 'post',
    data: data
  })
}

// 修改kpi任务下达
export function updateKpiTaskassigned(data) {
  return request({
    url: '/business/kpiTaskassigned',
    method: 'put',
    data: data
  })
}

// 删除kpi任务下达
export function delKpiTaskassigned(kpiTaskassignedId) {
  return request({
    url: '/business/kpiTaskassigned/' + kpiTaskassignedId,
    method: 'delete'
  })
}

// 逻辑删除kpi字典
export function logicDelKpiTaskassigned(kpiTaskassignedId) {
  return request({
    url: '/business/kpiTaskassigned/logicDelKpiTaskassigned/' + kpiTaskassignedId,
    method: 'delete'
  })
}

// 导出kpi任务下达
export function exportKpiTaskassigned(query) {
  return request({
    url: '/business/kpiTaskassigned/export',
    method: 'get',
    params: query
  })
}
