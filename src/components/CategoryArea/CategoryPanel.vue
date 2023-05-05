<script setup>
import { computed } from 'vue'
import t from '@/helpers/localize.js'
import CategoryItem from './CategoryItem.vue'
const props = defineProps(['categories', 'disableCategory'])

const orderedList = computed(() => {
  return [...props.categories].sort((a, b) => b.enabled - a.enabled)
})
</script>

<template>
  <h1
    class="w-full h-12 border-b-2 border-gray-50 flex items-center justify-center font-light text-xl uppercase"
  >
    {{ t('general_categories') }}
  </h1>
  <div id="categoryList" class="flex-grow flex flex-col items-center">
    <CategoryItem
      v-for="category in orderedList"
      :key="category"
      :category="category"
    />
  </div>
</template>
