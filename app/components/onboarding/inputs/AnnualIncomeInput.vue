<template>
  <div class="annual-income-input">
    <div class="annual-income-input__main">
      <span class="annual-income-input__prefix">およそ</span>
      <input
        :value="modelValue"
        type="number"
        class="annual-income-input__field"
        @input="handleInput"
        @keydown.enter.prevent
      />
      <span class="annual-income-input__suffix">万円くらい</span>
    </div>

    <div class="annual-income-input__controls">
      <!-- 10万円単位 -->
      <div class="annual-income-input__row">
        <button
          type="button"
          class="annual-income-input__button annual-income-input__button--minus"
          @click="adjustIncome(-10)"
          aria-label="10万円減らす"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <span class="annual-income-input__label">10万円</span>
        
        <button
          type="button"
          class="annual-income-input__button annual-income-input__button--plus"
          @click="adjustIncome(10)"
          aria-label="10万円増やす"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="5" x2="10" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- 50万円単位 -->
      <div class="annual-income-input__row">
        <button
          type="button"
          class="annual-income-input__button annual-income-input__button--minus"
          @click="adjustIncome(-50)"
          aria-label="50万円減らす"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <span class="annual-income-input__label">50万円</span>
        
        <button
          type="button"
          class="annual-income-input__button annual-income-input__button--plus"
          @click="adjustIncome(50)"
          aria-label="50万円増やす"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="5" x2="10" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- 100万円単位 -->
      <div class="annual-income-input__row">
        <button
          type="button"
          class="annual-income-input__button annual-income-input__button--minus"
          @click="adjustIncome(-100)"
          aria-label="100万円減らす"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <span class="annual-income-input__label">100万円</span>
        
        <button
          type="button"
          class="annual-income-input__button annual-income-input__button--plus"
          @click="adjustIncome(100)"
          aria-label="100万円増やす"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="5" x2="10" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleSubmit = () => {
  emit('submit')
}

const adjustIncome = (amount: number) => {
  const currentValue = props.modelValue ? Number(props.modelValue) : 0
  const newValue = Math.max(0, currentValue + amount) // 0未満にならないように
  emit('update:modelValue', String(newValue))
}

// 表示用のフォーマット
const displayAmount = computed(() => {
  if (!props.modelValue) return ''
  const value = Number(props.modelValue)
  if (isNaN(value)) return ''
  return `${value.toLocaleString()}万円`
})
</script>

<style lang="scss" scoped>
.annual-income-input {
  max-width: 500px;
  margin: 0 auto;

  &__main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-xl;
  }

  &__prefix {
    font-size: 20px;
    font-weight: 500;
    color: $text-secondary;
  }

  &__field {
    width: 120px;
    padding: $spacing-md $spacing-lg;
    font-size: 20px;
    font-weight: 600;
    border: 2px solid $border-color;
    border-radius: $radius-md;
    background: $bg-primary;
    text-align: center;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $primary;
    }

    // 数値入力のスピナーを非表示
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &[type=number] {
      -moz-appearance: textfield;
    }
  }

  &__suffix {
    font-size: 20px;
    font-weight: 500;
    color: $text-secondary;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-lg;
  }

  &__label {
    min-width: 100px;
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    text-align: center;
  }

  &__button {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid $border-color;
    border-radius: 50%;
    background: $bg-primary;
    cursor: pointer;
    transition: all 0.2s ease;
    color: $text-secondary;

    &:hover {
      transform: scale(1.1);
      border-color: $primary;
      background: #FFF4CC;
    }

    &:active {
      transform: scale(0.95);
    }

    &--plus {
      color: $primary;
      border-color: rgba($primary, 0.3);
      
      &:hover {
        background: $primary;
        border-color: $primary;
        color: white;
        box-shadow: 0 4px 12px rgba($primary, 0.3);
      }
    }

    &--minus {
      color: $text-secondary;
      
      &:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
        color: #374151;
      }
    }

    svg {
      display: block;
    }
  }

  &__display {
    text-align: center;
    font-size: $font-size-base;
    color: $text-secondary;
    margin-top: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $border-color;

    strong {
      color: $primary;
      font-size: $font-size-xl;
      margin-left: $spacing-xs;
    }
  }
}
</style>
