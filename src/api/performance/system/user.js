import { postAction, putAction, getAction, deleteAction, deletePathAction } from '@/api/manage'
import { praseStrEmpty } from "@/utils/performance/ruoyi";

// 查询用户列表，替换为@/api/api 的 getUserList
export const listUser = (query) => getAction('/system/user/list', query)

// 查询用户列表
export const listByNames = (userNames) => getAction(`/system/user/listByNames/${userNames}`)

// 查询用户详细
export const getUser = (userId)  => getAction(`/system/user/${praseStrEmpty(userId)}`)

// 查询用户详细
export const getUserInfoByUserName = (userName) => getAction(`/system/user/getUserInfoByUserName?userName=${userName}`)

// WELINK注册用户
export const registerUser = (data) => postAction('/welinkAPI/register', { weCode:data }) 

// 新增用户
export const addUser = (data) => postAction('/system/user', data) 

// 修改用户
export const updateUser = (data) => putAction('/system/user', data)

// 删除用户
export const delUser = (userId) => deleteAction(`/system/user/${userId}`)

// 导出用户
export const exportUser = (query) => getAction('/system/user/export', query)

// 用户密码重置
export const resetUserPwd = (userId, password) => putAction('/system/user/resetPwd', {userId, password})

// 用户状态修改
export const changeUserStatus = (userId, status)  => putAction('/system/user/changeStatus', {userId, status}) 

// 查询用户个人信息
export const getUserProfile = () => getAction('/system/user/profile')

// 修改用户个人信息
export const updateUserProfile = (data) => putAction('/system/user/profile', data)

// 用户密码重置
export const updateUserPwd = (oldPassword, newPassword) => postAction('/system/user/profile/updatePwd', { oldPassword, newPassword})

// 用户头像上传
export const uploadAvatar = (data) => postAction('/system/user/profile/avatar', data)

// 下载用户导入模板
export const importTemplate = () => getAction('/system/user/importTemplate')


// 用户同步
export const syncUser = () => getAction('/welinkAPI/sync')
