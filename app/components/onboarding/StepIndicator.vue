<template>
  <div class="step-indicator">
    <div 
      v-for="(step, index) in steps" 
      :key="step.id"
      class="step-indicator__item"
      :class="{ 
        'step-indicator__item--active': index === currentStep,
        'step-indicator__item--completed': index < currentStep
      }"
    >
      <span class="step-indicator__label">{{ step.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  id: string
  label: string
}

defineProps<{
  currentStep: number
  steps: Step[]
}>()
</script>

<style lang="scss" scoped>
.step-indicator {
  position: fixed;  
  top: 0;  
  left: 0;  
  right: 0;  
  z-index: 10;  
  display: flex;
  background: linear-gradient(to right, #4a4a4a 0%, #6b6b6b 100%);
  
  &__item {
    flex: 1;
    padding: $spacing-md $spacing-lg;
    text-align: center;
    color: rgba(255, 255, 255, 0.7); 
    font-size: $font-size-sm;
    position: relative;
    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%, 15px 50%);
    
    &:first-child {
      clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%);
    }
    
    &:last-child {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 15px 50%);
    }

&--active {
  background: #fbbf24;  // ← 黄色に変更
  color: #1a1a1a;  // ← 黒文字に変更
  font-weight: 600;
}
    &--completed {
      background: #2a2a2a;  // ← 完了した項目は少し濃いグレーに
      color: white;
    }
  }

  &__label {
    position: relative;
    z-index: 1;
  }
}
</style>
