<template>
  <div class="graduation-year-select">
    <!-- 選択した学校名と学部の表示 -->
    <div v-if="schoolName || facultyName" class="graduation-year-select__info">
      <p v-if="schoolName" class="graduation-year-select__school">{{ schoolName }}</p>
      <p v-if="facultyName" class="graduation-year-select__faculty">{{ facultyName }}</p>
    </div>

    <!-- 西暦選択ドロップダウン -->
    <div class="graduation-year-select__dropdown-wrapper">
      <div class="graduation-year-select__trigger-container">
        <div 
          class="graduation-year-select__trigger"
          :class="{ 'graduation-year-select__trigger--open': isOpen }"
          @click="toggleDropdown"
        >
          <span :class="{ 'graduation-year-select__placeholder': !modelValue }">
            {{ displayValue }}
          </span>
          <span class="graduation-year-select__arrow">▼</span>
        </div>
        
        <Transition name="dropdown">
          <div v-if="isOpen" class="graduation-year-select__menu">
            <div
              v-for="year in yearOptions"
              :key="year"
              class="graduation-year-select__option"
              :class="{ 'graduation-year-select__option--selected': modelValue === String(year) }"
              @click="handleSelect(year)"
            >
              {{ year }}
            </div>
          </div>
        </Transition>
      </div>
      
      <!-- 「年」ラベル -->
      <span class="graduation-year-select__label">年</span>
    </div>

    <!-- 補足テキスト -->
    <p class="graduation-year-select__helper">
      {{ helperText }}
    </p>
    
    <div 
      v-if="isOpen" 
      class="graduation-year-select__overlay"
      @click="isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  schoolName?: string
  facultyName?: string
  baseAge?: number
  birthYear?: number
}>(), {
  modelValue: '',
  schoolName: '',
  facultyName: '',
  baseAge: 22,
  birthYear: 2000
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 西暦の選択肢を生成
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear; y >= currentYear - 50; y--) {
    years.push(y)
  }
  return years
})

const calculatedGraduationYear = computed(() => {
  return props.birthYear + props.baseAge
})

// 初回のみ、値がない場合に自動計算値をセット
watch(() => [props.birthYear, props.baseAge], ([newBirthYear, newBaseAge]) => {
  console.log('=== Graduation Year Calculation ===')
  console.log('birthYear:', newBirthYear)
  console.log('baseAge:', newBaseAge)
  console.log('calculated:', newBirthYear + newBaseAge)
  console.log('currentModelValue:', props.modelValue)
  console.log('==================================')
  
  // 値が空の場合のみ自動計算値をセット
  if (!props.modelValue) {
    const newYear = String(newBirthYear + newBaseAge)
    console.log('Emitting initial value:', newYear)
    emit('update:modelValue', newYear)
  }
}, { immediate: true })

// 表示値(ローカルストレージ優先)
const displayValue = computed(() => {
  return props.modelValue || String(calculatedGraduationYear.value)
})

// 補足テキスト(常に再計算された年を表示)
const helperText = computed(() => {
  const calculatedYear = calculatedGraduationYear.value  // ← 常に再計算
  return `※ あなたが満${props.baseAge}歳で卒業した場合 → ${calculatedYear}年`
})

const handleSelect = (year: number) => {
  emit('update:modelValue', String(year))
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
.graduation-year-select {
  max-width: 400px;
  margin: 0 auto;

  &__info {
    margin-bottom: $spacing-lg;
    text-align: center;
  }

  &__school {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 600;
    margin-bottom: $spacing-xs;
  }

  &__faculty {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

&__dropdown-wrapper {
  margin-bottom: $spacing-md;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
}

&__trigger-container {
  position: relative;  // ← これが基準
}

&__trigger {
  width: 120px;
  padding: $spacing-sm $spacing-md;
  font-size: 14px;
//   border: 1px solid $border-color;
  border-radius: $radius-md;
  background: $bg-primary;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-xs;
  transition: all 0.2s ease;
  min-height: 38px;

  &:hover {
    border-color: $primary;
  }

  &--open {
    border-color: $primary;
    border-radius: $radius-md $radius-md 0 0;
  }
}

&__menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 120px;  // ← 固定幅に戻す
  background: $bg-primary;
//   border: 1px solid $primary;
  border-top: none;
  border-radius: 0 0 $radius-md $radius-md;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  font-size: 13px;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

  &__label {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
  }

  &__placeholder {
    color: $text-muted;
  }

  &__arrow {
    font-size: 8px;
    color: $text-secondary;
    transition: transform 0.2s ease;

    .graduation-year-select__trigger--open & {
      transform: rotate(180deg);
    }
  }



  &__option {
    padding: $spacing-sm $spacing-md;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: $bg-tertiary;
    }

    &--selected {
      background-color:  #FFFBF0;
      font-weight: 500;
    }
  }

  &__helper {
    font-size: $font-size-sm;
    color: $text-muted;
    text-align: center;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 99;
  }
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
</style>
