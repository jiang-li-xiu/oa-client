/*
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-11-08 11:57:51
 * @LastEditors: JLX
 * @LastEditTime: 2022-11-11 09:36:07
 */
import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
// 剔除属性为空的属性
import { filterObj } from '@/utils/util';

// 询价详情
export const getDetail = (id) => getAction(`/prodSchemeInquiry/${id}`)

// 添加询价
export const addInquiry = (params) => postAction(`/prodSchemeSupplierInquiry`, params)

// 一条询价的详情
export const getOneDetail = (id) => getAction(`/prodSchemeSupplierInquiry/${id}`)

// 撤回
export const putWithdraw = (id) => putAction(`/prodSchemeSupplierInquiry/fallback/${id}`)

// 方案询价-询价-结束
export const putInquiryEnd = (id) => putAction(`/prodSchemeSupplierInquiry/finish/${id}`)

// 方案询价-结束（列表）
export const putInquiryListEnd = (id) => putAction(`/prodSchemeInquiry/finish/${id}`)

// 报价信息
export const getQuotationInfo = (id, params) => getAction(`/prodSchemeSupplierInquiry/inquiry/info/${id}`, params)