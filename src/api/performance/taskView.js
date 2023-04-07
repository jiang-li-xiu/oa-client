import request from '@/utils/request'

// 查询kpi字典列表
export function listTaskView(query) {
  return request({
    url: '/business/taskManager/taskViewList',
    method: 'get',
    params: query
  })
}

// 查询kpi字典详细
export function getTaskView(gdTaskId) {
  return request({
    url: '/business/taskManager/' + gdTaskId,
    method: 'get'
  })
}

// 导出kpi字典
export function exportTaskView(query) {
  return request({
    url: '/business/taskManager/export',
    method: 'get',
    params: query
  })
}
