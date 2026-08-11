import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import * as BpmPortalAuthApi from '@/api/bpm/portalAuth'

const { wsCache } = useCache()

const BPM_MODEL_MANAGER_ROLE = 'ROLE_BPM_MODEL_MANAGER'
const HEADLESS_BPM_RUN_PERMISSIONS = [
  'bpm:process-instance:query',
  'bpm:task:query',
  'bpm:task:update'
]

interface UserVO {
  id: number
  avatar: string
  nickname: string
  deptId: number
}

interface UserInfoVO {
  // USER 缓存
  permissions: Set<string>
  roles: string[]
  isSetUser: boolean
  user: UserVO
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    permissions: new Set<string>(),
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      deptId: 0
    }
  }),
  getters: {
    getPermissions(): Set<string> {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    }
  },
  actions: {
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      const portalUser = await BpmPortalAuthApi.getCurrentUser()
      const userInfo = {
        // 与后端本地 Mock 规则一致：模型管理员可以操作完整 BPM 菜单；其他用户仅处理自己的流程任务。
        permissions: portalUser.roleCodes.includes(BPM_MODEL_MANAGER_ROLE)
          ? ['*:*:*']
          : HEADLESS_BPM_RUN_PERMISSIONS,
        roles: portalUser.roleCodes,
        user: {
          // 现有 Admin UI 的全局 UserVO 仍是 number；Portal 原始字符串 ID 只在 BPM Token/API 中传递。
          id: 0,
          avatar: portalUser.avatar || '',
          nickname: portalUser.displayName,
          deptId: 0
        },
        menus: []
      }
      this.permissions = new Set(userInfo.permissions || []) // 兜底为 [] https://t.zsxq.com/xCJew
      this.roles = userInfo.roles
      this.user = userInfo.user
      this.isSetUser = true
      wsCache.set(CACHE_KEY.USER, userInfo)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)
    },
    async setUserAvatarAction(avatar: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.avatar = avatar
      userInfo.user.avatar = avatar
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async setUserNicknameAction(nickname: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.nickname = nickname
      userInfo.user.nickname = nickname
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async loginOut() {
      removeToken()
      deleteUserCache() // 删除用户缓存
      this.resetState()
    },
    resetState() {
      this.permissions = new Set<string>()
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
