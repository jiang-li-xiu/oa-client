/*
 * @Author: Yelucc
 * @Date: 2021-03-11 17:49:17
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-03-12 11:09:22
 * @Description: 
 */
import request from '@/utils/request'

// 查询welink消息提醒记录列表
export function listMessagerecord(query) {
  return request({
    url: '/business/messagerecord/list',
    method: 'get',
    params: query
  })
}

// 查询welink消息提醒记录详细
export function getMessagerecord(msgId) {
  return request({
    url: '/business/messagerecord/' + msgId,
    method: 'get'
  })
}

// 新增welink消息提醒记录
export function addMessagerecord(data) {
  return request({
    url: '/business/messagerecord',
    method: 'post',
    data: data
  })
}

// 发布welink消息提醒
export function publishMessage(data) {
  return request({
    url: '/business//messagerecord/send',
    method: 'post',
    data: data
  })
}

// 修改welink消息提醒记录
export function updateMessagerecord(data) {
  return request({
    url: '/business/messagerecord',
    method: 'put',
    data: data
  })
}

// 删除welink消息提醒记录
export function delMessagerecord(msgId) {
  return request({
    url: '/business/messagerecord/' + msgId,
    method: 'delete'
  })
}

// 导出welink消息提醒记录
export function exportMessagerecord(query) {
  return request({
    url: '/business/messagerecord/export',
    method: 'get',
    params: query
  })
}