import request from '@/utils/request'

// 查询用章申请列表
export function listApplication(query) {
  return request({
    url: '/business/application/list',
    method: 'get',
    params: query
  })
}

// 查询用章申请详细
export function getApplication(id) {
  return request({
    url: '/business/application/' + id,
    method: 'get'
  })
}

// 新增用章申请
export function addApplication(data) {
  return request({
    url: '/business/application',
    method: 'post',
    data: data
  })
}

// 修改用章申请
export function updateApplication(data) {
  return request({
    url: '/business/application',
    method: 'put',
    data: data
  })
}

// 删除用章申请
export function delApplication(id) {
  return request({
    url: '/business/application/' + id,
    method: 'delete'
  })
}

// 导出用章申请
export function exportApplication(query) {
  return request({
    url: '/business/application/export',
    method: 'get',
    params: query
  })
}