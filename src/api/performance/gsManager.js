/*
 * @Author: Yelucc
 * @Date: 2021-03-01 15:32:02
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-03-01 17:52:23
 * @Description: 
 */
import request from '@/utils/request'

// 查询GS任务配置列表列表
export function listGsManager(query) {
  return request({
    url: '/business/gsManager/list',
    method: 'get',
    params: query
  })
}

// 查询GS任务配置列表详细
export function getGsManager(id) {
  return request({
    url: '/business/gsManager/' + id,
    method: 'get'
  })
}

// 新增GS任务配置列表
export function addGsManager(data) {
  return request({
    url: '/business/gsManager',
    method: 'post',
    data: data
  })
}

// 修改GS任务配置列表
export function updateGsManager(data) {
  return request({
    url: '/business/gsManager',
    method: 'PUT',
    data: data
  })
}

// 删除GS任务配置列表
export function delGsManager(id) {
  return request({
    url: '/business/gsManager/' + id,
    method: 'delete'
  })
}

// 导出GS任务配置列表
export function exportGsManager(query) {
  return request({
    url: '/business/gsManager/export',
    method: 'get',
    params: query
  })
}