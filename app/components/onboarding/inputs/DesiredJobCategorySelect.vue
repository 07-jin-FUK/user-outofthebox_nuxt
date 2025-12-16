<template>
  <div class="desired-job-category-select">
    <!-- 大分類選択 -->
    <div v-if="!selectedLarge" class="category-cards">
      <button
        v-for="large in categories"
        :key="large.value"
        type="button"
        class="category-card"
        @click="selectLarge(large)"
      >
        <span class="category-card__label">{{ large.label }}</span>
        <span class="category-card__arrow">›</span>
      </button>
    </div>

    <!-- 小分類選択 -->
    <div v-else class="category-detail">
      <div class="category-detail__header">
        <button
          type="button"
          class="category-detail__back"
          @click="selectedLarge = null"
        >
          ← 戻る
        </button>
        <p class="category-detail__title">{{ selectedLarge.label }}</p>
      </div>

      <div class="category-cards">
        <button
          v-for="small in selectedLarge.children"
          :key="small.value"
          type="button"
          class="category-card"
          :class="{ 'category-card--selected': modelValue.small === small.value }"
          @click="selectSmall(small)"
        >
          <span class="category-card__label">{{ small.label }}</span>
        </button>
      </div>
    </div>

    <!-- 選択済み表示 -->
    <div v-if="modelValue.large && modelValue.small" class="selected-display">
      <p class="selected-display__text">
        {{ getLargeLabel(modelValue.large) }} > {{ getSmallLabel(modelValue.large, modelValue.small) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface SmallCategory {
  value: string
  label: string
}

interface LargeCategory {
  value: string
  label: string
  children: SmallCategory[]
}

const props = defineProps<{
  modelValue: {
    large: string
    small: string
  }
  categories: LargeCategory[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { large: string; small: string }]
  'submit': []
}>()

const selectedLarge = ref<LargeCategory | null>(null)

const selectLarge = (large: LargeCategory) => {
  selectedLarge.value = large
}

const selectSmall = (small: SmallCategory) => {
  emit('update:modelValue', {
    large: selectedLarge.value!.value,
    small: small.value
  })
  selectedLarge.value = null
  nextTick(() => {
    emit('submit')
  })
}

const getLargeLabel = (value: string) => {
  return props.categories.find(c => c.value === value)?.label || ''
}

const getSmallLabel = (largeValue: string, smallValue: string) => {
  const large = props.categories.find(c => c.value === largeValue)
  return large?.children.find(c => c.value === smallValue)?.label || ''
}
</script>

<style lang="scss" scoped>
.desired-job-category-select {
  max-width: 600px;
  margin: 0 auto;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.category-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-lg;
  background: white;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: #FFF4CC;
  }

  &--selected {
    background: #FFFBF0;
    border-color: $primary;
  }

  &__label {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 500;
  }

  &__arrow {
    font-size: 20px;
    color: $text-muted;
  }
}

.category-detail {
  &__header {
    margin-bottom: $spacing-lg;
    text-align: center;
  }

  &__back {
    background: none;
    border: none;
    color: $primary;
    font-size: $font-size-sm;
    cursor: pointer;
    padding: $spacing-xs;
    margin-bottom: $spacing-sm;

    &:hover {
      text-decoration: underline;
    }
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
  }
}

.selected-display {
  margin-top: $spacing-lg;
  padding: $spacing-md;
  background: #FFFBF0;
  border-left: 4px solid $primary;
  border-radius: $radius-sm;

  &__text {
    font-size: $font-size-sm;
    color: $text-secondary;
    font-weight: 500;
  }
}
</style>
