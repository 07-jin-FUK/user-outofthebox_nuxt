<template>
  <div class="account-info-input">
    <div class="account-info-input__field">
      <label class="account-info-input__label">メールアドレス</label>
      <input
        :value="modelValue.email"
        type="email"
        placeholder="例: example@email.com"
        class="account-info-input__input"
        @input="handleInput('email', $event)"
        @keydown.enter.prevent
      />
    </div>

    <div class="account-info-input__field">
      <label class="account-info-input__label">パスワード</label>
      <div class="account-info-input__password-wrapper">
        <input
          :value="modelValue.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="8文字以上の英数字"
          class="account-info-input__input account-info-input__input--password"
          @input="handleInput('password', $event)"
          @keydown.enter.prevent
        />
        <button
          type="button"
          class="account-info-input__toggle"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'パスワードを隠す' : 'パスワードを表示'"
        >
          <!-- 表示中（目を開いている） -->
          <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12.5" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          
          <!-- 非表示中（目を閉じている） -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L21 21M10.5 10.677C10.0353 11.1532 9.75 11.8022 9.75 12.5195C9.75 13.9192 10.8954 15.0195 12.25 15.0195C12.9582 15.0195 13.5985 14.7447 14.0688 14.2952M7.36 7.561C5.68 8.742 4.279 10.42 3.5 12.5C5.5 17.5 8.5 20 12 20C13.659 20 15.192 19.549 16.548 18.776M19.558 16.35C20.939 15.120 22.073 13.42 22.5 12.5C20.5 7.5 17.5 5 14 5C13.3 5 12.609 5.07 11.937 5.207" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <p class="account-info-input__note">
      ※ メールアドレスとパスワードは次回ログイン時に使用します
    </p>

    <!-- SMS認証セクション -->
    <div class="account-info-input__divider">
      <div class="account-info-input__sms-section">
        <p class="account-info-input__sms-title">SMSにて認証を行います</p>
        <p class="account-info-input__sms-description">
          SMS認証コードを受け取れる電話番号を記載ください
        </p>
      </div>
    </div>

    <div class="account-info-input__field">
      <input
        :value="modelValue.phone"
        type="tel"
        placeholder="例: 09012345678"
        class="account-info-input__input"
        @input="handleInput('phone', $event)"
        @keydown.enter.prevent
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: {
    email: string
    password: string
    phone: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { email: string; password: string; phone: string }]
}>()

const showPassword = ref(false)

const handleInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: target.value
  })
}
</script>

<style lang="scss" scoped>
.account-info-input {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__field {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-primary;
  }

  &__password-wrapper {
    position: relative;
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

    &--password {
      padding-right: 48px;
    }
  }

  &__toggle {
    position: absolute;
    right: $spacing-sm;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: $spacing-xs;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-muted;
    transition: color 0.2s ease;

    &:hover {
      color: $text-primary;
    }

    &:focus {
      outline: none;
      color: $primary;
    }

    svg {
      display: block;
    }
  }

  &__note {
    font-size: 12px;
    color: $text-muted;
    line-height: 1.6;
    margin-top: -#{$spacing-sm};
  }

  &__divider {
    margin: $spacing-xl 0 0;
    padding-top: $spacing-xl;
    border-top: 2px solid $border-color;
  }

  &__sms-section {
    text-align: center;
  }

  &__sms-title {
    font-size: $font-size-lg;
    font-weight: 700;
    color: $primary;
    margin-bottom: $spacing-xs;
  }

  &__sms-description {
    font-size: $font-size-sm;
    color: $text-secondary;
    font-weight: 500;
  }
}
</style>
