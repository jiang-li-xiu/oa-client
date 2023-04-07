/*
 * @Author: Yelucc
 * @Date: 2021-04-20 16:48:50
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-05-08 10:17:47
 * @Description: 
 */
import request from '@/utils/request'

// 查询正常，近期，超期数量
export function gsTaskLimitTimeNum(query) {
    return request({
      url: '/home/tasktime',
      method: 'get',
      params: query
    })
  }

// 简易查询我的任务
export function selectMyGsTaskList(query) {
  return request({
    url: '/home/mytask',
    method: 'get',
    params: query
  })
}

// 简易查询我问卷
export function selectQuesNumber(query) {
  return request({
    url: '/home/myQues',
    method: 'get',
    params: query
  })
}

/**
 * 查询绩效合约配置
 * @param userName 查询绩效合约配置
 * @return 查询绩效合约配置
 */
export function selectMyKpiCotract(query) {
  return request({
    url: '/home/myKpiConf',
    method: 'get',
    params: query
  })
}

/**
 * 查询绩效合约配置
 * @param userName 查询绩效合约配置
 * @return 查询绩效合约配置
 */
 export function selectMyKpiNum(query) {
  return request({
    url: '/home/myKpiNum',
    method: 'get',
    params: query
  })
}

/**
 * 简易Gs以及Kpi的展示的条数信息
 * @return 简易Gs以及Kpi的展示的条数信息
 */
 export function selectMyGsAndKpi(query) {
  return request({
    url: '/home/gsAndKpi',
    method: 'get',
    params: query
  })
}