<template>
  <div class="select-cards-with-filter">
    <!-- 主要都市セクション -->
    <div v-if="majorCities.length > 0" class="city-section">
      <h3 class="city-section__title">主要都市</h3>
      <div class="select-cards select-cards--single">
        <button
          v-for="option in majorCities"
          :key="option.value"
          class="select-cards__item"
          :class="{ 'select-cards__item--selected': modelValue === option.value }"
          @click="handleSelect(option.value)"
        >
          <span class="select-cards__label">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- 50音リストセクション -->
    <div class="city-section">
      <h3 class="city-section__title">50音リストからさがす</h3>
      
      <!-- 50音フィルタ -->
      <div class="filter-buttons">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="filter-buttons__item"
          :class="{ 'filter-buttons__item--active': activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- カード選択 -->
      <div class="select-cards">
        <button
          v-for="option in filteredRegularCities"
          :key="option.value"
          class="select-cards__item"
          :class="{ 'select-cards__item--selected': modelValue === option.value }"
          @click="handleSelect(option.value)"
        >
          <span class="select-cards__label">{{ option.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Option {
  value: string
  label: string
  kana?: string
  isMajor?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: string
  options?: Option[]
}>(), {
  modelValue: '',
  options: () => []
})

const emit = defineEmits(['update:modelValue', 'submit'])

// 50音フィルタ
const filters = [
  { value: 'all', label: 'あ' },
  { value: 'ka', label: 'か' },
  { value: 'sa', label: 'さ' },
  { value: 'ta', label: 'た' },
  { value: 'na', label: 'な' },
  { value: 'ha', label: 'は' },
  { value: 'ma', label: 'ま' },
  { value: 'ya', label: 'や' },
  { value: 'ra', label: 'ら' },
  { value: 'wa', label: 'わ' }
]

const activeFilter = ref('all')

// 主要都市
const majorCities = computed(() => {
  return props.options.filter(opt => opt.isMajor)
})

// 通常の市区町村
const regularCities = computed(() => {
  return props.options.filter(opt => !opt.isMajor)
})

// フィルタリングされた通常の市区町村
const filteredRegularCities = computed(() => {
  if (activeFilter.value === 'all') {
    return regularCities.value
  }
  
  // TODO: API側でkanaフィールドを返してもらい、それを使ってフィルタリング
  return regularCities.value
})

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  nextTick(() => {
    emit('submit')
  })
}
</script>

<style lang="scss" scoped>
.select-cards-with-filter {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.city-section {
  margin-bottom: $spacing-xl;

  &__title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
    padding-left: $spacing-sm;
    // border-left: 4px solid $primary;
  }
}

.filter-buttons {
  display: flex;
  gap: $spacing-xs;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  justify-content: center;

  &__item {
    width: 40px;
    height: 40px;
    font-size: $font-size-sm;
    border: 1px solid $border-color;
    border-radius: 50%;
    background: $bg-primary;
    color: $text-secondary;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &--active {
      background: $primary;
      color: white;
      font-weight: 600;
    }
  }
}

.select-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  max-height: 400px;
  overflow-y: auto;
  padding: $spacing-sm;

  // 主要都市用(1列表示)
  &--single {
    grid-template-columns: 1fr;
    max-height: none;
  }

  &__item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: $spacing-sm $spacing-xl;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;

    &:hover {
      background-color: #FFF4CC;
    }

    &--selected {
      background-color:  #FFFBF0;
    }
  }

  &__label {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
  }
}
</style>
