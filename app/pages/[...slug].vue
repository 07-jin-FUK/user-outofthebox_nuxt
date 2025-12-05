<template>
  <div class="not-found">
    <div class="not-found__bg">
      <div class="not-found__circle not-found__circle--1"></div>
      <div class="not-found__circle not-found__circle--2"></div>
      <div class="not-found__circle not-found__circle--3"></div>
    </div>

    <div class="not-found__content">

      <h1 class="not-found__code">404</h1>
      <h2 class="not-found__title">お探しのページが見つかりません</h2>
      <p class="not-found__message">
        このページは移動したか、削除された可能性があります。
      </p>

      <div class="not-found__actions">
        <NuxtLink to="/" class="not-found__btn not-found__btn--primary">
          トップページへ戻る
        </NuxtLink>
        <NuxtLink to="/onboarding" class="not-found__btn not-found__btn--secondary">
          プロフィール登録へ
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '404 - ページが見つかりません'
})
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  overflow: hidden;
  padding: $spacing-xl;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.3;

    &--1 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      top: -100px;
      left: -100px;
      animation: float 8s ease-in-out infinite;
    }

    &--2 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #fde047 0%, #facc15 100%);
      bottom: -50px;
      right: -50px;
      animation: float 6s ease-in-out infinite reverse;
    }

    &--3 {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      top: 50%;
      right: 20%;
      animation: float 7s ease-in-out infinite 1s;
    }
  }

  &__content {
    text-align: center;
    position: relative;
    z-index: 1;
    max-width: 600px;
  }

  &__illustration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
  }

  &__person {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: bounce 2s ease-in-out infinite;

    &--seeker {
      animation-delay: 0s;
    }

    &--agent {
      animation-delay: 0.5s;
    }
  }

  &__avatar {
    width: 80px;
    height: 80px;
    background: #fbbf24;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3);
    margin-bottom: $spacing-sm;
    border: 3px solid #1a1a1a;
  }

  &__label {
    font-size: $font-size-sm;
    color: #a3a3a3;
    font-weight: 500;
  }

  &__connection {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 $spacing-md;
  }

  &__line {
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #fbbf24 0%, #ef4444 50%, #fbbf24 100%);
    border-radius: 2px;
    position: relative;
    opacity: 0.7;
  }

  &__x {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #1a1a1a;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
    font-weight: bold;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border: 2px solid #fbbf24;
    animation: pulse 1.5s ease-in-out infinite;
  }

  &__status {
    font-size: 12px;
    color: #737373;
    margin-top: $spacing-sm;
    white-space: nowrap;
  }

  &__code {
    font-size: 120px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: $spacing-md;
    background: linear-gradient(135deg, #fbbf24 0%, #fde047 50%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: glow 3s ease-in-out infinite;
    text-shadow: 0 0 40px rgba(251, 191, 36, 0.3);
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: $spacing-md;
  }

  &__message {
    font-size: $font-size-base;
    color: #a3a3a3;
    line-height: 1.8;
    margin-bottom: $spacing-xl;
  }

  &__actions {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: $spacing-xl;
  }

  &__btn {
    padding: $spacing-lg $spacing-xl;
    border-radius: $radius-lg;
    font-weight: 600;
    font-size: $font-size-base;
    text-decoration: none;
    transition: all 0.3s ease;
      display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

    &--primary {
      background: #fbbf24;
      color: #1a1a1a;
      box-shadow: 0 4px 14px rgba(251, 191, 36, 0.4);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
        background: #fde047;
      }
    }

    &--secondary {
      background: transparent;
      color: #fbbf24;
      border: 2px solid #fbbf24;

      &:hover {
        background: rgba(251, 191, 36, 0.1);
        transform: translateY(-2px);
      }
    }
  }

  &__hint {
    padding: $spacing-md $spacing-lg;
    background: rgba(251, 191, 36, 0.1);
    border-radius: $radius-lg;
    display: inline-block;
    border: 1px solid rgba(251, 191, 36, 0.2);

    p {
      font-size: $font-size-sm;
      color: #fbbf24;
      margin: 0;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes glow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

@media (max-width: 767px) {
  .not-found {
    &__code {
      font-size: 80px;
    }

    &__illustration {
      flex-direction: column;
    }

    &__connection {
      transform: rotate(90deg);
      margin: $spacing-md 0;
    }

    &__avatar {
      width: 60px;
      height: 60px;
      font-size: 28px;
    }
  }
}
</style>
