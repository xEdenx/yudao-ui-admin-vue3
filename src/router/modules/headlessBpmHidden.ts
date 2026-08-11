/**
 * BPM 菜单页触发的隐藏编辑/详情路由。
 *
 * 它们挂载到动态生成的 /bpm 根路由下，因此保留管理端布局，但不会出现在菜单中。
 */
const headlessBpmHiddenRoutes: AppRouteRecordRaw[] = [
  {
    path: 'manager/form/edit',
    component: () => import('@/views/bpm/form/editor/index.vue'),
    name: 'BpmFormEditor',
    meta: {
      noCache: true,
      hidden: true,
      canTo: true,
      title: '设计流程表单',
      activeMenu: '/bpm/manager/form'
    }
  },
  {
    path: 'manager/definition',
    component: () => import('@/views/bpm/model/definition/index.vue'),
    name: 'BpmProcessDefinition',
    meta: {
      noCache: true,
      hidden: true,
      canTo: true,
      title: '流程定义',
      activeMenu: '/bpm/manager/model'
    }
  },
  {
    path: 'process-instance/detail',
    component: () => import('@/views/bpm/processInstance/detail/index.vue'),
    name: 'BpmProcessInstanceDetail',
    meta: {
      noCache: true,
      hidden: true,
      canTo: true,
      title: '流程详情',
      activeMenu: '/bpm/task/my'
    },
    props: (route) => ({
      id: route.query.id,
      taskId: route.query.taskId,
      activityId: route.query.activityId
    })
  },
  {
    path: 'process-instance/report',
    component: () => import('@/views/bpm/processInstance/report/index.vue'),
    name: 'BpmProcessInstanceReport',
    meta: {
      noCache: true,
      hidden: true,
      canTo: true,
      title: '数据报表',
      activeMenu: '/bpm/manager/model'
    }
  },
  {
    path: 'manager/model/create',
    component: () => import('@/views/bpm/model/form/index.vue'),
    name: 'BpmModelCreate',
    meta: {
      noCache: true,
      hidden: true,
      canTo: true,
      title: '创建流程',
      activeMenu: '/bpm/manager/model'
    }
  },
  {
    path: 'manager/model/:type/:id',
    component: () => import('@/views/bpm/model/form/index.vue'),
    name: 'BpmModelUpdate',
    meta: {
      noCache: true,
      hidden: true,
      canTo: true,
      title: '修改流程',
      activeMenu: '/bpm/manager/model'
    }
  }
]

/** 将隐藏 BPM 页面挂到动态菜单生成的 /bpm 布局路由。 */
export const appendHeadlessBpmHiddenRoutes = (routes: AppRouteRecordRaw[]) => {
  const bpmRoute = routes.find((route) => route.path === '/bpm')
  if (!bpmRoute) {
    throw new Error('Headless BPM root route is missing')
  }
  bpmRoute.children = [...(bpmRoute.children || []), ...headlessBpmHiddenRoutes]
}
