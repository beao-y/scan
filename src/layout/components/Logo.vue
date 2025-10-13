<script setup lang="ts">
interface PropsType {
  collapsed: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  collapsed: false,
})

const router = useRouter()

// 跳转首页
function toHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex items-center flex-shrink-0 select-none px-5 h-14 text-xl cursor-pointer" :class="props.collapsed ? 'flex-center' : ''" @click="toHome">
    <img class="w-6 h-6 overflow-hidden transition-all duration-300" src="@/assets/images/logo.png" alt="">
    <span class="pl-3 font-bold whitespace-nowrap transition-all duration-300" :class="props.collapsed ? 'hidden' : ''">AntD Vue</span>
  </div>
</template>

<style lang="scss" scoped>

</style>
