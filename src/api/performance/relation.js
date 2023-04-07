import request from '@/utils/request'

// 查询GS任务验收人关联列表
export function listRelation(query) {
  return request({
    url: '/business/relation/list',
    method: 'get',
    params: query
  })
}

// 根据GS任务列表查询验收人列表
export function listRelationByTaskId(taskId) {
  return request({
    url: '/business/relation/list/taskId/' + taskId,
    method: 'get',
  })
}

// 查询GS任务验收人关联详细
export function getRelation(relationId) {
  return request({
    url: '/business/relation/' + relationId,
    method: 'get'
  })
}

// 新增GS任务验收人关联
export function addRelation(data) {
  return request({
    url: '/business/relation',
    method: 'post',
    data: data
  })
}

// 修改GS任务验收人关联
export function updateRelation(data) {
  return request({
    url: '/business/relation',
    method: 'put',
    data: data
  })
}

// 删除GS任务验收人关联
export function delRelation(relationId) {
  return request({
    url: '/business/relation/' + relationId,
    method: 'delete'
  })
}

// 导出GS任务验收人关联
export function exportRelation(query) {
  return request({
    url: '/business/relation/export',
    method: 'get',
    params: query
  })
}
