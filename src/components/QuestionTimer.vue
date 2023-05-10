<script>
const FULL_DASH_ARRAY = 283
const WARNING_THRESHOLD = 10
const ALERT_THRESHOLD = 5

const COLOR_CODES = {
  info: {
    color: 'text-green-500'
  },
  warning: {
    color: 'text-yellow-500',
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: 'text-red-500',
    threshold: ALERT_THRESHOLD
  }
}

export default {
  props: ['setTimeUp'],
  data() {
    return {
      timeLimit: 0,
      timePassed: 0,
      timerInterval: null
    }
  },

  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`
    },

    formattedTimeLeft() {
      const timeLeft = this.timeLeft
      const minutes = Math.floor(timeLeft / 60)
      let seconds = timeLeft % 60

      if (seconds < 10) {
        seconds = `0${seconds}`
      }

      return `${minutes}:${seconds}`
    },

    timeLeft() {
      return this.timeLimit - this.timePassed
    },

    timeFraction() {
      const rawTimeFraction = this.timeLeft / this.timeLimit
      return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction)
    },

    remainingPathColor() {
      const { alert, warning, info } = COLOR_CODES

      if (this.timeLeft <= alert.threshold) {
        return alert.color
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color
      }

      return info.color
    }
  },

  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp()
        this.$props.setTimeUp(true);
      }
    }
  },

  methods: {
    onTimesUp() {
      clearInterval(this.timerInterval)
    },

    setTimeLimit(timeInSeconds) {
      this.timePassed = 0
      this.timeLimit = timeInSeconds
    },

    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000)
    },

    resetTimer() {
      this.timePassed = 0
      this.onTimesUp()
      this.startTimer()
    }
  }
}
</script>

<template>
  <div
    v-if="timeLeft !== 0"
    class="h-full w-full p-4 relative flex flex-col items-center justify-center"
  >
    <svg
      class="base-timer__svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="base-timer__circle">
        <circle
          class="base-timer__path-elapsed"
          cx="50"
          cy="50"
          r="45"
        ></circle>
        <path
          :stroke-dasharray="circleDasharray"
          class="base-timer__path-remaining stroke-current"
          :class="remainingPathColor"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span class="base-timer__label h-full absolute text-2xl xl:text-5xl text-white">{{
      formattedTimeLeft
    }}</span>
  </div>
</template>

<style scoped>
.base-timer__svg {
  transform: scaleX(-1);
}

.base-timer__circle {
  fill: none;
  stroke: none;
}

.base-timer__path-elapsed {
  stroke-width: 7px;
  stroke: grey;
}

.base-timer__path-remaining {
  stroke-width: 7px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}

.base-timer__label {
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
