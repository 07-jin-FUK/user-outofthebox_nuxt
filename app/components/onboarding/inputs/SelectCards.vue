<template>
  <div class="select-cards" :class="{ 'select-cards--featured-first': featuredFirst }">
    <button
      v-for="option in options"
      :key="option.value"
      class="select-cards__item"
      :class="{ 'select-cards__item--selected': modelValue === option.value }"
      @click="handleSelect(option.value)"
    >
      <span v-if="option.icon" class="select-cards__icon">
        <Icon v-if="option.icon === 'male'" name="mdi:face-man" size="48" />
        <Icon v-else-if="option.icon === 'female'" name="mdi:face-woman" size="48" />
        <span v-else>{{ option.icon }}</span>
      </span>
      <span class="select-cards__label">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'


interface Option {
  value: string
  label: string
  icon?: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  options?: Option[]
  featuredFirst?: boolean 
}>(), {
  modelValue: '',
  options: () => [],
  featuredFirst: false 
})

const emit = defineEmits(['update:modelValue', 'submit'])

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  nextTick(() => {
    emit('submit')
  })
}
</script>

<style lang="scss" scoped>
.select-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  // ← 2列に固定
  gap: $spacing-md;
  max-width: 700px; 
  margin: 0 auto;
  
    &--featured-first {
    .select-cards__item:first-child {
      grid-column: 1 / -1;
    }
  }

  &__item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: $spacing-sm $spacing-lg;
    min-width: unset;  // ← min-widthを削除
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;

    &:hover {
      background-color: #FFF4CC;
    }

    &--selected {
      background-color:  #FFFBF0;
    }
  }

  &__icon {
    display: block;
    margin-bottom: $spacing-sm;
    color: $text-secondary;
    
    .select-cards__item--selected & {
      color: $primary;
    }
  }

  &__label {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
  }
}
</style>
