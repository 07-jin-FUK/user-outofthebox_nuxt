<template>
  <div class="certification-input">
    <!-- キーワード入力 -->
    <div class="certification-input__search">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="キーワードを入力（例：技能士）"
        class="certification-input__field"
        @keydown.enter.prevent
      />
    </div>

    <!-- 説明文 -->
    <div class="certification-input__notes">
      <p class="certification-input__note">
        資格名の一部を入力すると候補リストが表示されますので、<strong>該当するもの</strong>を選択してください。
      </p>
      <p class="certification-input__note">
        <strong>保有する資格が複数ある</strong>場合、お手数ですが<strong>1件ずつ</strong>入力してリストから選択してください。
      </p>
    </div>

    <!-- 資格は持っていないボタン -->
    <button
      type="button"
      class="certification-input__none-button"
      :class="{ 'certification-input__none-button--active': hasNoCertification }"
      @click="toggleNoCertification"
    >
      資格は持っていない
    </button>

    <!-- 追加している資格 -->
    <div v-if="selectedCertifications.length > 0" class="certification-input__selected">
      <h3 class="certification-input__selected-title">追加している資格</h3>
      <div class="certification-input__tags">
        <div
          v-for="(cert, index) in selectedCertifications"
          :key="index"
          class="certification-input__tag"
        >
          <span class="certification-input__tag-text">{{ cert }}</span>
          <button
            type="button"
            class="certification-input__tag-remove"
            @click="removeCertification(index)"
            aria-label="削除"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const searchKeyword = ref('')
const selectedCertifications = ref<string[]>(props.modelValue || [])
const hasNoCertification = ref(false)

// modelValueの変更を監視
watch(() => props.modelValue, (newValue) => {
  selectedCertifications.value = newValue || []
})

// selectedCertificationsの変更を親に通知
watch(selectedCertifications, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

const toggleNoCertification = () => {
  hasNoCertification.value = !hasNoCertification.value
  
  if (hasNoCertification.value) {
    // 資格なしを選択したら、既存の資格をクリア
    selectedCertifications.value = []
  }
}

const removeCertification = (index: number) => {
  selectedCertifications.value.splice(index, 1)
  
  // 資格を削除したら「資格なし」も解除
  if (selectedCertifications.value.length === 0) {
    hasNoCertification.value = false
  }
}

// TODO: 将来的にAPIから資格リストを取得して、キーワードで検索する機能を追加
// const searchCertifications = () => {
//   // API call to search certifications
// }
</script>

<style lang="scss" scoped>
.certification-input {
  max-width: 600px;
  margin: 0 auto;

  &__search {
    margin-bottom: $spacing-md;
  }

  &__field {
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

  &__notes {
    margin-bottom: $spacing-lg;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__note {
    font-size: 12px;
    color: #777777;
    line-height: 1.6;
    text-align: left;
    
    strong{
        color: #555555;
    }
    
    &::before {
      content: '※ ';
    }
  }

  &__none-button {
    width: 100%;
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-base;
    font-weight: 500;
    border: 2px solid $border-color;
    border-radius: $radius-md;
    background: #f3f4f6;
    color: $text-primary;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: $spacing-xl;

    &:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    &--active {
      background: #FFFBF0;
      border-color: $primary;
      color: $primary;
      font-weight: 600;
    }
  }

  &__selected {
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 1px solid $border-color;
  }

  &__selected-title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-xs $spacing-md;
    background: white;
    border: 1px solid $border-color;
    border-radius: 20px;
    font-size: $font-size-sm;
    color: $text-primary;
  }

  &__tag-text {
    font-weight: 500;
  }

  &__tag-remove {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
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
</style>
