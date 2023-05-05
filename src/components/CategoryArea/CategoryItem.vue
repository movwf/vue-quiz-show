<script setup>
import { computed } from 'vue'

const props = defineProps(['category'])

const categoryColor = computed(() => {
  return props.category.enabled
    ? 'border-2 border-black bg-red-800 text-white'
    : 'border-2 border-white bg-gray-400 text-white'
})
</script>

<template>
  <span
    class="h-12 w-[75%] flex justify-center items-center font-bold rounded-xl mt-4"
    :class="categoryColor"
  >
    {{ props.category.name }}
  </span>
</template>
