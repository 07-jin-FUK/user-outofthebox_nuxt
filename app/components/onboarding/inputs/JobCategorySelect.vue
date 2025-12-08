<template>
  <div class="job-category-select">
    <!-- 選択済みの表示 -->
    <div v-if="selectedLabel" class="job-category-select__selected">
      <p class="job-category-select__selected-text">{{ selectedLabel }}</p>
    </div>

    <!-- カード選択 -->
    <div class="job-category-select__cards">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="job-category-select__card"
        :class="{ 'job-category-select__card--selected': modelValue === option.value }"
        @click="handleSelect(option.value, option.label)"
      >
        <span class="job-category-select__card-text">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

interface Option {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  options?: Option[]
  selectedLabel?: string
}>(), {
  modelValue: '',
  options: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:selectedLabel': [label: string]
  'submit': []
}>()

const handleSelect = (value: string, label: string) => {
  emit('update:modelValue', value)
  emit('update:selectedLabel', label)
  nextTick(() => {
    emit('submit')
  })
}
</script>

<style lang="scss" scoped>
.job-category-select {
  max-width: 600px;
  margin: 0 auto;

  &__selected {
    margin-bottom: $spacing-lg;
    text-align: center;  // ← 中央揃えを明示
  }

  &__selected-text {
    font-size: $font-size-sm;
    color: $text-secondary;
    font-weight: normal;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }

  &__card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: $spacing-sm $spacing-lg;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    text-align: center;  // ← 中央揃えに変更

    &:hover {
      background-color: #FFF4CC;
    }

    &--selected {
      background-color: #FFFBF0;
      
      .job-category-select__card-text {
        color: $primary;
        font-weight: 600;
      }
    }
  }

  &__card-text {
    font-size: $font-size-base;
    color: $text-primary;
    line-height: 1.4;
  }
}
</style>
