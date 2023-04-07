import request from '@/utils/request'

// 查询附件信息列表
export function listFile(query) {
  return request({
    url: '/system/file/list',
    method: 'get',
    params: query
  })
}

// 查询附件信息详细
export function getFile(fileId) {
  return request({
    url: '/system/file/' + fileId,
    method: 'get'
  })
}

// 新增附件信息
export function addFile(data) {
  return request({
    url: '/system/file',
    method: 'post',
    data: data
  })
}

// 修改附件信息
export function updateFile(data) {
  return request({
    url: '/system/file',
    method: 'put',
    data: data
  })
}

// 删除附件信息
export function delFile(fileId) {
  return request({
    url: '/system/file/' + fileId,
    method: 'delete'
  })
}

// 导出附件信息
export function exportFile(query) {
  return request({
    url: '/system/file/export',
    method: 'get',
    params: query
  })
}

// 根据id串查询数据
export function getFileByIds(ids) {
  return request({
    url: '/system/file/ids/' + ids,
    method: 'get'
  })
}

//下载
export function fileDownload(filePath,finalName) {
  return request({
    url: '/system/file/download/resource?resource=' + filePath +'&finalName='+finalName,
    method: 'get'
  })
}

//下载
export function fileDownload2(filePath,finalName) {
  return request({
    url: '/common/download/resource?resource=' + filePath +'&finalName='+finalName,
    method: 'get'
  })
}
