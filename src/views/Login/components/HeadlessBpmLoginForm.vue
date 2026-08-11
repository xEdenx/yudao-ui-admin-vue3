<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    class="login-form"
    label-position="top"
    size="large"
    @keyup.enter="handleLogin"
  >
    <el-form-item><h2>Headless BPM Portal 登录</h2></el-form-item>
    <el-alert
      :closable="false"
      class="mb-18px"
      title="仅本地 Headless BPM Mock 可用，不使用 system 用户、角色或部门。"
      type="info"
    />
    <el-form-item label="Portal 用户 ID" prop="userId">
      <el-input v-model="formData.userId" placeholder="例如：portal-requester-a1f2" />
    </el-form-item>
    <el-form-item label="本地 Mock 密码" prop="password">
      <el-input v-model="formData.password" show-password type="password" />
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" class="w-full" type="primary" @click="handleLogin">
        登录并读取 Portal 用户
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import * as BpmPortalAuthApi from '@/api/bpm/portalAuth'
import * as authUtil from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'HeadlessBpmLoginForm' })

const { push } = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const formData = reactive({ userId: 'portal-requester-a1f2', password: 'portal-local-dev' })
const rules = { userId: [required], password: [required] }

const handleLogin = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  loading.value = true
  try {
    const response = await BpmPortalAuthApi.mockLogin(formData)
    authUtil.setToken({
      id: 0,
      accessToken: response.accessToken,
      refreshToken: '',
      userId: 0,
      userType: 1,
      clientId: 'local-headless-bpm-mock',
      expiresTime: 0
    })
    authUtil.setTenantId(response.tenantId)
    userStore.resetState()
    await push('/bpm/task/todo')
  } finally {
    loading.value = false
  }
}
</script>
