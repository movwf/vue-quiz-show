<script setup>
import { ref } from 'vue'
import t from '@/helpers/localize.js'
const props = defineProps([
  'currentQuestion',
  'nextQuestion',
  'isShowEnded',
  'startTimer',
  'showTimer',
  'isTimeUp',
  'addTime'
])

const isQVisible = ref(Boolean(props.currentQuestion?.answered))
const isAnswerVisible = ref(Boolean(props.currentQuestion?.answered))
const isTimerStarted = ref(false)

const showQuestion = () => {
  if (!isQVisible.value && !props.isTimeUp) {
    isQVisible.value = true
    props.showTimer(props.currentQuestion.time)
  }
}

const startTimer = () => {
  if (!isTimerStarted.value && isQVisible.value) {
    isTimerStarted.value = true
    props.startTimer()
  }
}

const showAnswer = () => {
  if (!isAnswerVisible.value) {
    isAnswerVisible.value = true
    isQVisible.value = false
  }
}

const forwardQuestion = () => {
  isQVisible.value = false
  isAnswerVisible.value = false
  isTimerStarted.value = false
  props.nextQuestion()
}
</script>

<template>
  <div
    v-if="currentQuestion"
    id="question"
    class="h-full w-full flex flex-col justify-center items-center my-8 translate-y-[-20px]"
  >
    <div
      class="min-h-[40%] w-[85%] max-w-[900px] p-12 rounded-3xl flex flex-col items-center justify-center border-2 text-5xl bg-[#79C99E]"
    >
      <span v-if="!isQVisible && !isTimeUp">
        {{ currentQuestion.id
        }}{{ t('question_area_nth_question_label') }}</span
      >
      <span v-if="!isQVisible && !isTimeUp" class="mt-6">{{
        currentQuestion.category
      }}</span>
      <span v-if="!isQVisible && !isTimeUp" class="mt-6"
        >{{ currentQuestion.points || 0 }}
        {{ t('question_area_points_label') }}</span
      >
      <span v-if="isQVisible">
        {{ t('question_area_question_label') }} {{ currentQuestion.text }}
      </span>
      <span v-if="isAnswerVisible">
        {{ t('question_area_answer_label') }} {{ currentQuestion.answer }}
      </span>
    </div>
    <div id="questionButtons">
      <button class="bg-green-600 text-gray-50" @click="addTime(5)">
        {{ t('question_area_plus_5_seconds') }}
      </button>
      <button class="bg-blue-300" @click="showQuestion">
        {{ t('question_area_show_question') }}
      </button>
      <button class="bg-green-300" @click="startTimer">
        {{ t('question_area_start_timer') }}
      </button>
      <button v-if="isTimeUp" class="bg-yellow-300" @click="showAnswer">
        {{ t('question_area_show_answer') }}
      </button>
    </div>
    <div v-if="isTimeUp" id="questionButtons" class="translate-y-8">
      <button v-if="!isShowEnded" class="bg-teal-300" @click="forwardQuestion">
        {{ t('question_area_next_question') }}
      </button>
      <button v-if="isShowEnded" class="bg-pink-300">
        {{ t('question_area_show_results') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
#questionButtons {
  @apply w-full flex justify-center mt-3;
}

button {
  @apply w-36 h-20 text-2xl ml-4 rounded-xl border-[1px] border-gray-700 hover:scale-[90%] ease-in-out duration-300;
}
</style>
