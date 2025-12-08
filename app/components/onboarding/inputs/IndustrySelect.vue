<template>
  <div class="industry-select">

    <!-- キーワード検索 -->
    <div class="industry-select__section">
      <h3 class="industry-select__section-title">
        <span class="industry-select__section-icon">|</span>
        キーワードからさがす
      </h3>
      <input
        v-model="searchKeyword"
        type="text"
        :placeholder="placeholder"
        class="industry-select__search"
        @keydown.enter.prevent
      />
    </div>

    <!-- カテゴリー選択 -->
    <div class="industry-select__section">
      <h3 class="industry-select__section-title">
        <span class="industry-select__section-icon">|</span>
        カテゴリーからさがす
      </h3>
      <div class="industry-select__categories">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="industry-select__category"
          :class="{ 'industry-select__category--selected': modelValue === option.value }"
          @click="handleSelect(option.value, option.label)"
        >
          <span class="industry-select__category-text">{{ option.label }}</span>
          <span class="industry-select__category-arrow">›</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Option {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  options?: Option[]
  placeholder?: string
  selectedLabel?: string
}>(), {
  modelValue: '',
  options: () => [],
  placeholder: '例：飲食、医療、人材、アパレル、配送など'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:selectedLabel': [label: string]
  'submit': []
}>()

const searchKeyword = ref('')

const handleSelect = (value: string, label: string) => {
  emit('update:modelValue', value)
  emit('update:selectedLabel', label)
  nextTick(() => {
    emit('submit')
  })
}
</script>

<style lang="scss" scoped>
.industry-select {
  max-width: 600px;
  margin: 0 auto;

  &__selected {
    margin-bottom: $spacing-xl;
    padding: $spacing-md;
    background: #FFFBF0;
    border-left: 4px solid $primary;
    border-radius: $radius-sm;
  }

  &__selected-text {
    font-size: $font-size-base;
    font-weight: 600;
    color: $primary;
  }

  &__section {
    margin-bottom: $spacing-xl;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  &__section-icon {
    color: $primary;
    font-size: 20px;
    font-weight: bold;
  }

  &__search {
    width: 100%;
    padding: $spacing-md;
    font-size: $font-size-base;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    background: $bg-primary;

    &:focus {
      outline: none;
      border-color: $primary;
    }

    &::placeholder {
      color: $text-muted;
    }
  }

  &__categories {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-sm;
  }

  &__category {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    background: white;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    &:hover {
      background: #FFF4CC;
    }

    &--selected {
      background: #FFFBF0;
      
      .industry-select__category-text {
        color: $primary;
        font-weight: 600;
      }
    }
  }

  &__category-text {
    font-size: $font-size-sm;
    color: $text-primary;
    line-height: 1.4;
  }

  &__category-arrow {
    font-size: 20px;
    color: $text-muted;
    
    .industry-select__category--selected & {
      color: $primary;
    }
  }
}
</style>
