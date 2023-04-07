import request from '@/utils/request'

// 查询KPI考核配置总列表
export function listKpiCheckConfig(query) {
  return request({
    url: '/business/kpiCheckConfig/list',
    method: 'get',
    params: query
  })
}

// 查询KPI考核配置总详细
export function getKpiCheckConfig(assessmentConfigureId) {
  return request({
    url: '/business/kpiCheckConfig/' + assessmentConfigureId,
    method: 'get'
  })
}

// kPI考核详情（包含考核项）
export function getKpiCheckConfigDetails(id) {
  return request({
    url: `/business/kpiCheckConfig/details/nape/${id}`,
    method: 'get'
  })
}

// 查询未启动的KPI考核项
export function listKpiCheckConfigByUnStart(query) {
  return request({
    url: '/business/kpiCheckConfig/list/un-start',
    method: 'get',
    params: query
  })
}

// 查询已启动和结束的KPI考核项
export function listKpiCheckConfigByStartAndEnd(query) {
  return request({
    url: '/business/kpiCheckConfig/list/start-end',
    method: 'get',
    params: query
  })
}

// 新增KPI考核配置总
export function addKpiCheckConfig(data) {
  return request({
    url: '/business/kpiCheckConfig',
    method: 'post',
    data: data
  })
}

// 修改KPI考核配置总
export function updateKpiCheckConfig(data) {
  return request({
    url: '/business/kpiCheckConfig',
    method: 'put',
    data: data
  })
}

// 删除KPI考核配置
export function delKpiCheckConfig(assessmentConfigureId) {
  return request({
    url: '/business/kpiCheckConfig/' + assessmentConfigureId,
    method: 'delete'
  })
}

//逻辑删除kpi
export function logicDel(assessmentConfigureIds) {
  return request({
    url: '/business/kpiCheckConfig/logicDel/' + assessmentConfigureIds,
    method: 'put'
  })
}

//启动kpi
export  function kpiCheckConfigByStart(selectedList) {
  return request({
    url: `/business/kpiCheckConfig/start?selectedList=${selectedList}`,
    method: 'get'
  })
}

//结束kpi
export  function kpiCheckConfigByEnd(selectedList) {
  return request({
    url: `/business/kpiCheckConfig/end?selectedList=${selectedList}`,
    method: 'get'
  })
}

// 导出KPI考核配置总
export function exportKpiCheckConfig(query) {
  return request({
    url: '/business/kpiCheckConfig/export',
    method: 'get',
    params: query
  })
}
