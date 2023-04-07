import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'

// 查询GS任务信息列表
export function listTaskManager(query) {
  return request({
    url: '/business/taskManager/list',
    method: 'get',
    params: query
  })
}

// 查询我的GS任务列表
export function myListTaskManager(query) {
  return request({
    url: '/business/taskManager/myList',
    method: 'get',
    params: query
  })
}

// 查询我的GS任务列表
export function myCheckListTaskManager(query) {
  return request({
    url: '/business/taskManager/myCheckList',
    method: 'get',
    params: query
  })
}

// 我下达的任务
export const myAssignListTaskManager = (query) => getAction('/perf/taskManager/myAssignTask' ,query)

// 我的周期任务
export const myCycleListTaskManager = (query)  => getAction('/perf/taskManager/myCycleTask' ,query)


// 修改周期任务状态
export function updateCycleTaskStatus(data) {
  return request({
    url: '/business/taskManager/update/status',
    method: 'put',
    data: data
  })
}
// 查询GS任务信息详细
export function getTaskManager(taskId) {
  return request({
    url: '/business/taskManager/' + taskId,
    method: 'get'
  })
}

// 新增GS任务信息
export function addTaskManager(data) {
  return request({
    url: '/business/taskManager',
    method: 'post',
    data: data
  })
}
// 新增GS周期任务
export function addCycleTaskManager(data) {
  return request({
    url: '/business/taskManager/cycle',
    method: 'post',
    data: data
  })
}
// 存为草稿
export function addDraftTaskManager(data) {
  return request({
    url: '/business/taskManager/addDraft',
    method: 'post',
    data: data
  })
}

// 下达GS任务
export function assignTaskManager(data) {
  return request({
    url: '/business/taskManager/assign',
    method: 'post',
    data: data
  })
}

// 变更GS任务
export function alterationTaskManager(data) {
  return request({
    url: '/business/taskManager/alteration',
    method: 'put',
    data: data
  })
}
// 变更GS周期任务
export function editCycleTaskManager(data) {
  return request({
    url: '/business/taskManager/editCycle',
    method: 'put',
    data: data
  })
}
// 修改GS任务信息
export function updateTaskManager(data) {
  return request({
    url: '/business/taskManager',
    method: 'put',
    data: data
  })
}

// 提交Gs任务
export function commitTaskManager(data) {
  return request({
    url: '/business/taskManager/commit',
    method: 'put',
    data: data
  })
}

// 删除GS任务信息
export function delTaskManager(taskIds) {
  return request({
    url: '/business/taskManager/' + taskIds,
    method: 'delete'
  })
}

// 撤销GS任务信息
export function undoTaskManager(taskIds) {
  return request({
    url: '/business/taskManager/undo/' + taskIds,
    method: 'put'
  })
}

// 复制GS任务信息
export function copyTaskManager(taskId) {
  return request({
    url: '/business/taskManager/copy/' + taskId,
    method: 'get'
  })
}

// 导出GS任务信息
export function exportTaskManager(query) {
  return request({
    url: '/business/taskManager/export',
    method: 'get',
    params: query
  })
}

// 导出GS任务信息
export function exportCycleTaskManager(query) {
  return request({
    url: '/business/taskManager/export/cycle',
    method: 'get',
    params: query
  })
}