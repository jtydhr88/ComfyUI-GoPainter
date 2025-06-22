<template>
  <div class="min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div class="space-y-6">
        <ImageUpload
          v-model:uploadedFile="uploadedFile"
          v-model:previewImage="previewImage"
          @file-selected="onFileSelect"
        />

        <ParameterSettings
          v-model:ai-strength="params.aiStrength"
          v-model:bold="params.bold"
          v-model:stroke="params.stroke"
        />

        <PromptSettings
          :prompt="store.prompt"
          :can-get-suggestions="canSend"
          @update:prompt="store.setPrompt"
        />

        <OutputSettings
          v-model:transparent="params.transparent"
          :can-send="canSend"
          @send="processImage"
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
import ParameterSettings from '@/components/common/ParameterSettings.vue'
import PromptSettings from '@/components/common/PromptSettings.vue'
import OutputSettings from '@/components/common/OutputSettings.vue'
import OutputDisplay from '@/components/common/OutputDisplay.vue'
import ImageUpload from "@/components/common/ImageUpload.vue";

import { useLineartStore } from '@/stores/useLineartStore'

const store = useLineartStore()

const uploadedFile = ref(null)
const previewImage = ref(null)
const outputImage = ref(null)

const params = ref({
  aiStrength: 0.6,
  bold: 0,
  stroke: 0,
  version: 'v1.2',
  style: 'default_g_pen',
  prompt: '',
  autoPrompt: false,
  transparent: false
})

const canSend = computed(() => {
  return uploadedFile.value !== null
})

const onFileSelect = (file) => {
  console.log('File selected:', file?.name || 'null')

  if (file) {
    store.setUploadedFile(file)
  }
}

const processImage = () => {
  if (!canSend.value) return

  console.log('Processing Inking with parameters:', {
    ...params.value,
    file: uploadedFile.value?.name
  })

  setTimeout(() => {
    outputImage.value = `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#333" text-anchor="middle" dy=".3em">Inking Result</text></svg>`)}`
  }, 2000)
}

const reset = () => {
  params.value = {
    aiStrength: 0.6,
    bold: 0,
    stroke: 0,
    version: 'v1.2',
    style: 'default_g_pen',
    prompt: '',
    autoPrompt: false,
    transparent: false
  }
  uploadedFile.value = null
  previewImage.value = null
  outputImage.value = null
}

defineExpose({
  reset
})
</script>

<style scoped>

</style>