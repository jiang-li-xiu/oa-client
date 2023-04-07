import request from '@/utils/request'

// 查询题库列表
export function listQuestionStore(query) {
  return request({
    url: '/business/questionStore/list',
    method: 'get',
    params: query
  })
}

// 查询题库详细
export function getQuestionStore(qId) {
  return request({
    url: '/business/questionStore/' + qId,
    method: 'get'
  })
}

// 新增题库
export function addQuestionStore(data) {
  return request({
    url: '/business/questionStore',
    method: 'post',
    data: data
  })
}

// 修改题库
export function updateQuestionStore(data) {
  return request({
    url: '/business/questionStore',
    method: 'put',
    data: data
  })
}

// 删除题库
export function delQuestionStore(qId) {
  return request({
    url: '/business/questionStore/' + qId,
    method: 'delete'
  })
}

// 导出题库
export function exportQuestionStore(query) {
  return request({
    url: '/business/questionStore/export',
    method: 'get',
    params: query
  })
}