/*
 * @Author: Yelucc
 * @Date: 2021-03-23 10:04:20
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-03-23 16:55:50
 * @Description: 
 */
import request from '@/utils/request'

// 查询问卷记录列表
export function listQuestionsRecord(query) {
  return request({
    url: '/business/questionsRecord/list',
    method: 'get',
    params: query
  })
}

// 查询我的问卷记录列表
export function listMyQuestionsRecord(query) {
  return request({
    url: '/business/questionsRecord/mylist',
    method: 'get',
    params: query
  })
}

// 根据问卷ID查询问卷
export function getQuestionsByTid(tid) {
  return request({
    url: '/business/questionsRecord/getQuestions/' + tid,
    method: 'get'
  })
}

// 查询问卷记录详细
export function getQuestionsRecord(qsnId) {
  return request({
    url: '/business/questionsRecord/' + qsnId,
    method: 'get'
  })
}

// 新增问卷记录
export function addQuestionsRecord(data) {
  return request({
    url: '/business/questionsRecord',
    method: 'post',
    data: data
  })
}

// 修改问卷记录
export function updateQuestionsRecord(data) {
  return request({
    url: '/business/questionsRecord',
    method: 'put',
    data: data
  })
}

// 删除问卷记录
export function delQuestionsRecord(qsnId) {
  return request({
    url: '/business/questionsRecord/' + qsnId,
    method: 'delete'
  })
}

// 导出问卷记录
export function exportQuestionsRecord(query) {
  return request({
    url: '/business/questionsRecord/export',
    method: 'get',
    params: query
  })
}