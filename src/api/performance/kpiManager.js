import request from '@/utils/request'

// 查询kpi考核管理列表
export function listKpiManager(query) {
  return request({
    url: '/business/kpiManager/list',
    method: 'get',
    params: query
  })
}

// 查询kpi考核管理详细
export function getKpiManager(kpimanagerId) {
  return request({
    url: '/business/kpiManager/' + kpimanagerId,
    method: 'get'
  })
}

// 新增kpi考核管理
export function addKpiManager(data) {
  return request({
    url: '/business/kpiManager',
    method: 'post',
    data: data
  })
}

// 修改kpi考核管理
export function updateKpiManager(data) {
  return request({
    url: '/business/kpiManager',
    method: 'put',
    data: data
  })
}

// 删除kpi考核管理
export function delKpiManager(kpimanagerId) {
  return request({
    url: '/business/kpiManager/' + kpimanagerId,
    method: 'delete'
  })
}

// 导出kpi考核管理
export function exportKpiManager(query) {
  return request({
    url: '/business/kpiManager/export',
    method: 'get',
    params: query
  })
}