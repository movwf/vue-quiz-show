<script setup>
const props = defineProps(['useJoker', 'joker', 'showLabel', 'size', 'teamId'])
const logos = {
  risc: ['xs', 'sm'].includes(props.size) ? `<h2>R</h2>` : `<h2>Riziko</h2>`,
  banko: ['xs', 'sm'].includes(props.size) ? `<h2>B</h2>` : `<h2>Banko</h2>`
}
const sizes = {
  xs: 'h-8 w-8',
  sm: 'h-12 w-12',
  md: 'h-24 w-24',
  lg: 'h-32 w-32'
}
</script>
<template>
  <div
    v-if="joker"
    @click="useJoker(teamId, joker.type)"
    class="flex flex-col justify-center items-center"
  >
    <span
      :id="'joker-' + `${joker.type + '-' + joker.order}`"
      class="rounded-full mt-1 flex items-center justify-center border-2 bg-teal-500 cursor-pointer hover:bg-teal-100 hover:border-green-400"
      :class="sizes[size]"
      v-html="logos[joker.type]"
    />
    <span v-if="props.showLabel" class="mt-2 select-none">{{
      joker.name
    }}</span>
  </div>
</template>
