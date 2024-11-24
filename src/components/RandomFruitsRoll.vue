<template>
  <div class="component-RandomFruitsRoll">
    <div v-for="(fruit, key) in fruits" class="random-reel-value" :key="key">
      {{ fruit }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    numberOfFruits: {
      type: Number,
      default: 3
    }
  },
  data: () => ({
    fruits: [] as string[]
  }),
  mounted() {
    this.generateRandomFruits()
  },
  methods: {
    generateRandomFruits() {
      const fruits = ['🍒', '🍋', '🍇']

      for (let i = 0; i < this.numberOfFruits; i++) {
        const randomIndex = Math.floor(Math.random() * fruits.length)
        this.fruits = [...this.fruits, fruits[randomIndex]]
      }
    }
  }
}
</script>
