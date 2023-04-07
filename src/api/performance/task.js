import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'

// 查询主动任务申请列表
export const listTask = (query) => getAction('/perf/taskApplyManager/list', query)

// 查询我的主动任务审核列表
export const myListTask = (query) => getAction('/perf/taskApplyManager/mylist', query)

// 查询主动任务申请详细
export const getTask = (applyTaskId) => getAction(`/perf/taskApplyManager/${applyTaskId}`)

// 新增主动任务申请
export const addTask = (data) => postAction('/perf/taskApplyManager', data)

// 修改主动任务申请
export const updateTask = (data) => putAction('/perf/taskApplyManager', data)

// 修改主动任务申请
export const rejectTask = (data) => putAction('/perf/taskApplyManager/reject', data) 

// 修改主动任务申请
export const adoptApplyTask = (data) => putAction('/perf/taskApplyManager/adopt', data)

// 删除主动任务申请
export const delTask = (applyTaskId) => deleteAction(`/perf/taskApplyManager/${applyTaskId}`)

// 导出主动任务申请
export const exportTask = (query) => postAction('/perf/taskApplyManager/export', query)
