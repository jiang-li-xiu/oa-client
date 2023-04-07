import request from '@/utils/request'

// 查询kpi字典列表
export function listKpidict(query) {
  return request({
    url: '/business/kpidict/list',
    method: 'get',
    params: query
  })
}

// 查询kpi字典详细
export function getKpidict(kpidictId) {
  return request({
    url: '/business/kpidict/' + kpidictId,
    method: 'get',
    async: false
  })
}

// 新增kpi字典
export function addKpidict(data) {
  return request({
    url: '/business/kpidict',
    method: 'post',
    data: data
  })
}

// 修改kpi字典
export function updateKpidict(data) {
  return request({
    url: '/business/kpidict',
    method: 'put',
    data: data
  })
}

// 删除kpi字典
export function delKpidict(kpidictId) {
  return request({
    url: '/business/kpidict/' + kpidictId,
    method: 'delete'
  })
}

// 导出kpi字典
export function exportKpidict(query) {
  return request({
    url: '/business/kpidict/export',
    method: 'get',
    params: query
  })
}
