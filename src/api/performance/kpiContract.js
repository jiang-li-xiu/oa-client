import request from '@/utils/request'

// 查询kpi绩效合约配置列表
export function listKpiContract(query) {
  return request({
    url: '/business/kpiContract/list',
    method: 'get',
    params: query
  })
}

// 查询kpi绩效合约配置列表
export function listKpiContractAndUserInfo(query) {
  return request({
    url: '/business/kpiContract/listKpiContractAndUserInfo',
    method: 'get',
    params: query
  })
}

// 查询kpi绩效合约配置详细
export function getKpiContract(kpicontractId) {
  return request({
    url: '/business/kpiContract/' + kpicontractId,
    method: 'get'
  })
}

// 根据用户账号查询kpi绩效合约配置详细
export function getKpiContractByUserName(userName) {
  return request({
    url: '/business/kpiContract/getKpiContractByUserName/' + userName,
    method: 'get'
  })
}

// 根据用户账号查询kpi绩效合约配置详细
export function getKpiContractAndUserInfo(kpiContractId) {
  return request({
    url: '/business/kpiContract/getKpiContractAndUserInfo?kpiContractId=' + kpiContractId,
    method: 'get'
  })
}

// 新增kpi绩效合约配置
export function addKpiContract(data) {
  return request({
    url: '/business/kpiContract',
    method: 'post',
    data: data
  })
}

// 修改kpi绩效合约配置
export function updateKpiContract(data) {
  return request({
    url: '/business/kpiContract',
    method: 'put',
    data: data
  })
}

// 删除kpi绩效合约配置
export function delKpiContract(kpicontractId) {
  return request({
    url: '/business/kpiContract/' + kpicontractId,
    method: 'delete'
  })
}

// 导出kpi绩效合约配置
export function exportKpiContract(query) {
  return request({
    url: '/business/kpiContract/export',
    method: 'get',
    params: query
  })
}
