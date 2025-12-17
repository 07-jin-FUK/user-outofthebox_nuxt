<template>
  <div class="full-name-input">
    <!-- 姓名 -->
    <div class="full-name-input__row">
      <div class="full-name-input__field">
        <label class="full-name-input__label">姓</label>
        <input
          :value="modelValue.lastName"
          type="text"
          placeholder="例: 山田"
          class="full-name-input__input"
          @input="handleInput('lastName', $event)"
          @keydown.enter.prevent
        />
      </div>

      <div class="full-name-input__field">
        <label class="full-name-input__label">名</label>
        <input
          :value="modelValue.firstName"
          type="text"
          placeholder="例: 太郎"
          class="full-name-input__input"
          @input="handleInput('firstName', $event)"
          @keydown.enter.prevent
        />
      </div>
    </div>

    <!-- セイメイ -->
    <div class="full-name-input__row">
      <div class="full-name-input__field">
        <label class="full-name-input__label">セイ</label>
        <input
          :value="modelValue.lastNameKana"
          type="text"
          placeholder="例: ヤマダ"
          class="full-name-input__input"
          @input="handleInput('lastNameKana', $event)"
          @keydown.enter.prevent
        />
      </div>

      <div class="full-name-input__field">
        <label class="full-name-input__label">メイ</label>
        <input
          :value="modelValue.firstNameKana"
          type="text"
          placeholder="例: タロウ"
          class="full-name-input__input"
          @input="handleInput('firstNameKana', $event)"
          @keydown.enter.prevent
        />
      </div>
    </div>
       <p class="full-name-input__note">
      本名は情報を開示する企業以外に知られることはございません。
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    lastName: string
    firstName: string
    lastNameKana: string
    firstNameKana: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { lastName: string; firstName: string; lastNameKana: string; firstNameKana: string }]
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
.full-name-input {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-primary;
    text-align: left;
  }

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
    &__note {
    font-size: 12px;
    color: $text-muted;
    line-height: 1.6;
    text-align: center;
    margin-top: -$spacing-sm;  // 上のフィールドとの間隔を調整
    
    &::before {
      content: '※ ';
    }
  }
}


</style>
