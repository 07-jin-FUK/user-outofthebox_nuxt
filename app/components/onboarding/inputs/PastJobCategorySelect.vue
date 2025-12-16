<template>
  <div class="past-job-category-select">
    <!-- キーワード検索 -->
<!-- キーワード検索 -->
<div class="search-section">
  <div class="search-wrapper">
    <input
      v-model="searchKeyword"
      type="text"
      placeholder="例:営業、販売、事務、ドライバー、介護など"
      class="search-input"
      @keydown.enter.prevent
      @focus="showSearchResults = true"
      @blur="setTimeout(() => showSearchResults = false, 200)"
    />
    
    <!-- 検索結果ドロップダウン -->
    <transition name="dropdown">
      <div
        v-if="showSearchResults && searchResults.length > 0"
        class="search-results"
      >
        <button
          v-for="(result, index) in searchResults"
          :key="index"
          type="button"
          class="search-result-item"
          @click="selectFromSearch(result.large, result.medium, result.small)"
        >
          <span class="search-result-item__category">
            {{ result.large.label }} > {{ result.medium.label }}
          </span>
          <span class="search-result-item__label">{{ result.small.label }}</span>
        </button>
      </div>
    </transition>

    <!-- 検索結果なし -->
    <div
      v-if="showSearchResults && searchKeyword && searchResults.length === 0"
      class="search-no-results"
    >
      該当する職種が見つかりませんでした
    </div>
  </div>
</div>

    <!-- カテゴリから探す -->
    <div class="category-section">
      <h3 class="category-section__title">カテゴリから探す</h3>
      
      <div class="accordion">
        <div
          v-for="large in categoryData"
          :key="large.value"
          class="accordion__item"
        >
          <!-- 大カテゴリヘッダー -->
<button
  type="button"
  class="accordion__header"
  :class="{ 'accordion__header--open': openLargeCategory === large.value }"
  @click="toggleLargeCategory(large.value)"
>
  <div class="accordion__header-text">
    <span>{{ large.label }}</span>
    <span class="accordion__header-icon">
      {{ openLargeCategory === large.value ? '−' : '+' }}
    </span>
  </div>
  <span class="accordion__header-subtitle">{{ large.subtitle }}</span>
</button>

          <!-- 中カテゴリリスト -->
          <transition name="accordion-content">
            <div
              v-if="openLargeCategory === large.value"
              class="accordion__content"
            >
              <button
                v-for="medium in large.children"
                :key="medium.value"
                type="button"
                class="medium-item"
                @click="openModal(large, medium)"
              >
                <span class="medium-item__text">{{ medium.label }}</span>
                <span class="medium-item__icon">+</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- モーダル -->
    <transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal__header">
            <h3 class="modal__title">
              あなたが経験してきた<span class="modal__title-highlight">職種をすべて</span>教えてください
            </h3>
            <p class="modal__subtitle">{{ currentMedium?.label }}</p>
            <button
              type="button"
              class="modal__close"
              @click="closeModal"
              aria-label="閉じる"
            >
              ×
            </button>
          </div>

          <div class="modal__body">
            <div class="checkbox-list">
              <label
                v-for="small in currentMedium?.children"
                :key="small.value"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :value="small.value"
                  :checked="isSmallCategorySelected(small.value)"
                  @change="toggleSmallCategory(small)"
                />
                <span class="checkbox-item__text">{{ small.label }}</span>
              </label>
            </div>
          </div>

          <div class="modal__footer">
            <button
              type="button"
              class="btn btn--secondary"
              @click="closeModal"
            >
              戻る
            </button>
            <button
              type="button"
              class="btn btn--primary"
              @click="applySelection"
            >
              更新する
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SmallCategory {
  value: string
  label: string
}

interface MediumCategory {
  value: string
  label: string
  children: SmallCategory[]
}

interface LargeCategory {
  value: string
  label: string
  subtitle: string
  children: MediumCategory[]
}

interface SelectedItem {
  largeValue: string
  largeLabel: string
  mediumValue: string
  mediumLabel: string
  smallValue: string
  smallLabel: string
}

