<template>
  <div class="textarea-input">
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      class="textarea-input__field"
      rows="8"
      @input="handleInput"
    />
    
    <div v-if="notes && notes.length > 0" class="textarea-input__notes">
      <p v-for="(note, index) in notes" :key="index" class="textarea-input__note">
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
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss" scoped>
.textarea-input {
  max-width: 600px;
  margin: 0 auto;

  &__field {
    width: 100%;
    padding: $spacing-md;
    font-size: $font-size-base;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    background: $bg-primary;
    resize: vertical;
    font-family: inherit;
    line-height: 1.6;

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
