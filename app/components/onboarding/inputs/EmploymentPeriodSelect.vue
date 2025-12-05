<template>
  <div class="employment-period">
    <!-- 入社年月 -->
    <div class="employment-period__section">
      <div class="employment-period__row">
        <SelectDropdown
          :model-value="{ year: modelValue.joinYear, month: modelValue.joinMonth }"
          :dropdowns="joinDropdowns"
          @update:model-value="handleJoinDateChange"
        />
        <span class="employment-period__label">から</span>
      </div>
    </div>

    <!-- チェックボックス -->
    <div class="employment-period__checkbox">
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="modelValue.isCurrentJob"
          @change="handleCheckboxChange"
        />
        <span class="checkbox-text">すでに退職している</span>
      </label>
    </div>

    <!-- 退職年月（チェックが入っている場合のみ表示） -->
    <div v-if="modelValue.isCurrentJob" class="employment-period__section">
      <div class="employment-period__row">
        <SelectDropdown
          :model-value="{ year: modelValue.leaveYear, month: modelValue.leaveMonth }"
          :dropdowns="leaveDropdowns"
          @update:model-value="handleLeaveDateChange"
        />
        <span class="employment-period__label">まで</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectDropdown from '~/components/onboarding/inputs/SelectDropdown.vue'

interface ModelValue {
  joinYear: string
  joinMonth: string
  isCurrentJob: boolean
  leaveYear: string
  leaveMonth: string
}

const props = defineProps<{
  modelValue: ModelValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ModelValue]
}>()

// 年の選択肢を生成
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear; y >= 1950; y--) {
    years.push({ value: String(y), label: `${y}` })
  }
  return years
}

// 月の選択肢を生成
const generateMonthOptions = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}`
  }))
}

const joinDropdowns = [
  { key: 'year', placeholder: '年', width: '120px', options: generateYearOptions() },
  { key: 'month', placeholder: '月', width: '90px', options: generateMonthOptions() }
]

const leaveDropdowns = [
  { key: 'year', placeholder: '年', width: '120px', options: generateYearOptions() },
  { key: 'month', placeholder: '月', width: '90px', options: generateMonthOptions() }
]

const handleJoinDateChange = (value: { year: string; month: string }) => {
  emit('update:modelValue', {
    ...props.modelValue,
    joinYear: value.year,
    joinMonth: value.month
  })
}

const handleLeaveDateChange = (value: { year: string; month: string }) => {
  emit('update:modelValue', {
    ...props.modelValue,
    leaveYear: value.year,
    leaveMonth: value.month
  })
}

const handleCheckboxChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', {
    ...props.modelValue,
    isCurrentJob: target.checked
  })
}
</script>

<style lang="scss" scoped>
.employment-period {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  align-items: center;

  &__section {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__label {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    white-space: nowrap;
  }

  &__checkbox {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  transition: background 0.2s ease;

  &:hover {
    background: $bg-secondary;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: $primary;
  }

  .checkbox-text {
    font-size: $font-size-base;
    color: $primary;
    font-weight: 500;
  }
}
</style>
