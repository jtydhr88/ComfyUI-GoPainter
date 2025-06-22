<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Parameter Settings</span>
    </template>
    <template #content>
      <div class="space-y-6">
        <!-- AI Strength -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">AI Strength</label>
            <Button
              icon="pi pi-question-circle"
              class="p-button-text p-button-sm text-gray-500 hover:text-gray-700"
              v-tooltip="'Adjusts the strength of AI processing'"
            />
          </div>
          <div class="text-right text-sm font-mono text-gray-600">{{ aiStrength.toFixed(1) }}</div>
          <Slider
            :modelValue="aiStrength"
            @update:modelValue="updateAiStrength"
            :min="0"
            :max="1"
            :step="0.1"
            class="w-full"
          />
        </div>

        <!-- Detail -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Detail</label>
            <Button
              icon="pi pi-question-circle"
              class="p-button-text p-button-sm text-gray-500 hover:text-gray-700"
              v-tooltip="'Controls the level of detail in the result'"
            />
          </div>
          <div class="text-right text-sm font-mono text-gray-600">{{ detail.toFixed(1) }}</div>
          <div class="flex items-center space-x-2">
            <Slider
              :modelValue="detail"
              @update:modelValue="updateDetail"
              :min="0"
              :max="1"
              :step="0.1"
              class="flex-1"
            />
            <Button
              icon="pi pi-refresh"
              class="p-button-text p-button-sm text-gray-500 hover:text-gray-700"
              @click="resetDetail"
              v-tooltip="'Reset Detail'"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Slider from 'primevue/slider'
import Button from 'primevue/button'

// Props
const props = defineProps({
  aiStrength: {
    type: Number,
    default: 0.5
  },
  detail: {
    type: Number,
    default: 0.5
  }
})

// Emits
const emit = defineEmits(['update:aiStrength', 'update:detail'])

// Methods
const updateAiStrength = (value) => {
  emit('update:aiStrength', value)
}

const updateDetail = (value) => {
  emit('update:detail', value)
}

const resetDetail = () => {
  emit('update:detail', 0.5)
}
</script>

<style scoped>

</style>