<script setup>
import { computed, ref } from 'vue'
import t from '@/helpers/localize.js'
import teamsApi from '@/api/teams.js'

import JokerButton from '../JokerButton.vue'
const props = defineProps(['teams', 'reloadTeams'])

const jokerTypeMapping = {
  riziko: 'risc',
  banko: 'banko'
}

const jokerReverseTypeMapping = {
  risc: 'riziko',
  banko: 'banko'
}

const jokerNameMapping = {
  riziko: 'Riziko',
  banko: 'Banko'
}

const teamColorMapping = [
  'bg-gray-500',
  'bg-green-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-blue-500',
  'bg-pink-500'
]

const usedTeamRiscs = ref({})

const useJoker = (teamId, jokerType) => {
  const mappedJokerType = jokerReverseTypeMapping[jokerType]
  if (jokerType === 'risc') {
    const amount = prompt(t('teams_risc_joker_propt_question'))
    usedTeamRiscs.value = {
      ...usedTeamRiscs.value,
      [teamId]: amount
    }

    console.log(amount)
  }

  teamsApi.useTeamJoker(teamId, mappedJokerType)
  props.reloadTeams()
}

const spendRisc = (teamId, won = true) => {
  const riscAmount = usedTeamRiscs.value[teamId]
  teamsApi.updateTeamPoint(teamId, won ? riscAmount : -1 * riscAmount)

  delete usedTeamRiscs.value[teamId]
  props.reloadTeams()
}

const dismissRisc = (teamId) => {
  teamsApi.returnTeamJoker(teamId, 'risc')

  delete usedTeamRiscs.value[teamId]
  props.reloadTeams()
}

const mappedTeams = computed(() => {
  return props.teams.map((team) => {
    const jokerList = team.jokers.length ? team.jokers.split(',') : []

    return {
      ...team,
      jokers: jokerList.map((joker, idx) => ({
        order: idx + 1,
        type: jokerTypeMapping[joker],
        name: jokerNameMapping[joker]
      }))
    }
  })
})

const INCREMENT_AMOUNT = 5
const handleUpdateTeam = (teamId, operation) => {
  switch (operation) {
    case 'increment':
      teamsApi.updateTeamPoint(teamId, INCREMENT_AMOUNT)
      // update in state
      break
    case 'decrement':
      teamsApi.updateTeamPoint(teamId, -INCREMENT_AMOUNT)
      break
    default:
      break
  }

  props.reloadTeams()
}
</script>

<template>
  <h1
    class="w-full h-12 border-b-2 border-gray-50 flex items-center justify-center font-light text-xl uppercase"
  >
    {{ t('general_teams') }}
  </h1>
  <div id="teamList" class="flex-grow flex flex-col items-center">
    <div
      v-for="team in mappedTeams"
      :key="team.name"
      class="w-full h-40 mt-4 border-b-2 border-gray-50 flex flex-col justify-center items-center"
    >
      <div class="flex flex-row justify-center align-center">
        <div id="jokersGroup" class="w-12 h-full flex flex-col justify-between">
          <JokerButton
            v-for="joker in team.jokers"
            :useJoker="useJoker"
            :key="joker.order"
            :joker="joker"
            :teamId="team.order"
            size="xs"
          />
        </div>

        <div id="teamLogo" class="h-full flex flex-col justify-center relative">
          <span
            class="rounded-full h-24 w-24 flex items-center justify-center border-2"
            :class="teamColorMapping[team.order - 1]"
            ><h1 v-if="team.image">Logo</h1>
            <h2 v-if="!team.image" class="text-3xl">{{ team.points }}</h2>
            <h3
              v-if="usedTeamRiscs[team.order]"
              class="h-8 w-16 absolute top-0 bg-yellow-500 border-2 border-gray-300 rounded-lg flex justify-center items-center"
            >
              <div
                class="h-full w-full relative flex justify-center items-center"
              >
                <div
                  @click="dismissRisc(team.order)"
                  class="absolute top-[-11px] right-[-12px] w-[18px] h-[18px] rounded-full border-2 flex justify-center items-center bg-black font-bold text-xs text-white cursor-pointer"
                >
                  x
                </div>
                <span> R - {{ usedTeamRiscs[team.order] }} </span>
                <div
                  @click="spendRisc(team.order, true)"
                  class="absolute top-[-11px] left-[-12px] w-[18px] h-[18px] rounded-full border-2 flex justify-center items-center bg-green-800 font-bold text-xs text-white cursor-pointer"
                >
                  ✓
                </div>

                <div
                  @click="spendRisc(team.order, false)"
                  class="absolute top-[-16px] w-[18px] h-[18px] rounded-full border-2 flex justify-center items-center bg-red-600 font-bold text-xs text-white cursor-pointer"
                >
                  −
                </div>
              </div>
            </h3>
          </span>
        </div>

        <div id="pointChangers" class="w-12 h-full">
          <div class="w-12 h-full flex flex-col justify-center items-center">
            <button @click="handleUpdateTeam(team.order, 'increment')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="bi bi-plus-circle-fill cursor-pointer"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
                  class="text-green-500 hover:text-green-400"
                ></path>
              </svg>
            </button>
            <button @click="handleUpdateTeam(team.order, 'decrement')">
              <svg
                style="color: red"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="bi bi-dash-circle-fill mt-4 cursor-pointer"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"
                  class="color-red hover:text-red-500"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <span class="text-lg break-words">{{ team.name }}</span>
      <span v-if="false">{{ team.points }} points </span>
    </div>
  </div>
</template>
