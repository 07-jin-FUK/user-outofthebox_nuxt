<template>
  <div class="onboarding">
    <StepIndicator :current-step="currentStep" :steps="steps" />

    <div class="onboarding__content">
      <QuestionCard :question="currentQuestion" :current-index="currentQuestionIndex" :total="questions.length">
        <ClientOnly>
          <component
            :is="currentQuestion.component"
            v-model="currentAnswer"
            :options="currentQuestionOptions"
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
            :employment-period="currentQuestion.employmentPeriod"
            @submit="handleNext"
            @update:selected-label="updateSelectedLabel"
          />
          <template #fallback>
            <div class="loading-placeholder">読み込み中...</div>
          </template>
        </ClientOnly>
      </QuestionCard>
    </div>

    <div class="onboarding__nav">
      <!-- 中央: 戻る/次へボタン -->
      <div class="onboarding__nav-center">
        <button v-if="currentQuestionIndex > 0" class="btn btn--secondary" @click="handleBack">戻る</button>
        <ClientOnly>
          <button class="btn btn--primary" :disabled="!canProceed" @click="handleNext">
            {{ isLastQuestion ? "完了" : "次の質問へ進む" }}
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

const { currentStep, steps, questions, currentQuestionIndex, currentQuestion, currentQuestionOptions, currentAnswer, canProceed, isLastQuestion, handleNext, handleBack, handleReset, updateSelectedLabel, graduationSchoolName, graduationFacultyName, graduationBaseAge, birthYear } = useOnboarding();
</script>

<style lang="scss" scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px; // ← インディケーターの高さ分の余白を追加
  padding-bottom: 80px;

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
</style>
