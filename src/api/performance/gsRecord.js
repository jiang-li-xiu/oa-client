import request from '@/utils/request'

// 查询GS完成情况列表
export function listGsRecord(query) {
  return request({
    url: '/business/gsRecord/list',
    method: 'get',
    params: query
  })
}

// 查询GS完成情况详细
export function getGsRecord(id) {
  return request({
    url: '/business/gsRecord/' + id,
    method: 'get'
  })
}

// 新增GS完成情况
export function addGsRecord(data) {
  return request({
    url: '/business/gsRecord',
    method: 'post',
    data: data
  })
}

// 修改GS完成情况
export function updateGsRecord(data) {
  return request({
    url: '/business/gsRecord',
    method: 'put',
    data: data
  })
}

// 删除GS完成情况
export function delGsRecord(id) {
  return request({
    url: '/business/gsRecord/' + id,
    method: 'delete'
  })
}

// 导出GS完成情况
export function exportGsRecord(query) {
  return request({
    url: '/business/gsRecord/export',
    method: 'get',
    params: query
  })
}