const props = defineProps<{
  modelValue: SelectedItem[]
  categoryData: LargeCategory[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SelectedItem[]]
}>()

const searchKeyword = ref('')
const openLargeCategory = ref<string | null>(null)
const isModalOpen = ref(false)
const currentLarge = ref<LargeCategory | null>(null)
const currentMedium = ref<MediumCategory | null>(null)
const tempSelectedSmall = ref<string[]>([])


// 大カテゴリの開閉
const toggleLargeCategory = (value: string) => {
  openLargeCategory.value = openLargeCategory.value === value ? null : value
}

const selectedItems = computed(() => {
  // modelValueが配列でない場合は空配列を返す
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

// モーダルを開く
const openModal = (large: LargeCategory, medium: MediumCategory) => {
  currentLarge.value = large
  currentMedium.value = medium
  
  // 既に選択されている小カテゴリを取得
  tempSelectedSmall.value = selectedItems.value
    .filter(item => item.mediumValue === medium.value)
    .map(item => item.smallValue)
  
  isModalOpen.value = true
}

// モーダルを閉じる
const closeModal = () => {
  isModalOpen.value = false
  currentLarge.value = null
  currentMedium.value = null
  tempSelectedSmall.value = []
}

// 小カテゴリが選択されているか
const isSmallCategorySelected = (smallValue: string): boolean => {
  return tempSelectedSmall.value.includes(smallValue)
}

// 小カテゴリのトグル
const toggleSmallCategory = (small: SmallCategory) => {
  const index = tempSelectedSmall.value.indexOf(small.value)
  if (index > -1) {
    tempSelectedSmall.value.splice(index, 1)
  } else {
    tempSelectedSmall.value.push(small.value)
  }
}

// 選択を適用
const applySelection = () => {
  if (!currentLarge.value || !currentMedium.value) return

  // 現在の中カテゴリの選択をすべて削除
  const filtered = selectedItems.value.filter(
    item => item.mediumValue !== currentMedium.value!.value
  )

  // 新しい選択を追加
  const newItems: SelectedItem[] = tempSelectedSmall.value.map(smallValue => {
    const small = currentMedium.value!.children.find(c => c.value === smallValue)
    return {
      largeValue: currentLarge.value!.value,
      largeLabel: currentLarge.value!.label,
      mediumValue: currentMedium.value!.value,
      mediumLabel: currentMedium.value!.label,
      smallValue: smallValue,
      smallLabel: small?.label || ''
    }
  })

  emit('update:modelValue', [...filtered, ...newItems])
  closeModal()
}

// タグ削除
const removeTag = (index: number) => {
  const newItems = [...selectedItems.value]
  newItems.splice(index, 1)
  emit('update:modelValue', newItems)
}


const showSearchResults = ref(false)

// 検索結果を計算
const searchResults = computed(() => {
  if (!searchKeyword.value || searchKeyword.value.length < 1) {
    return []
  }

  const keyword = searchKeyword.value.toLowerCase()
  const results: Array<{
    large: LargeCategory
    medium: MediumCategory
    small: SmallCategory
  }> = []

  // 全階層を検索
  props.categoryData.forEach(large => {
    large.children.forEach(medium => {
      medium.children.forEach(small => {
        // 小カテゴリのラベルに検索キーワードが含まれているか
        if (small.label.includes(searchKeyword.value)) {
          results.push({ large, medium, small })
        }
      })
    })
  })

  return results
})

// 検索結果から選択
const selectFromSearch = (large: LargeCategory, medium: MediumCategory, small: SmallCategory) => {
  // 既に選択されているか確認
  const exists = selectedItems.value.some(
    item => item.smallValue === small.value
  )
  
  if (!exists) {
    const newItem: SelectedItem = {
      largeValue: large.value,
      largeLabel: large.label,
      mediumValue: medium.value,
      mediumLabel: medium.label,
      smallValue: small.value,
      smallLabel: small.label
    }
    emit('update:modelValue', [...selectedItems.value, newItem])
  }
  
  // 検索をクリア
  searchKeyword.value = ''
  showSearchResults.value = false
}

</script>

<style lang="scss" scoped>
.past-job-category-select {
  max-width: 600px;
  margin: 0 auto;
}

// キーワード検索
.search-section {
  margin-bottom: $spacing-xl;
}

.search-wrapper {
  position: relative;
}

.search-input {
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

.search-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.search-result-item {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid $border-color;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  &:hover {
    background: #FFF4CC;
  }

  &:last-child {
    border-bottom: none;
  }

  &__category {
    font-size: $font-size-sm;
    color: $text-muted;
  }

  &__label {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 500;
  }
}

.search-no-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  padding: $spacing-lg;
  text-align: center;
  background: white;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  color: $text-muted;
  font-size: $font-size-sm;
  z-index: 100;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// 選択済みタグ
.selected-tags {
  margin-bottom: $spacing-xl;
  padding: $spacing-lg;
  background: $bg-secondary;
  border-radius: $radius-md;

  &__title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-md;
  background: white;
  border: 1px solid $border-color;
  border-radius: 20px;
  font-size: $font-size-sm;

  &__text {
    color: $text-primary;
    font-weight: 500;
  }

  &__remove {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
      padding:0 0 5px 5px; 
    color: $text-muted;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    transition: color 0.2s ease;

    &:hover {
      color: #dc2626;
    }
  }
}

// カテゴリセクション
.category-section {
  &__title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }
}

// アコーディオン
.accordion {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &__item {
    border: 1px solid $border-color;
    border-radius: $radius-md;
    overflow: hidden;
    background: white;
  }

&__header {
  width: 100%;
  display: flex;
  flex-direction: column;  // ← 縦並びに変更
  align-items: flex-start;  // ← 左寄せに変更
  gap: $spacing-xs;  // ← 間隔追加
  padding: $spacing-md $spacing-lg;
  background: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;

  &:hover {
    background: $bg-secondary;
  }

  &--open {
    background: $bg-secondary;
    border-bottom: 1px solid $border-color;
  }
}

&__header-text {
  font-size: $font-size-base;
  font-weight: 600;
  color: $text-primary;
  width: 100%;  // ← 幅いっぱいに
  display: flex;
  justify-content: space-between;  // ← アイコンを右に
  align-items: center;
}

&__header-subtitle {
  font-size: 12px;
  color: $text-muted;
  line-height: 1.4;  
  padding-right: 40px;  // ← 右側に余白を追加(＋ボタン分)
  width: 100%; 
}

&__header-icon {
  font-size: 20px;
  color: $primary;
  font-weight: bold;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;  // ← 縮まないように
}

  &__content {
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
}

// 中カテゴリアイテム
.medium-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-sm $spacing-md;
  background: $bg-primary;
  border-radius: $radius-sm;
  border:none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: #FFF4CC;
  }

  &__text {
    font-size: $font-size-sm;
    color: $text-primary;
  }

  &__icon {
    font-size: 18px;
    color: $primary;
    font-weight: bold;
  }
}

// モーダル
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-lg;
}

.modal {
  background: white;
  border-radius: $radius-lg;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  &__header {
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color;
    position: relative;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    padding-right: $spacing-xl;
  }

  &__title-highlight {
    color: $primary;
  }

  &__subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  &__close {
    position: absolute;
    top: $spacing-lg;
    right: $spacing-lg;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    font-size: 24px;
    color: $text-muted;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: $text-primary;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-lg;
  }

  &__footer {
    padding: $spacing-lg;
    border-top: 1px solid $border-color;
    display: flex;
    gap: $spacing-md;
    justify-content: flex-end;
  }
}

// チェックボックスリスト
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: $bg-secondary;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #FFC700; 
  }

  &__text {
    font-size: $font-size-base;
    color: $text-primary;
  }
}

// アニメーション
.accordion-content-enter-active,
.accordion-content-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.accordion-content-enter-from,
.accordion-content-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-content-enter-to,
.accordion-content-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9);
}
</style>
