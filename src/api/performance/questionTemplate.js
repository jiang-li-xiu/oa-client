import request from '@/utils/request'

// 查询问卷模板列表
export function listQuestionTemplate(query) {
  return request({
    url: '/business/questionTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询问卷模板详细
export function getQuestionTemplate(tId) {
  return request({
    url: '/business/questionTemplate/' + tId,
    method: 'get'
  })
}

// 新增问卷模板
export function addQuestionTemplate(data) {
  return request({
    url: '/business/questionTemplate',
    method: 'post',
    data: data
  })
}

// 修改问卷模板
export function updateQuestionTemplate(data) {
  return request({
    url: '/business/questionTemplate',
    method: 'put',
    data: data
  })
}

// 删除问卷模板
export function delQuestionTemplate(tId) {
  return request({
    url: '/business/questionTemplate/' + tId,
    method: 'delete'
  })
}

// 导出问卷模板
export function exportQuestionTemplate(query) {
  return request({
    url: '/business/questionTemplate/export',
    method: 'get',
    params: query
  })
}