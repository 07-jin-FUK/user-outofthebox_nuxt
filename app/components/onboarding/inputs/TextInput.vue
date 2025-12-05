<template>
  <div class="text-input">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="text-input__field"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  type?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()
</script>

<style lang="scss" scoped>
.text-input {
  max-width: 400px;
  margin: 0 auto;

  &__field {
    width: 100%;
    padding: $spacing-md;
    font-size: $font-size-base;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    text-align: center;

    &:focus {
      outline: none;
      border-color: $primary;
    }

    &::placeholder {
      color: $text-muted;
    }
  }
}
</style>
