<template>
  <div class="text-input-with-notes">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="text-input-with-notes__input"
      @input="handleInput"
      @keydown.enter="handleKeydown"
      @compositionstart="isComposing = true"
      @compositionend="isComposing = false"
    />
    
    <div v-if="notes && notes.length > 0" class="text-input-with-notes__notes">
      <p v-for="(note, index) in notes" :key="index" class="text-input-with-notes__note">
        {{ note }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  notes?: string[]
}>(), {
  modelValue: '',
  placeholder: '',
  notes: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  // IME変換中はsubmitしない
  if (isComposing.value) return
  emit('submit')
}
</script>

<style lang="scss" scoped>
.text-input-with-notes {
  max-width: 600px;
  margin: 0 auto;

  &__input {
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

  &__notes {
    margin-top: $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__note {
    font-size: 12px;
    color: $text-muted;
    line-height: 1.6;
    text-align: left;
    
    &::before {
      content: '※ ';
    }
  }
}
</style>
