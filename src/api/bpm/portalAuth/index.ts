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

export const mockLogin = (data: { userId: string; password: string }) => {
  return request.post<BpmPortalMockLoginVO>({
    url: '/bpm/portal-auth/login',
    data,
    headers: { isEncrypt: false }
  })
}

export const getCurrentUser = () => request.get<BpmPortalUserVO>({ url: '/bpm/portal-auth/me' })
