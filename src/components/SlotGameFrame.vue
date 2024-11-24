<template>
  <div class="component-SlotTestFrame">
    <button @click="doSpin()">PAINA</button>

    <div class="reel-container" :class="{ finished: isFinished }">
      <div class="reel left">
        <div v-if="isFinished" class="reel-value left">
          {{ reelLeftValue }}
        </div>
        <RandomFruitsRoll class="left" :class="{ showSpinner }" :numberOfFruits="6" />
      </div>
      <div class="reel center">
        <div v-if="isFinished" class="reel-value center">
          {{ reelCenterValue }}
        </div>
        <RandomFruitsRoll class="center" :class="{ showSpinner }" :numberOfFruits="8" />
      </div>
      <div class="reel right">
        <div v-if="isFinished" class="reel-value right">
          {{ reelRightValue }}
        </div>
        <RandomFruitsRoll class="right" :class="{ showSpinner }" :numberOfFruits="10" />
      </div>
    </div>

    <div class="bottom-container">
      <div class="bet-container">
        <button @click="increaseBetAmount()">+</button>
        <p>Panos: {{ betAmount }}</p>
        <button @click="decreaseBetAmount()">-</button>
      </div>
      <p>Saldo: {{ balance }}</p>
      <p>Voitto: {{ winAmount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { FruitGameMath } from '../slots/fruitGame/math'
import RandomFruitsRoll from './RandomFruitsRoll.vue'

interface IData {
  fruitGameMath: FruitGameMath
  result: null | number[]
  betAmount: number
  winAmount: number
}

const initialBalance = 100

const FRUIT_EMOJI_FOR_VALUE: {
  [key: number]: string
} = {
  1: '🍒',
  2: '🍋',
  3: '🍇'
}

export default {
  components: {
    RandomFruitsRoll
  },
  data: (): IData => ({
    fruitGameMath: new FruitGameMath(initialBalance),
    result: null,
    betAmount: 0,
    winAmount: 0
  }),
  computed: {
    showSpinner(): boolean {
      return this.statusClass === 'spinning' || this.statusClass === 'finished'
    },
    isFinished(): boolean {
      return this.statusClass === 'finished' || this.statusClass === 'waiting'
    },
    statusClass(): string {
      return this.fruitGameMath.getStatus()
    },
    reelLeftValue(): string {
      if (!this.result?.length) return ''
      return FRUIT_EMOJI_FOR_VALUE?.[this.result?.[0]] ?? ''
    },
    reelCenterValue(): string {
      if (!this.result?.length) return ''
      return FRUIT_EMOJI_FOR_VALUE?.[this.result?.[1]] ?? ''
    },
    reelRightValue(): string {
      if (!this.result?.length) return ''
      return FRUIT_EMOJI_FOR_VALUE?.[this.result?.[2]] ?? ''
    },
    winningMultiplier(): number {
      return this.fruitGameMath.getWinningMultiplier()
    },
    balance(): number {
      return this.fruitGameMath.getBalance()
    }
  },
  watch: {
    betAmount(): void {
      this.fruitGameMath.setBetAmount(this.betAmount)
    },
    statusClass(): void {
      if (this.statusClass === 'finished') {
        this.result = this.fruitGameMath.getResultSymbols()
        this.winAmount = this.fruitGameMath.getPayoutAmount()
      }
    }
  },
  methods: {
    doSpin(): void {
      this.result = null
      this.fruitGameMath.generateRandomSymbolsForReels()
    },
    increaseBetAmount(): void {
      this.betAmount += 1
    },
    decreaseBetAmount(): void {
      if (this.betAmount > 0) {
        this.betAmount -= 1
      }
    }
  }
}
</script>
