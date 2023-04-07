import request from '@/utils/request'

// 查询GS个人任务信息列表
export function listGsPersonalTask(query) {
  return request({
    url: '/business/gsPersonalTask/list',
    method: 'get',
    params: query
  })
}

// 查询GS个人任务信息详细
export function getGsPersonalTask(taskId) {
  return request({
    url: '/business/gsPersonalTask/' + taskId,
    method: 'get'
  })
}

// 新增GS个人任务信息
export function addGsPersonalTask(data) {
  return request({
    url: '/business/gsPersonalTask',
    method: 'post',
    data: data
  })
}

// 修改GS个人任务信息
export function updateGsPersonalTask(data) {
  return request({
    url: '/business/gsPersonalTask',
    method: 'put',
    data: data
  })
}

// 删除GS个人任务信息
export function delGsPersonalTask(taskId) {
  return request({
    url: '/business/gsPersonalTask/' + taskId,
    method: 'delete'
  })
}

// 导出GS个人任务信息
export function exportGsPersonalTask(query) {
  return request({
    url: '/business/gsPersonalTask/export',
    method: 'get',
    params: query
  })
}