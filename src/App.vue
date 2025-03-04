<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
// App.vue作为根组件，主要负责布局和全局状态管理
</script>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>