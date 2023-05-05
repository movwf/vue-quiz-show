<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import gapi from '@/services/googleSheets.js'
import localSave from '@/services/localSave.js'
import QuestionTimer from '../components/QuestionTimer.vue'
import QuestionArea from '../components/QuestionArea/QuestionArea.vue'
import TeamsPanel from '../components/TeamsArea/TeamsPanel.vue'
import CategoryPanel from '../components/CategoryArea/CategoryPanel.vue'
import QuestionProgress from '../components/QuestionProgressArea/QuestionProgress.vue'

const questionTimer = ref(null)

const currentQuestion = ref('1')
const isShowEnded = ref(false)
const isTimeUp = ref(false)
const questions = ref([])
const teams = ref([])

const categories = computed(() => {
  const distinctList = new Set(questions.value.map((i) => i.category))

  return [...distinctList.values()].map((cat) => ({
    name: cat,
    enabled: !questions.value
      .filter((q) => q.category === cat)
      .every((q) => q.answered)
  }))
})

const setQuestionAnswered = (questionId) => {
  questions.value = questions.value.map((q) => ({
    ...q,
    ...(q.id === questionId && { answered: true })
  }))
}

const setTimeUp = (state) => {
  isTimeUp.value = state
}

const startTimer = () => {
  questionTimer.value.startTimer()
}

const showTimer = (timeInSeconds) => {
  isTimeUp.value = false
  questionTimer.value.setTimeLimit(timeInSeconds)
}

const addTime = (amount) => {
  questionTimer.value.setTimeLimit(Number(questionTimer.value.timeLimit) + Number(amount))
}

const reloadTeams = () => {
  const savedTeamBank = localSave.getTeamsData()

  teams.value = savedTeamBank
}

const nextQuestion = () => {
  const newQuestionId = `${Number(currentQuestion.value) + 1}`

  if (Number(newQuestionId) <= questions.value.length) {
    setQuestionAnswered(currentQuestion.value)

    isTimeUp.value = false
    currentQuestion.value = newQuestionId
  }

  if (Number(newQuestionId) === questions.value.length) {
    isShowEnded.value = true
  }
}

watch(questions, (newValue) => {
  const data = newValue.values()

  const temp = []

  for (const d of data) {
    temp.push(Object.assign({}, d))
  }

  localSave.saveQuestions(temp)
})

onMounted(async () => {
  const savedQuestionBank = localSave.getQuestionsData()
  const savedTeamBank = localSave.getTeamsData()

  await gapi.init()

  if (!savedQuestionBank) {
    const results = await gapi.getQuestions()

    if (results.length) {
      const mappedQuestions = results.map((q) => ({
        answered: false,
        ...Object.keys(q).reduce(
          (prev, next) => ({
            ...prev,
            [next.replace('question_', '')]: q[next]
          }),
          {}
        )
      }))

      // check for localstorage
      questions.value = mappedQuestions

      localSave.saveQuestions(mappedQuestions)
    }
  } else {
    questions.value = savedQuestionBank

    const lastUnansweredIdx = savedQuestionBank.findIndex(
      (q) => q.answered === false
    )

    if (lastUnansweredIdx !== -1)
      currentQuestion.value = savedQuestionBank[lastUnansweredIdx].id
    else {
      currentQuestion.value = savedQuestionBank.at(-1).id
    }
  }

  if (!savedTeamBank) {
    const teamsData = await gapi.getTeams()

    if (teamsData.length) {
      const mappedTeams = teamsData.map((t) =>
        Object.keys(t).reduce(
          (prev, next) => ({
            ...prev,
            [next.replace('team_', '')]: t[next]
          }),
          {}
        )
      )
      teams.value = mappedTeams

      localSave.saveTeams(mappedTeams)
    }
  } else {
    teams.value = savedTeamBank
  }
})
</script>

<template>
  <div class="h-screen w-screen">
    <nav class="flex flex-row w-full h-[25%] border-t-2 border-gray-50">
      <div class="topBlock">
        <div class="h-full flex flex-row">
          <QuestionTimer ref="questionTimer" 
          :setTimeUp="setTimeUp"
          />
        </div>
      </div>
      <div class="questionProgressBar">
        <QuestionProgress
          :questions="questions"
          :currentQuestion="currentQuestion"
        />
      </div>
      <div class="topBlock h-full flex justify-center items-center">Logo</div>
    </nav>
    <main class="flex flex-row mainBorder w-full h-[75%]">
      <aside class="sidePanel">
        <CategoryPanel :categories="categories" />
      </aside>

      <div class="questionArea">
        <QuestionArea
          :currentQuestion="questions.find((q) => q.id === currentQuestion)"
          :nextQuestion="nextQuestion"
          :isShowEnded="isShowEnded"
          :startTimer="startTimer"
          :showTimer="showTimer"
          :isTimeUp="isTimeUp"
          :addTime="addTime"
        />
      </div>
      <aside class="sidePanel">
        <TeamsPanel :teams="teams" :reloadTeams="reloadTeams" />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.topBlock {
  @apply w-1/5 h-full border-x-2 border-gray-50;
}

.questionProgressBar {
  @apply flex-grow h-full flex flex-col mt-4;
}

.questionArea {
  @apply w-3/5 h-full border-b-2 border-gray-50 flex flex-col items-center;
}

.sidePanel {
  @apply w-1/5 h-full border-x-2 border-b-2 border-gray-50 overflow-y-scroll scrollbar-hide whitespace-nowrap;
}
</style>
