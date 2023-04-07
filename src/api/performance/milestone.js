/*
 * @Author: Yelucc
 * @Date: 2021-03-27 10:01:10
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-03-27 10:33:56
 * @Description: 
 */
import request from '@/utils/request'

// 查询GS任务里程碑信息列表
export function listMilestone(query) {
  return request({
    url: '/business/milestone/list',
    method: 'get',
    params: query
  })
}

// 查询GS任务里程碑信息详细
export function getMilestone(milestoneId) {
  return request({
    url: '/business/milestone/' + milestoneId,
    method: 'get'
  })
}

// 新增GS任务里程碑信息
export function addMilestone(data) {
  return request({
    url: '/business/milestone',
    method: 'post',
    data: data
  })
}

// 修改GS任务里程碑信息
export function updateMilestone(data) {
  return request({
    url: '/business/milestone',
    method: 'put',
    data: data
  })
}
// 填报GS任务里程碑
export function reportmilestone(data) {
  return request({
    url: '/business/milestone/report',
    method: 'put',
    data: data
  })
}

// 删除GS任务里程碑信息
export function delMilestone(milestoneId) {
  return request({
    url: '/business/milestone/id/' + milestoneId,
    method: 'delete'
  })
}

// 删除GS任务里程碑信息
export function delsMilestone(milestoneIds) {
  return request({
    url: '/business/milestone/' + milestoneIds,
    method: 'delete'
  })
}

// 导出GS任务里程碑信息
export function exportMilestone(query) {
  return request({
    url: '/business/milestone/export',
    method: 'get',
    params: query
  })
}

// 根据taskId获取里程碑列表
export function listMilestoneByTaskId(taskId) {
  return request({
    url: '/business/milestone/list/taskId/' + taskId,
    method: 'get'
  })
}

// 校验里程碑是否已填写
export function checkFillInOfMilestone(milestoneId) {
  return request({
    url: '/business/milestone/check/fillIn/' + milestoneId,
    method: 'get'
  })
}
