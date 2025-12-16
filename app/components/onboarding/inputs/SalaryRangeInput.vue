<template>
  <div class="salary-range-input">
    <div class="salary-range-input__row">
      <div class="salary-range-input__field">
        <input
          :value="modelValue.min"
          type="number"
          placeholder="下限"
          class="salary-range-input__input"
          @input="handleInput('min', $event)"
          @keydown.enter.prevent
        />
        <span class="salary-range-input__unit">万円</span>
      </div>

      <span class="salary-range-input__separator">〜</span>

      <div class="salary-range-input__field">
        <input
          :value="modelValue.max"
          type="number"
          placeholder="上限"
          class="salary-range-input__input"
          @input="handleInput('max', $event)"
          @keydown.enter.prevent
        />
        <span class="salary-range-input__unit">万円</span>
      </div>
    </div>

    <p class="salary-range-input__note">
      ※ 希望する年収の範囲を入力してください
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    min: string
    max: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { min: string; max: string }]
}>()

const handleInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: target.value
  })
}
</script>

<style lang="scss" scoped>
.salary-range-input {
  max-width: 400px;
  margin: 0 auto;

  &__row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }

  &__field {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  &__input {
    width: 120px;
    padding: $spacing-md;
    font-size: $font-size-base;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    background: $bg-primary;
    text-align: right;

    &:focus {
      outline: none;
      border-color: $primary;
    }

    &::placeholder {
      color: $text-muted;
      text-align: center;
    }

    // 数字入力のスピナーを非表示
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &[type=number] {
      -moz-appearance: textfield;
    }
  }

  &__unit {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-secondary;
  }

  &__separator {
    font-size: $font-size-lg;
    color: $text-secondary;
  }

  &__note {
    font-size: 12px;
    color: $text-muted;
    text-align: center;
    line-height: 1.6;
  }
}
</style>
