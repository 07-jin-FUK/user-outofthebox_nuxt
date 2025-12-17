<template>
  <div class="desired-job-category-select">
    <!-- 選択済みタグ表示 -->
    <!-- <div v-if="selectedItems.length > 0" class="selected-tags">
      <div class="selected-tags__list">
        <div
          v-for="(item, index) in selectedItems"
          :key="index"
          class="tag"
        >
          <span class="tag__text">{{ item.smallLabel }}</span>
          <button
            type="button"
            class="tag__remove"
            @click="removeTag(index)"
            aria-label="削除"
          >
            ×
          </button>
        </div>
      </div>
    </div> -->

    <!-- 大分類選択 -->
    <div class="category-cards">
      <button
        v-for="large in categoryData"
        :key="large.value"
        type="button"
        class="category-card"
        @click="openModal(large)"
      >
        <span class="category-card__label">{{ large.label }}</span>
        <span class="category-card__icon">+</span>
      </button>
    </div>

    <!-- モーダル -->
    <transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal__header">
            <h3 class="modal__title">
              転職したい<span class="modal__title-highlight">職種をすべて</span>教えてください
            </h3>
            <p class="modal__subtitle">{{ currentLarge?.label }}</p>
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
                v-for="small in currentLarge?.children"
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
              追加する
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

interface LargeCategory {
  value: string
  label: string
  children: SmallCategory[]
}

interface SelectedItem {
  largeValue: string
  largeLabel: string
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

const isModalOpen = ref(false)
const currentLarge = ref<LargeCategory | null>(null)
const tempSelectedSmall = ref<string[]>([])

const selectedItems = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

// モーダルを開く
const openModal = (large: LargeCategory) => {
  currentLarge.value = large
  
  // 既に選択されている小カテゴリを取得
  tempSelectedSmall.value = selectedItems.value
    .filter(item => item.largeValue === large.value)
    .map(item => item.smallValue)
  
  isModalOpen.value = true
}

// モーダルを閉じる
const closeModal = () => {
  isModalOpen.value = false
  currentLarge.value = null
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
  if (!currentLarge.value) return

  // 現在の中カテゴリの選択をすべて削除
  const filtered = selectedItems.value.filter(
    item => item.largeValue !== currentLarge.value!.value
  )

  // 新しい選択を追加
  const newItems: SelectedItem[] = tempSelectedSmall.value.map(smallValue => {
    const small = currentLarge.value!.children.find(c => c.value === smallValue)
    return {
      largeValue: currentLarge.value!.value,
      largeLabel: currentLarge.value!.label,
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
</script>

<style lang="scss" scoped>
.desired-job-category-select {
  max-width: 600px;
  margin: 0 auto;
}

// 選択済みタグ
.selected-tags {
  margin-bottom: $spacing-xl;

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
    padding: 0 0 5px 5px;
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

// カテゴリカード
.category-cards {
  display: grid;
   grid-template-columns: 1fr;  
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

  &__label {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 500;
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
