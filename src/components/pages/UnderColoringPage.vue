<template>
  <div class="min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div class="space-y-6">
        <DualImageUpload
          title="Line Drawing Input Field"
          @file-selected="onLineDrawingSelect"
        />

        <DualImageUpload
          title="Color Hint Input Field"
          @file-selected="onColorHintSelect"
        />

        <PromptSettings
          :prompt="store.prompt"
          :can-get-suggestions="canSend"
          @update:prompt="store.setPrompt"
        />

        <SendConvertActions
          :can-send="canSend"
          :can-convert="canConvert"
          @send="processImage"
          @convert="convertToPSD"
        />
      </div>

      <div class="lg:sticky lg:top-4 lg:h-fit">
        <OutputDisplay :image="outputImage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DualImageUpload from '@/components/common/DualImageUpload.vue'
import PromptSettings from '@/components/common/PromptSettings.vue'
import SendConvertActions from '@/components/common/SendConvertActions.vue'
import OutputDisplay from '@/components/common/OutputDisplay.vue'

const lineDrawingFile = ref(null)
const colorHintFile = ref(null)
const outputImage = ref(null)

const params = ref({
  prompt: '',
})

const updatePrompt = (value) => {
  params.value.prompt = value
}

const reset = () => {
  params.value = {
    prompt: ''
  }
  lineDrawingFile.value = null
  colorHintFile.value = null
  outputImage.value = null
}

const canSend = computed(() => {
  return lineDrawingFile.value !== null
})

const canConvert = computed(() => {
  return outputImage.value !== null
})

const onLineDrawingSelect = (file) => {
  lineDrawingFile.value = file
}

const onColorHintSelect = (file) => {
  colorHintFile.value = file
}

const processImage = () => {
  if (!canSend.value) return

  console.log('Processing Under Coloring with parameters:', {
    ...params.value,
    lineDrawing: lineDrawingFile.value?.name,
    colorHint: colorHintFile.value?.name
  })

  setTimeout(() => {
    outputImage.value = `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#333" text-anchor="middle" dy=".3em">Under Coloring Result</text></svg>`)}`
  }, 2000)
}

const convertToPSD = () => {
  if (!canConvert.value) return

  console.log('Converting to PSD format...')

  setTimeout(() => {
    console.log('PSD conversion completed')
  }, 1000)
}

defineExpose({
  reset
})
</script>

<style scoped>

</style>