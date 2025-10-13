<script setup lang="ts">
import { BellOutlined, DownOutlined } from '@ant-design/icons-vue'
import { useGlobalState } from '@/store/globalState.ts'
import Notice from './components/Notice.vue'

const globalState = useGlobalState()
const router = useRouter()

function logOut() {
  globalState.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <a-space class="mr-8">
      <a-popover trigger="click">
        <a-badge :count="10" size="small">
          <a-button type="text">
            <template #icon>
              <BellOutlined />
            </template>
          </a-button>
        </a-badge>

        <template #content>
          <Notice />
        </template>
      </a-popover>
    </a-space>

    <a-popover>
      <template #content>
        <div class="avtar-item" @click="logOut">
          退出登录
        </div>
      </template>
      <div class="avtar flex items-center cursor-pointer">
        <a-avatar class="avtar-bg">
          B
        </a-avatar>
        <span class="ml-2 mr-1 leading-4">Beao</span>
        <DownOutlined class="arrow  transition-all  duration-300" />
      </div>
    </a-popover>
  </div>
</template>

<style scoped lang="scss">
.avtar:hover {
  .arrow {
    transform: rotate(180deg);
  }
}

.avtar-item:hover {
  background-color: var(--ant-color-fill-secondary);
}

.avtar-bg {
  color: var(--ant-color-primary);
  background-color: var(--ant-color-primary-bg-hover);
}
</style>
