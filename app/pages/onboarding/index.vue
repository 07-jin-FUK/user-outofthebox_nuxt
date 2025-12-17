<template>
  <div class="onboarding">
    <StepIndicator 
      v-if="shouldShowStepIndicator" 
      :current-step="currentStep" 
      :steps="steps" 
    />

    <div class="onboarding__content">
     <QuestionCard 
        v-if="currentQuestion"
        :question="currentQuestion" 
        :current-index="currentQuestionIndex" 
        :total="questions.length"
      >
        <ClientOnly>
          <component
            :is="currentQuestion.component"
            v-model="currentAnswer"
            :options="currentQuestionOptions"
              :regions="currentQuestion.regions" 
  :current-prefecture="answers['prefecture']" 
            :columns="currentQuestion.columns"
            :dropdowns="currentQuestion.dropdowns"
            :placeholder="currentQuestion.placeholder"
            :featured-first="currentQuestion.featuredFirst"
            :school-name="graduationSchoolName"
            :faculty-name="graduationFacultyName"
            :base-age="graduationBaseAge"
            :birth-year="birthYear"
            :notes="currentQuestion.notes"
            :selected-label="currentQuestion.selectedLabel"
            :category-data="currentQuestion.categoryData"
            :selected-jobs="currentQuestion.selectedJobs"
            :company-name="currentQuestion.companyName"
              :display-mode="currentQuestion.displayMode" 
            :employment-period="currentQuestion.employmentPeriod"
            :phone-number="answers['account_info']?.phone"
            @submit="handleNext"
            @update:selected-label="updateSelectedLabel"
          />
          <template #fallback>
            <div class="loading-placeholder">読み込み中...</div>
          </template>
        </ClientOnly>
      </QuestionCard>
    </div>
    
<div v-if="currentQuestion?.id === 'past_job_category' && currentAnswer.length > 0" 
     class="onboarding__selected-preview">
      <div class="selected-preview">
        <h3 class="selected-preview__title">追加している経験職種</h3>
        <div class="selected-preview__list">
          <div v-for="(item, index) in currentAnswer" :key="index" class="preview-tag">
            <span class="preview-tag__text">{{ item.smallLabel }}</span>
            <button type="button" class="preview-tag__remove" @click="removeJobFromPreview(index)">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
    
       <!-- ↓↓↓ ここに追加 ↓↓↓ -->
    <!-- 新規追加: desired_job_category用 -->
    <div v-if="currentQuestion?.id === 'desired_job_category' && currentAnswer.length > 0" 
     class="onboarding__selected-preview">
      <div class="selected-preview">
        <h3 class="selected-preview__title">追加している転職希望職種</h3>
        <div class="selected-preview__list">
          <div v-for="(item, index) in currentAnswer" :key="index" class="preview-tag">
            <span class="preview-tag__text">{{ item.smallLabel }}</span>
            <button type="button" class="preview-tag__remove" @click="removeJobFromPreview(index)">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ↑↑↑ ここまで ↑↑↑ -->
     
    <!-- desired_location用 -->
<div v-if="currentQuestion?.id === 'desired_location' && currentAnswer.length > 0" 
 class="onboarding__selected-preview">
  <div class="selected-preview">
    <h3 class="selected-preview__title">選択中の希望勤務地</h3>
    <div class="selected-preview__list">
      <div v-for="(item, index) in currentAnswer" :key="index" class="preview-tag">
        <span class="preview-tag__text">{{ item.label }}</span>
        <button type="button" class="preview-tag__remove" @click="removeJobFromPreview(index)">
          ×
        </button>
      </div>
    </div>
  </div>
</div>


    <div class="onboarding__nav">
      <!-- 中央: 戻る/次へボタン -->
      <div class="onboarding__nav-center">
        <button v-if="currentQuestionIndex > 0" class="btn btn--secondary" @click="handleBack">戻る</button>
        <ClientOnly>
<!-- ボタンテキストの変更 -->
<button class="btn btn--primary" :disabled="!canProceed" @click="handleNext">
  {{ currentQuestion?.id === 'account_info' ? '送信' : isLastQuestion ? '完了' : '次の質問へ進む' }}
</button>
          <template #fallback>
            <button class="btn btn--primary" disabled>次の質問へ進む</button>
          </template>
        </ClientOnly>
      </div>

      <!-- 右下: リセットボタン -->
      <button class="btn btn--text btn--reset" @click="handleReset">入力内容をリセット</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import StepIndicator from "~/components/onboarding/StepIndicator.vue";
import QuestionCard from "~/components/onboarding/QuestionCard.vue";

const { currentStep, steps, questions, currentQuestionIndex, currentQuestion, currentQuestionOptions, currentAnswer, canProceed, isLastQuestion, handleNext, handleBack, handleReset, updateSelectedLabel, graduationSchoolName, graduationFacultyName, graduationBaseAge, birthYear, answers } = useOnboarding();

const removeJobFromPreview = (index: number) => {
  const newArray = [...currentAnswer.value]
  newArray.splice(index, 1)
  currentAnswer.value = newArray
}

const shouldShowStepIndicator = computed(() => {
  if (!currentQuestion.value) return false
  
  const hiddenQuestions = [
    'account_info', 
    'sms_code', 
    'full_name', 
    'desired_region',     // ← 追加
    'desired_prefecture', // ← 追加
    'salary_range', 
    'desired_job_category', 
    'job_change_timing', 
    'self_pr'
  ]
  return !hiddenQuestions.includes(currentQuestion.value.id)
})
</script>

<style lang="scss" scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px; // ← インディケーターの高さ分の余白を追加
  padding-bottom: 200px;

  &__content {
    flex: 1;
    display: flex; 
    flex-direction: column;
    align-items: center; 
    padding: $spacing-xl;
    overflow-y: auto;
  }

  &__nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacing-lg;
    border-top: 1px solid $border-color;
    background: $bg-primary;
    z-index: 10;
  }

  &__nav-center {
    display: flex;
    gap: $spacing-md;
  }
}

.btn--reset {
  position: absolute;
  right: $spacing-lg;
  color: $text-muted;
  font-size: $font-size-sm;

  &:hover {
    color: #dc2626;
  }
}

.loading-placeholder {
  color: $text-muted;
  font-size: $font-size-sm;
  padding: $spacing-lg;
}

.btn--reset {
  position: absolute;
  right: $spacing-lg;
  color: $text-muted;
  font-size: $font-size-sm;

  &:hover {
    color: #dc2626;
  }
}


.onboarding__selected-preview {
  position: fixed;
  bottom: 90px; // ナビゲーションの高さ分上に配置
  left: 0;
  right: 0;
  background: $bg-primary;
  border-top: 1px solid $border-color;
  padding: $spacing-md $spacing-lg;
  z-index: 9;
  max-height: none;  // ← max-heightを削除
  overflow-y: visible;  // ← スクロールを無効化
}

.selected-preview {
  max-width: 600px;
  margin: 0 auto;

  &__title {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }
}

.preview-tag {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  background: white;
  border: 1px solid $border-color;
  border-radius: 16px;
  font-size: $font-size-sm;

  &__text {
    color: $text-primary;
    font-weight: 500;
  }

  &__remove {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    color: $text-muted;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    transition: color 0.2s ease;
    margin-bottom: 2px;

    &:hover {
      color: #dc2626;
    }
  }
}
</style>
