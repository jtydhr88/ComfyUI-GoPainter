<template>
  <div class="min-h-screen">
    <!-- Left Panel - Input -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div class="space-y-6">
        <!-- Line Drawing Input Field -->
        <DualImageUpload
          title="Line Drawing Input Field"
          @file-selected="onLineDrawingSelect"
        />

        <!-- Underpainting Input Field -->
        <DualImageUpload
          title="Underpainting Input Field"
          @file-selected="onUnderpaintingSelect"
        />

        <!-- Parameter Settings -->
        <ColoringParameterSettings
          v-model:ai-strength="params.aiStrength"
          v-model:detail="params.detail"
        />

        <!-- Model Settings -->
        <ModelSettings
          v-model:model="params.model"
        />

        <!-- Color Preservation Settings -->
        <ColorPreservationSettings
          v-model:preservation="params.colorPreservation"
        />

        <!-- Send Button -->
        <SendActions
          :can-send="canSend"
          :processing="processing"
          @send="processImage"
        />

        <!-- Conversion Mode -->
        <ConversionModeSettings
          v-model:mode="params.conversionMode"
          @convert="convertImage"
        />
      </div>

      <!-- Right Panel - Output -->
      <div class="lg:sticky lg:top-4 lg:h-fit">
        <OutputDisplay :image="outputImage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DualImageUpload from '../common/DualImageUpload.vue'
import ColoringParameterSettings from '../common/ColoringParameterSettings.vue'
import ModelSettings from '../common/ModelSettings.vue'
import ColorPreservationSettings from '../common/ColorPreservationSettings.vue'
import SendActions from '../common/SendActions.vue'
import ConversionModeSettings from '../common/ConversionModeSettings.vue'
import OutputDisplay from '../common/OutputDisplay.vue'

// Data
const lineDrawingFile = ref(null)
const underpaintingFile = ref(null)
const outputImage = ref(null)
const processing = ref(false)

const params = ref({
  aiStrength: 0.5,
  detail: 0.5,
  model: 'Brush',
  colorPreservation: 'OFF',
  conversionMode: 'underpainting'
})

// Computed
const canSend = computed(() => {
  return lineDrawingFile.value !== null
})

// Methods
const onLineDrawingSelect = (file) => {
  lineDrawingFile.value = file
}

const onUnderpaintingSelect = (file) => {
  underpaintingFile.value = file
}

const processImage = () => {
  if (!canSend.value) return

  processing.value = true

  console.log('Processing Coloring with parameters:', {
    ...params.value,
    lineDrawing: lineDrawingFile.value?.name,
    underpainting: underpaintingFile.value?.name
  })

  // Simulate processing
  setTimeout(() => {
    outputImage.value = `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffeaa7"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#333" text-anchor="middle" dy=".3em">Coloring Result</text></svg>`)}`
    processing.value = false
  }, 3000)
}

const convertImage = () => {
  console.log('Converting with mode:', params.value.conversionMode)

  // Simulate conversion
  setTimeout(() => {
    outputImage.value = `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#fd79a8"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#333" text-anchor="middle" dy=".3em">Converted Result</text></svg>`)}`
  }, 2000)
}

// Reset function
const reset = () => {
  lineDrawingFile.value = null
  underpaintingFile.value = null
  outputImage.value = null
  processing.value = false
  params.value = {
    aiStrength: 0.5,
    detail: 0.5,
    model: 'Brush',
    colorPreservation: 'OFF',
    conversionMode: 'underpainting'
  }
}

// Expose methods for parent component
defineExpose({
  reset
})
</script>

<style scoped>

</style>