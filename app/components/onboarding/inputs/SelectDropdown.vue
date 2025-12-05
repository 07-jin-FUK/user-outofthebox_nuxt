<template>
  <div class="select-dropdown-wrapper">
    <div class="select-dropdown">
      <div 
        v-for="(dropdown, index) in dropdowns" 
        :key="index"
        class="select-dropdown__item"
      >
        <div class="select-dropdown__row">
          <!-- triggerを囲む独立したコンテナ -->
          <div class="select-dropdown__trigger-wrapper">
            <div 
              class="select-dropdown__trigger"
              :class="{ 'select-dropdown__trigger--open': openIndex === index }"
              :style="{ width: dropdown.width || '100px' }"
              @click="toggleDropdown(index)"
            >
              <span :class="{ 'select-dropdown__placeholder': !modelValue[dropdown.key] }">
                {{ getDisplayValue(dropdown) }}
              </span>
              <span class="select-dropdown__arrow">▼</span>
            </div>
            
            <!-- メニューをtrigger-wrapper内に移動 -->
            <Transition name="dropdown">
              <div 
                v-if="openIndex === index" 
                class="select-dropdown__menu"
                :style="{ width: dropdown.width || '100px' }"
              >
                <div
                  v-for="opt in dropdown.options"
                  :key="opt.value"
                  class="select-dropdown__option"
                  :class="{ 'select-dropdown__option--selected': modelValue[dropdown.key] === opt.value }"
                  @click="handleSelect(dropdown.key, opt.value)"
                >
                  {{ opt.label }}
                </div>
              </div>
            </Transition>
          </div>
          
          <!-- ラベルを外に -->
          <span class="select-dropdown__label">{{ dropdown.label || dropdown.placeholder }}</span>
        </div>
      </div>
    </div>  <!-- ← この閉じタグが抜けていました -->
    
    <div 
      v-if="openIndex !== null" 
      class="select-dropdown__overlay"
      @click="openIndex = null"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

interface DropdownOption {
  value: string
  label: string
}

interface Dropdown {
  key: string
  placeholder: string
  label?: string
  width?: string 
  options: DropdownOption[]
}

const props = withDefaults(defineProps<{
  modelValue: Record<string, string>
  dropdowns?: Dropdown[]
  options?: any[]
  placeholder?: string
}>(), {
  dropdowns: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
  'submit': []
}>()

const openIndex = ref<number | null>(null)

const toggleDropdown = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const getDisplayValue = (dropdown: Dropdown) => {
  const value = props.modelValue[dropdown.key]
  if (!value) return ''
  const option = dropdown.options.find(opt => opt.value === value)
  return option?.label || ''
}

const handleSelect = (key: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
  openIndex.value = null
}
</script>

<style lang="scss" scoped>
.select-dropdown {
  display: flex;
  gap: $spacing-xl;
  justify-content: center;
  align-items: center;

  &__row {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__label {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    white-space: nowrap;
  }
  
  
&__trigger-wrapper {
  position: relative;  // ← 追加(ここを基準にする)
}

&__trigger {
  padding: $spacing-sm  $spacing-md;
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

  &__placeholder {
    color: $text-muted;
  }

  &__arrow {
    font-size: 8px;
    color: $text-secondary;
    transition: transform 0.2s ease;

    .select-dropdown__trigger--open & {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: $bg-primary;
    // border: 1px solid $primary;
    border-top: none;
    border-radius: 0 0 $radius-md $radius-md;
    max-height: 200px;
    overflow-y: auto;
    z-index: 100;
    font-size: 13px;
    text-align: left;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__option {
    padding: $spacing-sm  $spacing-md;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: $bg-tertiary;
    }

    &--selected {
      background: rgba($primary, 0.1);
      color: $primary;
      font-weight: 500;
    }
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
