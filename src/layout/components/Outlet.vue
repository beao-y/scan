<script setup lang="ts">
import { useCacheState } from '@/store/cacheState.ts'

const { cacheRouteList } = storeToRefs(useCacheState())
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in" appear>
      <keep-alive :include="cacheRouteList">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>
