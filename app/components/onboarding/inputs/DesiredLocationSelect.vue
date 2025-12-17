<template>
  <div class="desired-location-select">
    <!-- 居住地の通勤圏内から選ぶ -->
    <div v-if="nearbyPrefectures.length > 0" class="section">
      <h3 class="section__title">
        <span class="section__title-icon">|</span>
        居住地の通勤圏内から選ぶ
      </h3>
      <div class="checkbox-cards">
        <label
          v-for="pref in nearbyPrefectures"
          :key="pref.value"
          class="checkbox-card"
          :class="{ 'checkbox-card--selected': isSelected(pref.value) }"
        >
          <input
            type="checkbox"
            :value="pref.value"
            :checked="isSelected(pref.value)"
            @change="toggleSelection(pref.value, pref.label)"
          />
          <span class="checkbox-card__text">{{ pref.label }}</span>
        </label>
      </div>
    </div>

    <!-- 地域から選ぶ -->
    <div class="section">
      <h3 class="section__title">
        <span class="section__title-icon">|</span>
        地域から選ぶ
      </h3>
      
      <div class="accordion">
        <div
          v-for="region in regions"
          :key="region.value"
          class="accordion__item"
        >
          <!-- 地域ヘッダー -->
          <button
            type="button"
            class="accordion__header"
            :class="{ 'accordion__header--open': openRegion === region.value }"
            @click="toggleRegion(region.value)"
          >
            <div class="accordion__header-content">
              <div class="accordion__header-top">
                <span class="accordion__header-title">{{ region.label }}</span>
                <span class="accordion__header-icon">
                  {{ openRegion === region.value ? '−' : '+' }}
                </span>
              </div>
              <div v-if="getRegionSelectedCount(region.value) > 0" class="accordion__header-badge">
                {{ getRegionSelectedCount(region.value) }}件選択中
              </div>
              <p class="accordion__header-subtitle">{{ region.prefectures.map(p => p.label).join('／') }}</p>
            </div>
          </button>

          <!-- 都道府県リスト -->
          <transition name="accordion-content">
            <div
              v-if="openRegion === region.value"
              class="accordion__content"
            >
              <div class="checkbox-list">
                <label
                  v-for="pref in region.prefectures"
                  :key="pref.value"
                  class="checkbox-item"
                  :class="{ 'checkbox-item--selected': isSelected(pref.value) }"
                >
                  <input
                    type="checkbox"
                    :value="pref.value"
                    :checked="isSelected(pref.value)"
                    @change="toggleSelection(pref.value, pref.label)"
                  />
                  <span class="checkbox-item__text">{{ pref.label }}</span>
                </label>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- その他 -->
    <div class="section">
      <h3 class="section__title">
        <span class="section__title-icon">|</span>
        その他
      </h3>
      <label
        class="checkbox-card checkbox-card--full"
        :class="{ 'checkbox-card--selected': isSelected('no_preference') }"
      >
        <input
          type="checkbox"
          value="no_preference"
          :checked="isSelected('no_preference')"
          @change="toggleSelection('no_preference', '指定しない')"
        />
        <span class="checkbox-card__text">指定しない</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Prefecture {
  value: string
  label: string
}

interface Region {
  value: string
  label: string
  prefectures: Prefecture[]
}

interface SelectedLocation {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: SelectedLocation[]
  regions: Region[]
  currentPrefecture?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SelectedLocation[]]
}>()

const openRegion = ref<string | null>(null)

// 現在の都道府県の通勤圏内の都道府県を取得（ダミーロジック）
const nearbyPrefectures = computed(() => {
  if (!props.currentPrefecture) return []
  
  // TODO: 実際のロジックでは、currentPrefectureに基づいて通勤圏内の都道府県を返す
  // 例: 北海道なら北海道のみ、東京なら東京・神奈川・埼玉・千葉など
  const nearbyMap: Record<string, Prefecture[]> = {
    'hokkaido': [{ value: 'hokkaido', label: '北海道' }],
    'tokyo': [
      { value: 'tokyo', label: '東京都' },
      { value: 'kanagawa', label: '神奈川県' },
      { value: 'saitama', label: '埼玉県' },
      { value: 'chiba', label: '千葉県' }
    ],
    'osaka': [
      { value: 'osaka', label: '大阪府' },
      { value: 'hyogo', label: '兵庫県' },
      { value: 'kyoto', label: '京都府' }
    ]
  }
  
  return nearbyMap[props.currentPrefecture] || []
})

const selectedItems = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

const isSelected = (value: string): boolean => {
  return selectedItems.value.some(item => item.value === value)
}

const toggleSelection = (value: string, label: string) => {
  const index = selectedItems.value.findIndex(item => item.value === value)
  
  if (index > -1) {
    // 削除
    const newItems = [...selectedItems.value]
    newItems.splice(index, 1)
    emit('update:modelValue', newItems)
  } else {
    // 追加
    emit('update:modelValue', [...selectedItems.value, { value, label }])
  }
}

const toggleRegion = (regionValue: string) => {
  openRegion.value = openRegion.value === regionValue ? null : regionValue
}

// 地域内で選択されている件数を取得
const getRegionSelectedCount = (regionValue: string): number => {
  const region = props.regions.find(r => r.value === regionValue)
  if (!region) return 0
  
  return region.prefectures.filter(pref => 
    isSelected(pref.value)
  ).length
}
</script>

<style lang="scss" scoped>
.desired-location-select {
  max-width: 700px;
  margin: 0 auto;
}

.section {
  margin-bottom: $spacing-xl;

  &__title {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  &__title-icon {
    color: $primary;
    font-size: 20px;
    font-weight: bold;
  }
}

// チェックボックスカード（居住地の通勤圏内用）
.checkbox-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: white;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #FFF4CC;
  }

  &--selected {
    background: #FFFBF0;
    border-color: $primary;
  }

  &--full {
    grid-column: 1 / -1;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #FFC700;
  }

  &__text {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
  }
}

// アコーディオン
.accordion {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &__item {
    border: 1px solid $border-color;
    border-radius: $radius-md;
    overflow: hidden;
    background: white;
  }

  &__header {
    width: 100%;
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

  &__header-content {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__header-title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
  }

  &__header-badge {
    font-size: $font-size-sm;
    color: $primary;
    font-weight: 600;
  }

  &__header-subtitle {
    font-size: 12px;
    color: $text-muted;
    line-height: 1.4;
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
    flex-shrink: 0;
  }

  &__content {
    padding: $spacing-md;
  }
}

// チェックボックスリスト（アコーディオン内）
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
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

  &--selected {
    background: #FFFBF0;
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
</style>
