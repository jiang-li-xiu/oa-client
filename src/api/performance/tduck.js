/*
 * @Author: Yelucc
 * @Date: 2021-04-29 18:05:15
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-05-06 16:29:34
 * @Description: 
 */
import request from '@/utils/request'

// 
export function queryTemplateType(query) {
    return request({
        url: '/business/questionsRecord/project/template/type/list',
        method: 'get',
        params: query
    })
}

export function queryTemplatePage(query) {
    return request({
        url: '/business/questionsRecord/project/template/page',
        method: 'get',
        params: query
    })
}

export function createBlankTemplate(data) {
    return request({
        url: '/business/questionsRecord/project/create',
        method: 'post',
        data: data
    })
}

export function deleteProject(data) {
    return request({
        url: '/business/questionsRecord/project/delete',
        method: 'post',
        data: data
    })
}

export function stopProject(data) {
    return request({
        url: '/business/questionsRecord/project/stop',
        method: 'post',
        data: data
    })
}

export function queryProjectPage(query) {
    return request({
        url: '/business/questionsRecord/project/page',
        method: 'get',
        params: query
    })
}

export function createProjectByTemplate(data) {
    return request({
        url: '/business/questionsRecord/project/template/create',
        method: 'post',
        data: data
    })
}

export function restoreProject(data) {
    return request({
        url: '/business/questionsRecord/project/recycle/restore',
        method: 'post',
        data: data
    })
}


export function queryUserProjectSetting(query) {
    return request({
        url: '/business/questionsRecord/project/setting/' + query,
        method: 'get',
    })
}


export function saveUserProjectSetting(data) {
    return request({
        url: '/business/questionsRecord/project/setting/save',
        method: 'post',
        data: data
    })
}

export function queryProject(query) {
    return request({
        url: '/business/questionsRecord/project/user/' + query,
        method: 'get',
    })
}
export function queryProjectResult(query) {
    return request({
        url: '/business/questionsRecord/project/user/project/result/page',
        method: 'get',
        params: query
    })
}
export function exportProjectResult(query) {
    return request({
        url: '/business/questionsRecord/project/result/export',
        method: 'get',
        params: query
    })
}
export function queryProjectItems(query) {
    return request({
        url: '/business/questionsRecord/project/item/list',
        method: 'get',
        params: query
    })
}

export function saveUserTheme(data) {
    return request({
        url: '/business/questionsRecord/project/theme/save',
        method: 'post',
        data: data
    })
}
export function queryUserProjectTheme(query) {
    return request({
        url: '/business/questionsRecord/project/theme/' + query,
        method: 'get',
    })
}
export function queryProjectTheme(query) {
    return request({
        url: '/business/questionsRecord/project/theme/list',
        method: 'get',
        params: query
    })
}

export function submitProject(data) {
    return request({
        url: '/business/questionsRecord/project/result/create',
        method: 'post',
        data: data
    })
}

export function queryProjectByKey(query) {
    return request({
        url: '/business/questionsRecord/project/'+query,
        method: 'get',
    })
}

export function queryProjectMaxFormItemId(query) {
    return request({
        url: '/business/questionsRecord/project/item/max-form-id',
        method: 'get',
        params: query
    })
}
export function saveProjectInfo(data) {
    return request({
        url: '/business/questionsRecord/project/update',
        method: 'post',
        data: data
    })
}
export function deleteProjectItemInfo(data) {
    return request({
        url: '/business/questionsRecord/project/item/delete',
        method: 'post',
        data: data
    })
}
export function saveProjectItemInfo(data) {
    return request({
        url: '/business/questionsRecord/project/item/create',
        method: 'post',
        data: data
    })
}

export function onItemEnd(data) {
    return request({
        url: '/business/questionsRecord/project/item/sort',
        method: 'post',
        data: data
    })
}


export function publishProject(data) {
    return request({
        url: '/business/questionsRecord/project/publish',
        method: 'post',
        data: data
    })
}

export function stopPublishProject(data) {
    return request({
        url: '/business/questionsRecord/project/stop',
        method: 'post',
        data: data
    })
}