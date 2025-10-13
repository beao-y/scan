<script setup lang="ts">
const LoginForm = defineAsyncComponent(
  () => import('./components/LoginForm.vue'),
)
</script>

<template>
  <div class="login">
    <LoginForm />
  </div>
</template>

<style scoped lang="scss">
  .login {
    @apply full bg-white flex;

  }
</style>
