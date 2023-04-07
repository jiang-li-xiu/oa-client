import request from '@/utils/request'

// 查询gs任务进度列表
export function listProgress(query) {
  return request({
    url: '/business/progress/list',
    method: 'get',
    params: query
  })
}

// 查询gs任务进度详细
export function getProgress(taskId) {
  return request({
    url: '/business/progress/' + taskId,
    method: 'get'
  })
}

// 新增gs任务进度
export function addProgress(data) {
  return request({
    url: '/business/progress',
    method: 'post',
    data: data
  })
}

// 修改gs任务进度
export function updateProgress(data) {
  return request({
    url: '/business/progress',
    method: 'put',
    data: data
  })
}

// 删除gs任务进度
export function delProgress(taskId) {
  return request({
    url: '/business/progress/' + taskId,
    method: 'delete'
  })
}

// 导出gs任务进度
export function exportProgress(query) {
  return request({
    url: '/business/progress/export',
    method: 'get',
    params: query
  })
}