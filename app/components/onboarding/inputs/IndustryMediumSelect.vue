<template>
  <div class="industry-medium-select">
    <!-- 選択済みの表示(左寄せ) -->
    <div v-if="selectedLabel" class="industry-medium-select__selected">
      <p class="industry-medium-select__selected-text">{{ selectedLabel }}</p>
    </div>

    <!-- カード選択 -->
    <div class="industry-medium-select__cards">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="industry-medium-select__card"
        :class="{ 'industry-medium-select__card--selected': modelValue === option.value }"
        @click="handleSelect(option.value, option.label)"
      >
        <span class="industry-medium-select__card-text">{{ option.label }}</span>
        <span class="industry-medium-select__card-arrow">›</span>
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
.industry-medium-select {
  max-width: 600px;
  margin: 0 auto;

  &__selected {
    margin-bottom: $spacing-lg;
    text-align: left;
    padding: 0 $spacing-md;
  }

  &__selected-text {
    font-size: $font-size-sm;
    color: $text-secondary;
    font-weight: normal;
    text-align: center;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }

  &__card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: $spacing-md $spacing-lg;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    text-align: left;
    min-height: 60px;

    &:hover {
      background-color: #FFF4CC;
    }

    &--selected {
      background-color: #FFFBF0;
      
      .industry-medium-select__card-text {
        color: $primary;
        font-weight: 600;
      }
      
      .industry-medium-select__card-arrow {
        color: $primary;
      }
    }
  }

  &__card-text {
    flex: 1;
    font-size: $font-size-sm;
    color: $text-primary;
    line-height: 1.4;
    word-break: break-word;
    padding-right: $spacing-sm;
  }

  &__card-arrow {
    font-size: 20px;
    color: $text-muted;
    flex-shrink: 0;
  }
}
</style>
