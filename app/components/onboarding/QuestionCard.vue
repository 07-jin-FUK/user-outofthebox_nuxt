<template>
  <div class="question-card">
    <p class="question-card__progress">
      {{ currentIndex + 1 }} / {{ total }}
    </p>
    <h2 class="question-card__title">
      <span class="question-card__highlight">{{ question.highlight }}</span>
      <span>{{ question.text }}</span>
    </h2>
    <div class="question-card__input">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Question {
  id: string
  highlight: string
  text: string
  component: any
  options?: any[]
  placeholder?: string
}

defineProps<{
  question: Question
  currentIndex: number
  total: number
}>()
</script>

<style lang="scss" scoped>
.question-card {
  width: 100%;
  max-width: 700px;
  text-align: center;

  &__progress {
    color: $text-muted;
    font-size: $font-size-sm;
    margin-bottom: $spacing-md;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: $spacing-xl;
    line-height: 1.5;
  }

  &__highlight {
    color: $primary;
     font-size: 1.1em; 
      margin-right: $spacing-xs;
  }

  &__input {
    margin-top: $spacing-lg;
  }
}
</style>
