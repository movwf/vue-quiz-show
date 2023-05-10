<script setup>
import {
  // RouterLink,
  RouterView
} from 'vue-router'
</script>

<template>
  <!-- <RouterLink to="/about">About</RouterLink> -->
  <RouterView />
</template>

<style scoped>
 * {
  @apply bg-gradient-to-r from-gray-800 via-green-500 to-gray-800;
 }
</style>
