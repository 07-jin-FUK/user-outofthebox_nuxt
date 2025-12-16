<template>
  <div class="sms-code-input">
    <div class="sms-code-input__fields">
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="el => inputRefs[index] = el"
        
        v-model="digits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="sms-code-input__field"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
      />
    </div>
    
<p class="sms-code-input__note">
  ※ {{ phoneNumber }} に送信されたSMS認証コードを入力してください
</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  phoneNumber?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()

const digits = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])

// modelValueから初期値を復元
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.length === 6) {
    digits.value = newValue.split('')
  }
}, { immediate: true })

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '') // 数字のみ
  
  digits.value[index] = value
  
  // 数字が入力されたら次の入力欄にフォーカス
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
  
  // 6桁揃ったら親に通知
  const code = digits.value.join('')
  emit('update:modelValue', code)
  
  if (code.length === 6) {
    emit('submit')
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  // Backspaceで前の入力欄に戻る
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '')
  
  if (pastedData && pastedData.length === 6) {
    digits.value = pastedData.split('')
    emit('update:modelValue', pastedData)
    emit('submit')
  }
}
</script>

<style lang="scss" scoped>
.sms-code-input {
  max-width: 400px;
  margin: 0 auto;

  &__fields {
    display: flex;
    gap: $spacing-sm;
    justify-content: center;
    margin-bottom: $spacing-lg;
  }

  &__field {
    width: 48px;
    height: 56px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    border: 2px solid $border-color;
    border-radius: $radius-md;
    background: $bg-primary;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $primary;
    }

    // 数字入力のスピナーを非表示
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__note {
    font-size: 12px;
    color: $text-muted;
    text-align: center;
    line-height: 1.6;
  }
}
</style>
