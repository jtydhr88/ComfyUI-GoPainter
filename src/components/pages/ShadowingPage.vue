<template>
  <div class="min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <!-- Left Panel - Input -->
      <div class="space-y-6">
        <!-- Step 1: Generate Shadow -->
        <StepSection
          title="STEP 1: Generate Shadow"
          :step-number="1"
          :is-active="currentStep >= 1"
        >
          <!-- Line Drawing Input Field -->
          <DualImageUpload
            title="Line Drawing Input Field"
            @file-selected="onLineDrawingSelect"
          />

          <!-- Undercoloring Input Field (Optional) -->
          <DualImageUpload
            title="Undercoloring Input Field (Optional)"
            @file-selected="onUndercoloringSelect"
          />

          <!-- Step 1 Actions -->
          <StepActions
            :can-send="canGenerateShadow"
            :processing="step1Processing"
            send-label="Send"
            @send="generateShadow"
          />
        </StepSection>

        <!-- Step 2: Convert Shadow -->
        <StepSection
          title="STEP 2: Convert Shadow"
          :step-number="2"
          :is-active="currentStep >= 2"
          :is-enabled="step1Completed"
        >
          <!-- Shadow Parameter Settings -->
          <ShadowParameterSettings
            v-model:color="shadowParams.color"
            v-model:light-source-depth="shadowParams.lightSourceDepth"
            v-model:intensity="shadowParams.intensity"
            v-model:target-depth="shadowParams.targetDepth"
            v-model:use-toon-shading="shadowParams.useToonShading"
          />

          <!-- Step 2 Actions -->
          <StepActions
            :can-send="canConvertShadow"
            :processing="step2Processing"
            send-label="Send"
            convert-label="Convert to Anime Shadow"
            :show-convert="true"
            @send="convertShadow"
            @convert="convertToAnime"
          />
        </StepSection>
      </div>

      <!-- Right Panel - Output -->
      <div class="lg:sticky lg:top-4 lg:h-fit">
        <Card class="rounded-lg shadow-md border border-gray-200">
          <template #title>
            <span class="text-lg font-semibold text-gray-800">Output</span>
          </template>
          <template #content>
            <div class="space-y-6">
              <!-- 3D Shadow Output -->
              <div class="space-y-3">
                <div class="border-b border-gray-200 pb-2">
                  <h3 class="text-md font-medium text-gray-800">3D Shadow</h3>
                </div>
                <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div v-if="!shadowOutput3D" class="text-center text-gray-500">
                    <p>Shadow Generation Result is displayed here.</p>
                  </div>
                  <div v-else class="w-full h-full">
                    <img :src="shadowOutput3D" alt="3D Shadow result" class="w-full h-full object-contain rounded-lg" />
                  </div>
                </div>
                <div class="flex justify-center space-x-2" v-if="shadowOutput3D">
                  <Button
                    icon="pi pi-thumbs-up"
                    class="p-button-text text-green-600 hover:text-green-800"
                    v-tooltip="'Like result'"
                  />
                  <Button
                    icon="pi pi-download"
                    class="p-button-text text-blue-600 hover:text-blue-800"
                    v-tooltip="'Download image'"
                  />
                </div>
              </div>

              <!-- Anime Shadow Output -->
              <div class="space-y-3">
                <div class="border-b border-gray-200 pb-2">
                  <h3 class="text-md font-medium text-gray-800">Anime Shadow</h3>
                </div>
                <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div v-if="!shadowOutputAnime" class="text-center text-gray-500">
                    <p>Anime Shadow Result is displayed here.</p>
                  </div>
                  <div v-else class="w-full h-full">
                    <img :src="shadowOutputAnime" alt="Anime Shadow result" class="w-full h-full object-contain rounded-lg" />
                  </div>
                </div>
                <div class="flex justify-center space-x-2" v-if="shadowOutputAnime">
                  <Button
                    icon="pi pi-thumbs-up"
                    class="p-button-text text-green-600 hover:text-green-800"
                    v-tooltip="'Like result'"
                  />
                  <Button
                    icon="pi pi-download"
                    class="p-button-text text-blue-600 hover:text-blue-800"
                    v-tooltip="'Download image'"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DualImageUpload from '../common/DualImageUpload.vue'
import StepSection from '../common/StepSection.vue'
import StepActions from '../common/StepActions.vue'
import ShadowParameterSettings from '../common/ShadowParameterSettings.vue'

// Data
const lineDrawingFile = ref(null)
const undercoloringFile = ref(null)
const shadowOutput3D = ref(null)
const shadowOutputAnime = ref(null)

// Step management
const currentStep = ref(1)
const step1Completed = ref(false)
const step1Processing = ref(false)
const step2Processing = ref(false)

// Shadow parameters
const shadowParams = ref({
  color: '#000000',
  lightSourceDepth: 0,
  intensity: 1,
  targetDepth: 1,
  useToonShading: false
})

// Computed
const canGenerateShadow = computed(() => {
  return lineDrawingFile.value !== null
})

const canConvertShadow = computed(() => {
  return step1Completed.value && !step1Processing.value
})

// Methods
const onLineDrawingSelect = (file) => {
  lineDrawingFile.value = file
}

const onUndercoloringSelect = (file) => {
  undercoloringFile.value = file
}

const generateShadow = () => {
  if (!canGenerateShadow.value) return

  step1Processing.value = true

  console.log('Generating 3D Shadow with files:', {
    lineDrawing: lineDrawingFile.value?.name,
    undercoloring: undercoloringFile.value?.name
  })

  // Simulate processing
  setTimeout(() => {
    shadowOutput3D.value = `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#333" text-anchor="middle" dy=".3em">3D Shadow Result</text></svg>`)}`
    step1Processing.value = false
    step1Completed.value = true
    currentStep.value = 2
  }, 3000)
}

const convertShadow = () => {
  if (!canConvertShadow.value) return

  step2Processing.value = true

  console.log('Converting Shadow with parameters:', shadowParams.value)

  // Simulate processing
  setTimeout(() => {
    // Update 3D shadow with parameters applied
    shadowOutput3D.value = `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e0e0e0"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#333" text-anchor="middle" dy=".3em">Enhanced 3D Shadow</text></svg>`)}`
    step2Processing.value = false
  }, 2000)
}

const convertToAnime = () => {
  if (!canConvertShadow.value) return

  console.log('Converting to Anime Shadow...')

  // Simulate anime conversion
  setTimeout(() => {
    shadowOutputAnime.value = `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffe0e6"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#333" text-anchor="middle" dy=".3em">Anime Shadow Result</text></svg>`)}`
  }, 1500)
}

// Reset function
const reset = () => {
  lineDrawingFile.value = null
  undercoloringFile.value = null
  shadowOutput3D.value = null
  shadowOutputAnime.value = null
  currentStep.value = 1
  step1Completed.value = false
  step1Processing.value = false
  step2Processing.value = false
  shadowParams.value = {
    color: '#000000',
    lightSourceDepth: 0,
    intensity: 1,
    targetDepth: 1,
    useToonShading: false
  }
}

// Expose methods for parent component
defineExpose({
  reset
})
</script>

<style scoped>

</style>