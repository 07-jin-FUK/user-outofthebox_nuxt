<template>
  <div class="select-school-with-search">
    <!-- 学校名を入力して探すセクション -->
    <div class="school-section">
      <h3 class="school-section__title">学校名を入力して探す</h3>
      <div class="school-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="学校名を入力"
          class="school-search__input"
          @input="handleSearch"
          @focus="showSearchResults = true"
        />
        <!-- 検索結果のドロップダウン -->
        <div 
          v-if="showSearchResults && searchQuery && searchResults.length > 0" 
          class="school-search__results"
        >
          <button
            v-for="option in searchResults"
            :key="option.value"
            class="school-search__result-item"
            @click="handleSelectFromSearch(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <div 
          v-if="showSearchResults && searchQuery && searchResults.length === 0"
          class="school-search__no-results"
        >
          該当する学校が見つかりませんでした
        </div>
      </div>
    </div>

    <!-- 50音リストからさがすセクション -->
    <div class="school-section">
      <h3 class="school-section__title">50音リストからさがす</h3>
      
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
          v-for="option in filteredSchools"
          :key="option.value"
          class="select-cards__item"
          :class="{ 'select-cards__item--selected': modelValue === option.value }"
          @click="handleSelect(option.value)"
        >
          <span class="select-cards__label">{{ option.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- オーバーレイ(検索結果を閉じる用) -->
    <div 
      v-if="showSearchResults && searchQuery"
      class="search-overlay"
      @click="showSearchResults = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Option {
  value: string
  label: string
  kana?: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  options?: Option[]
}>(), {
  modelValue: '',
  options: () => []
})

const emit = defineEmits(['update:modelValue', 'submit'])

const searchQuery = ref('')
const activeFilter = ref('all')
const showSearchResults = ref(false)

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

// 検索結果(インプット下に表示)
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  return props.options.filter(opt => 
    opt.label.includes(searchQuery.value)
  )
})

// フィルタリングされた学校リスト(50音用)
const filteredSchools = computed(() => {
  if (activeFilter.value === 'all') {
    return props.options
  }
  
  // TODO: API側でkanaフィールドを返してもらい、それを使ってフィルタリング
  return props.options
})

const handleSearch = () => {
  showSearchResults.value = true
}

const handleSelectFromSearch = (value: string) => {
  emit('update:modelValue', value)
  searchQuery.value = ''
  showSearchResults.value = false
  nextTick(() => {
    emit('submit')
  })
}

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  nextTick(() => {
    emit('submit')
  })
}
</script>

<style lang="scss" scoped>
.select-school-with-search {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.school-section {
  margin-bottom: $spacing-xl;

  &__title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
    padding-left: $spacing-sm;
  }
}

.school-search {
  position: relative;

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

  &__results {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: $bg-primary;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: $shadow-lg;
    z-index: 100;
  }

  &__result-item {
    width: 100%;
    padding: $spacing-md;
    text-align: left;
    background: none;
    border: none;
    border-bottom: 1px solid $border-color;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: $bg-secondary;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__no-results {
    padding: $spacing-lg;
    text-align: center;
    color: $text-muted;
    font-size: $font-size-sm;
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: $bg-primary;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    z-index: 100;
  }
}

.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 99;
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
      border-color: $primary;
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

  overflow-y: auto;
  padding: $spacing-sm;

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
