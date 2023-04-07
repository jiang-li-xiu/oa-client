import request from '@/utils/request'

// 查询gs任务评价列表
export function listComment(query) {
  return request({
    url: '/business/comment/list',
    method: 'get',
    params: query
  })
}

// 查询gs任务评价详细
export function getComment(commentId) {
  return request({
    url: '/business/comment/' + commentId,
    method: 'get'
  })
}

// 新增gs任务评价
export function addComment(data) {
  return request({
    url: '/business/comment',
    method: 'post',
    data: data
  })
}

// 修改gs任务评价
export function updateComment(data) {
  return request({
    url: '/business/comment',
    method: 'put',
    data: data
  })
}

// 删除gs任务评价
export function delComment(commentId) {
  return request({
    url: '/business/comment/' + commentId,
    method: 'delete'
  })
}

// 导出gs任务评价
export function exportComment(query) {
  return request({
    url: '/business/comment/export',
    method: 'get',
    params: query
  })
}