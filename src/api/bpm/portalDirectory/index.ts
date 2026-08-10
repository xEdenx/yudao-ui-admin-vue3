import {
  getAreaTree as getHeadlessAreaTree,
  getSimpleDirectory as getHeadlessSimpleDirectory,
  type BpmPortalDirectoryDepartmentVO,
  type BpmPortalDirectoryUserVO
} from '@/api/bpm/portalAuth'

export interface BpmDirectoryUserVO {
  id: string | number
  nickname: string
  avatar?: string
  deptId?: string | number
  deptName?: string
}

export interface BpmDirectoryDepartmentVO {
  id: string | number
  name: string
  parentId?: string | number
}

export interface BpmDirectoryVO {
  users: BpmDirectoryUserVO[]
  departments: BpmDirectoryDepartmentVO[]
}

export const getSimpleDirectory = async (): Promise<BpmDirectoryVO> => {
  const directory = await getHeadlessSimpleDirectory()
  return {
    users: directory.users.map(convertHeadlessUser),
    departments: directory.departments.map(convertHeadlessDepartment)
  }
}

const convertHeadlessUser = (user: BpmPortalDirectoryUserVO): BpmDirectoryUserVO => ({
  id: user.id,
  nickname: user.displayName,
  avatar: user.avatar,
  deptId: user.departmentId,
  deptName: user.departmentName
})

const convertHeadlessDepartment = (
  department: BpmPortalDirectoryDepartmentVO
): BpmDirectoryDepartmentVO => ({
  id: department.id,
  name: department.name,
  parentId: department.parentId
})

export const getSimpleUserList = async (): Promise<BpmDirectoryUserVO[]> => {
  return (await getSimpleDirectory()).users
}

export const getSimpleDeptList = async (): Promise<BpmDirectoryDepartmentVO[]> => {
  return (await getSimpleDirectory()).departments
}

export const getAreaTree = () => getHeadlessAreaTree()
