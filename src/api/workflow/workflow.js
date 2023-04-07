import { getAction, httpAction, deleteAction } from '@/api/manage'

// 草稿保存
const saveDraft = (params, method) => httpAction('/workflow/actUsDraft/draft', params, 'post')

// 获取草稿数量
const getDraftTotal = (params) => getAction(`/workflow/actUsDraft/total`, params)


// 获取草稿列表
const getDraftList = (params) => getAction(`/workflow/actUsDraft/list`, params)

// 删除已使用的草稿
const deleteDraft = (params) => deleteAction(`/workflow/actUsDraft/delete`, params)

export {
    saveDraft,
    getDraftTotal,
    getDraftList,
    deleteDraft
}