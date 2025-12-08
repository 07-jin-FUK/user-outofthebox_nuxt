<template>
  <div class="job-experience-years">

    <!-- 職種ごとの経験年数入力 -->
    <div class="job-experience-years__list">
      <div
        v-for="(job, index) in selectedJobs"
        :key="index"
        class="experience-item"
      >
        <div class="experience-item__header">
          <span class="experience-item__label">{{ job.smallLabel }}</span>
        </div>

        <div class="experience-item__selector">
             <span class="experience-item__suffix">経験</span>
          <select
            :value="modelValue[job.smallValue] || ''"
            class="experience-item__select"
            @change="handleChange(job.smallValue, ($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled></option>
            <option
              v-for="option in getYearOptions()"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
         
        </div>
      </div>
    </div>

    <!-- 説明文 -->
    <div class="job-experience-years__notes">
      <p class="job-experience-years__note">
        各職種について、<strong>{{ companyName }}</strong>での経験年数を選択してください。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SelectedJob {
  largeValue: string
  largeLabel: string
  mediumValue: string
  mediumLabel: string
  smallValue: string
  smallLabel: string
}

interface YearOption {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: Record<string, string>
  selectedJobs: SelectedJob[]
  companyName?: string
  employmentPeriod?: {
    joinYear: string
    joinMonth: string
    isCurrentJob: boolean
    leaveYear: string
    leaveMonth: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
}>()

// 勤続年数を計算
const calculateTenure = (): number => {
  if (!props.employmentPeriod) return 0

  const { joinYear, joinMonth, isCurrentJob, leaveYear, leaveMonth } = props.employmentPeriod

  if (!joinYear || !joinMonth) return 0

  const startDate = new Date(Number(joinYear), Number(joinMonth) - 1)
  
  let endDate: Date
  if (isCurrentJob && leaveYear && leaveMonth) {
    // 退職している場合
    endDate = new Date(Number(leaveYear), Number(leaveMonth) - 1)
  } else {
    // 現在も勤務中
    endDate = new Date()
  }

  // 月数を計算
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                 (endDate.getMonth() - startDate.getMonth())
  
  // 年数に変換(切り捨て)
  return Math.floor(months / 12)
}

// 選択肢を生成
const getYearOptions = (): YearOption[] => {
  const tenure = calculateTenure()
  const maxYears = Math.min(tenure, 10) // 上限は10年

  const options: YearOption[] = [
    { value: 'less_than_1', label: '1年未満' }
  ]

  for (let i = 1; i <= maxYears; i++) {
    options.push({
      value: `${i}+`,
      label: `${i}年以上`
    })
  }

  // 10年以上勤務している場合は「10年以上」を追加
  if (tenure >= 10 && !options.some(opt => opt.value === '10+')) {
    options.push({
      value: '10+',
      label: '10年以上'
    })
  }

  return options
}

const handleChange = (jobValue: string, years: string) => {
  const updated = { ...props.modelValue, [jobValue]: years }
  emit('update:modelValue', updated)
}
</script>

<style lang="scss" scoped>
.job-experience-years {
  max-width: 600px;
  margin: 0 auto;

  &__company {
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    background: #FFFBF0;
    border-left: 4px solid $primary;
    border-radius: $radius-sm;
  }

  &__company-name {
    font-size: $font-size-base;
    font-weight: 600;
    color: $primary;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }

  &__notes {
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 1px solid $border-color;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__note {
    font-size: 12px;
    color: #777777;
    line-height: 1.6;
    text-align: left;
    
    strong {
      color: #555555;
    }
    
    &::before {
      content: '※ ';
    }
  }
}

.experience-item {
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  gap: $spacing-md; 
  background: white;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-md $spacing-lg;

  &__header {
    flex: 1;
    text-align: left;
  }

  &__label {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
  }

  &__selector {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex-shrink: 0;  // ← 追加(縮まないように)
  }

  &__select {
    width: 130px;  // ← 固定幅に変更
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-base;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    background: $bg-primary;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $primary;
    }

    option:disabled {
      color: $text-muted;
    }
  }

  &__suffix {
    font-size: $font-size-sm;
    color: $text-secondary;
    white-space: nowrap;
  }
}
</style>
