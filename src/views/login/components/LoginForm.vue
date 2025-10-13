<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { getAdminMenu } from '@/api/test.ts'
import { handleComponentName } from '@/router/route.ts'
import { useCacheState } from '@/store/cacheState.ts'
import { useGlobalState } from '@/store/globalState.ts'

const globalState = useGlobalState()
const cacheState = useCacheState()
const router = useRouter()

interface FormState {
  username: string
  password: string
  remember: boolean
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: false,
})

async function onFinish(values: FormState) {
  const route = await getAdminMenu() as IRouteType[]

  const formatRes = route.map((item: IRouteType) => {
    return {
      ...item,
      componentName: handleComponentName(item.path),
    }
  })

  // 提取需要缓存的组件名（cache === 1）
  const cachedRouteLists = formatRes
    .filter(item => item.cache === 1)
    .map(item => item.componentName)

  // 存储到 Pinia
  cacheState.setCacheRouteList(cachedRouteLists)

  globalState.setPermissions(route)

  await globalState.login({
    userName: values.username,
    password: values.password,
  })

  router.push('/')
}
</script>

<template>
  <div class="login-form">
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item
        class="form-item5"
        name="username"
        :rules="[{ required: true, message: '请输入账号' }]"
      >
        <a-input v-model:value="formState.username" placeholder="用户名：admin">
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        class="form-item6"
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="密码：123456">
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item class="form-item7" name="remember">
        <div class="flex-between">
          <a-checkbox v-model:checked="formState.remember">
            记住我
          </a-checkbox>
          <span>忘记密码</span>
        </div>
      </a-form-item>

      <a-form-item class="form-item8">
        <a-button class="w-full mt-10" type="primary" html-type="submit">
          登录
        </a-button>
      </a-form-item>

      <div class="flex-center mr-6 mt-8 form-item9">
        你还没有账号？<a>创建账号</a>
      </div>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
@keyframes move {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.login-form {
  @apply m-auto p-10 lg:p-32 xl:p-68;

  @for $i from 1 through 9 {
    .form-item#{$i} {
      opacity: 0;
      animation-name: move;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .btn {
    @apply flex-center flex-1 mr-6;

    &-text{
      @apply ml-2 font-bold;
    }
  }
}

.ant-btn{
  @apply h-12;
}

.ant-form-item{
  @apply mb-5;
}

.ant-input-affix-wrapper{
  @apply px-4 py-3;
 }

.ant-input-prefix {
  margin-inline-end: 10px;
}
</style>
