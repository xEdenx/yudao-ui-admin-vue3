/**
 * Headless BPM 管理端在登录前可访问的最小路由集合。
 *
 * <p>不注册 system / infra 的静态管理路由，登录后的 BPM 路由由 Portal 角色动态生成。</p>
 */
const headlessStaticRouter: AppRouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: 'Headless BPM 登录',
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  }
]

export default headlessStaticRouter
