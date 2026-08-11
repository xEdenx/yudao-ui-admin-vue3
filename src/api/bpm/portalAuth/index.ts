import request from '@/config/axios'

export interface BpmPortalUserVO {
  id: string
  displayName: string
  avatar?: string
  departmentId?: string
  departmentName?: string
  roleCodes: string[]
}

export interface BpmPortalMockLoginVO {
  accessToken: string
  tenantId: number
  user: BpmPortalUserVO
}

export interface BpmPortalDictDataVO {
  dictType: string
  value: string | number | boolean
  label: string
  colorType?: string
  cssClass?: string
}

export interface BpmPortalDirectoryUserVO {
  id: string
  displayName: string
  avatar?: string
  departmentId?: string
  departmentName?: string
}

export interface BpmPortalDirectoryDepartmentVO {
  id: string
  name: string
  parentId?: string
}

export interface BpmPortalDirectoryVO {
  users: BpmPortalDirectoryUserVO[]
  departments: BpmPortalDirectoryDepartmentVO[]
}

export interface BpmPortalAreaVO {
  id: string
  name: string
  children?: BpmPortalAreaVO[]
}

export const mockLogin = (data: { userId: string; password: string }) => {
  return request.post<BpmPortalMockLoginVO>({
    url: '/bpm/portal-auth/login',
    data,
    headers: { isEncrypt: false, isToken: false }
  })
}

export const getCurrentUser = () => request.get<BpmPortalUserVO>({ url: '/bpm/portal-auth/me' })

export const getSimpleDictDataList = () =>
  request.get<BpmPortalDictDataVO[]>({ url: '/bpm/portal-config/dict-data/simple-list' })

/**
 * 建模器候选人策略目录。由 BPM 后端决定可配置的枚举项；前端不维护静态策略列表。
 */
export const getCandidateStrategyList = async () => {
  const dictionaryItems = await getSimpleDictDataList()
  return dictionaryItems.filter((item) => item.dictType === 'bpm_task_candidate_strategy')
}

export const getSimpleDirectory = () =>
  request.get<BpmPortalDirectoryVO>({ url: '/bpm/portal-directory/simple-list' })

export const getAreaTree = () =>
  request.get<BpmPortalAreaVO[]>({ url: '/bpm/portal-config/area-tree' })
