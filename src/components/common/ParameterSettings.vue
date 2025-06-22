<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Parameter Settings</span>
    </template>
    <template #content>
      <div class="space-y-6">
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">AI Strength: {{ aiStrength.toFixed(1) }}</label>
          <Slider
            :modelValue="aiStrength"
            @update:modelValue="updateAiStrength"
            :min="0"
            :max="1"
            :step="0.1"
            class="w-full"
          />
        </div>

        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Bold: {{ bold.toFixed(1) }}</label>
          <div class="flex items-center space-x-2">
            <Slider
              :modelValue="bold"
              @update:modelValue="updateBold"
              :min="0"
              :max="1"
              :step="0.1"
              class="flex-1"
            />
            <Button
              icon="pi pi-refresh"
              class="p-button-text p-button-sm text-gray-500 hover:text-gray-700"
              @click="resetBold"
              v-tooltip="'Reset Bold'"
            />
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Stroke: {{ stroke.toFixed(1) }}</label>
          <Slider
            :modelValue="stroke"
            @update:modelValue="updateStroke"
            :min="0"
            :max="1"
            :step="0.1"
            class="w-full"
          />
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
    default: 0.6
  },
  bold: {
    type: Number,
    default: 0
  },
  stroke: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['update:aiStrength', 'update:bold', 'update:stroke'])

// Methods
const updateAiStrength = (value) => {
  emit('update:aiStrength', value)
}

const updateBold = (value) => {
  emit('update:bold', value)
}

const updateStroke = (value) => {
  emit('update:stroke', value)
}

const resetBold = () => {
  emit('update:bold', 0)
}
</script>

<style scoped>

</style>