import request from '@/utils/request'

// 查询主动任务申请里程碑列表
export function listApplyMilestone(query) {
  return request({
    url: '/business/applyMilestone/list',
    method: 'get',
    params: query
  })
}

// 查询主动任务申请里程碑详细
export function getApplyMilestone(applyMilestoneId) {
  return request({
    url: '/business/applyMilestone/' + applyMilestoneId,
    method: 'get'
  })
}

// 新增主动任务申请里程碑
export function addApplyMilestone(data) {
  return request({
    url: '/business/applyMilestone',
    method: 'post',
    data: data
  })
}

// 修改主动任务申请里程碑
export function updateApplyMilestone(data) {
  return request({
    url: '/business/applyMilestone',
    method: 'put',
    data: data
  })
}

// 删除主动任务申请里程碑
export function delApplyMilestone(applyMilestoneId) {
  return request({
    url: '/business/applyMilestone/' + applyMilestoneId,
    method: 'delete'
  })
}

// 导出主动任务申请里程碑
export function exportApplyMilestone(query) {
  return request({
    url: '/business/applyMilestone/export',
    method: 'get',
    params: query
  })
}