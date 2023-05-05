<script setup>
import t from '@/helpers/localize.js'
const props = defineProps(['questions', 'currentQuestion'])

const questionColor = (questionId) => {
  return props.questions.find((q) => q.id === questionId).answered
    ? 'border-red-500'
    : props.currentQuestion === questionId
    ? 'bg-green-500 border-gray-50'
    : 'border-gray-100'
}
</script>

<template>
  <span class="w-full flex justify-center my-2">
    <h1 class="font-light text-xl uppercase">{{ t('general_questions') }}</h1>
  </span>
  <div
    id="question-numbers"
    class="py-2 flex-grow flex flex-row justify-between"
  >
    <div
      v-for="q in props.questions"
      :key="q.id"
      class="h-8 w-full mx-2 flex justify-center items-center"
    >
      <span
        class="w-[80%] border-2 flex justify-center rounded-full"
        :class="questionColor(q.id)"
        >{{ q.id }}</span
      >
    </div>
  </div>
</template>
