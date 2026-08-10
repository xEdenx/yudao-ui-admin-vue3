/**
 * 本地 Headless 登录复用原「工作流程」菜单结构。
 *
 * 菜单不再从 system_menu 获取；生产 Portal 接入时由 Portal 权限策略替换本地角色判断。
 */
const managerRole = 'ROLE_BPM_MODEL_MANAGER'

const menu = (
  id: number,
  parentId: number,
  name: string,
  path: string,
  icon: string,
  component = '',
  children?: AppCustomRouteRecordRaw[]
): AppCustomRouteRecordRaw => ({
  id,
  parentId,
  name,
  path,
  icon,
  component,
  componentName: '',
  redirect: '',
  visible: true,
  keepAlive: true,
  alwaysShow: Boolean(children?.length),
  meta: {},
  children
})

/**
 * 返回 Headless BPM 支持的菜单组；运行用户只能看到审批中心，模型管理员获得流程维护菜单。
 */
export const getHeadlessBpmMenus = (roles: string[]): AppCustomRouteRecordRaw[] => {
  const approvalCenter = menu(1200, 1185, '审批中心', 'task', 'fa:tasks', '', [
    menu(
      2720,
      1200,
      '发起流程',
      'create',
      'fa-solid:grin-stars',
      'bpm/processInstance/create/index'
    ),
    menu(1201, 1200, '我的流程', 'my', 'fa-solid:book', 'bpm/processInstance/index'),
    menu(1207, 1200, '待办任务', 'todo', 'fa:slack', 'bpm/task/todo/index'),
    menu(1208, 1200, '已办任务', 'done', 'fa:delicious', 'bpm/task/done/index'),
    menu(2713, 1200, '抄送我的', 'copy', 'ep:copy-document', 'bpm/task/copy/index')
  ])

  const children = [approvalCenter]
  if (roles.includes(managerRole)) {
    children.unshift(
      menu(1186, 1185, '流程管理', 'manager', 'fa:dedent', '', [
        menu(1193, 1186, '流程模型', 'model', 'fa-solid:project-diagram', 'bpm/model/index'),
        menu(1187, 1186, '流程表单', 'form', 'fa:hdd-o', 'bpm/form/index'),
        menu(2714, 1186, '流程分类', 'category', 'fa:object-ungroup', 'bpm/category/index'),
        menu(
          2726,
          1186,
          '流程监听器',
          'process-listener',
          'fa:assistive-listening-systems',
          'bpm/processListener/index'
        ),
        menu(
          2731,
          1186,
          '流程表达式',
          'process-expression',
          'fa:wpexplorer',
          'bpm/processExpression/index'
        ),
        menu(
          2721,
          1186,
          '流程实例',
          'process-instance/manager',
          'fa:square',
          'bpm/processInstance/manager/index'
        ),
        menu(2724, 1186, '流程任务', 'process-tasnk', 'ep:collection-tag', 'bpm/task/manager/index')
      ])
    )
  }
  return [menu(1185, 0, '工作流程', '/bpm', 'fa:medium', '', children)]
}
