<template>
  <div class="min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div class="space-y-6">
        <!-- 调试信息显示 -->
        <Card class="rounded-lg shadow-md border border-blue-200 bg-blue-50">
          <template #title>
            <span class="text-lg font-semibold text-blue-800">调试信息</span>
          </template>
          <template #content>
            <div class="space-y-2 text-sm">
              <div><strong>已上传文件:</strong> {{ store.uploadedFile?.name || '无' }}</div>
              <div><strong>当前状态:</strong> {{ wsClient.status.status }}</div>
              <div><strong>正在处理:</strong> {{ wsClient.status.isProcessing ? '是' : '否' }}</div>
              <div><strong>队列剩余:</strong> {{ wsClient.status.queueRemaining ?? '未知' }}</div>
              <div><strong>输出图片:</strong> {{ outputImage ? '已设置' : '未设置' }}</div>
              <div><strong>输出图片URL长度:</strong> {{ outputImage?.length || 0 }}</div>
            </div>
          </template>
        </Card>

        <!-- 图片上传和预览区域 -->
        <div v-if="!store.previewImage">
          <ImageUpload
            v-model:uploadedFile="store.uploadedFile"
            v-model:previewImage="store.previewImage"
            @file-selected="onFileSelect"
          />
        </div>

        <div v-else class="grid grid-cols-2 gap-4">
          <div>
            <ImageUpload
              v-model:uploadedFile="store.uploadedFile"
              v-model:previewImage="store.previewImage"
              @file-selected="onFileSelect"
            />
          </div>

          <div>
            <Card class="rounded-lg shadow-md border border-gray-200 h-full">
              <template #title>
                <span class="text-lg font-semibold text-gray-800">Preview</span>
              </template>
              <template #content>
                <div class="relative">
                  <img
                    :src="store.previewImage"
                    alt="Image preview"
                    class="w-full h-64 object-contain rounded-lg bg-gray-50"
                  />
                  <Button
                    icon="pi pi-times"
                    class="absolute top-2 right-2 p-button-text p-button-sm bg-red-500 text-white hover:bg-red-600 rounded-full"
                    @click="removePreview"
                  />
                </div>
              </template>
            </Card>
          </div>
        </div>

        <ParameterSettings
          :ai-strength="store.aiStrength"
          :bold="store.bold"
          :stroke="store.stroke"
          @update:ai-strength="store.setAiStrength"
          @update:bold="store.setBold"
          @update:stroke="store.setStroke"
        />

         <PromptSettings
          :prompt="store.prompt"
          :can-get-suggestions="canSend"
          :uploaded-file="store.uploadedFile"
          @update:prompt="store.setPrompt"
        />

        <!-- Processing Status Display -->
        <Card v-if="wsClient.status.visible" class="rounded-lg shadow-md border border-gray-200">
          <template #title>
            <span class="text-lg font-semibold text-gray-800">Processing Status</span>
          </template>
          <template #content>
            <div class="flex items-center justify-center space-x-3 py-4">
              <ProgressSpinner v-if="wsClient.status.isProcessing" class="w-8 h-8" />
              <i v-else-if="wsClient.status.status === 'completed'" class="pi pi-check-circle text-green-600 text-2xl"></i>
              <i v-else-if="wsClient.status.status === 'error'" class="pi pi-times-circle text-red-600 text-2xl"></i>

              <div class="text-center">
                <div :class="[
                  'text-lg font-medium',
                  wsClient.status.status === 'completed' ? 'text-green-600' :
                  wsClient.status.status === 'error' ? 'text-red-600' : 'text-blue-600'
                ]">
                  {{ wsClient.getStatusText() }}
                </div>
                <div v-if="wsClient.status.queueRemaining !== null" class="text-sm text-gray-600 mt-1">
                  Queue remaining: {{ wsClient.status.queueRemaining }}
                </div>
              </div>
            </div>
          </template>
        </Card>

        <OutputSettings
          :transparent="store.transparent"
          :can-send="canSend"
          :processing="store.processing"
          @update:transparent="store.setTransparent"
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
import { ref, computed, onUnmounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import ImageUpload from '@/components/common/ImageUpload.vue'
import ParameterSettings from '@/components/common/ParameterSettings.vue'
import PromptSettings from '@/components/common/PromptSettings.vue'
import OutputSettings from '@/components/common/OutputSettings.vue'
import OutputDisplay from '@/components/common/OutputDisplay.vue'

import { useLineartStore } from '@/stores/useLineartStore'
import { ComfyUIWebSocket } from '@/utils/websocket' // 使用调试版本

const store = useLineartStore()
const outputImage = ref(null)

// 创建 WebSocket 客户端实例
const wsClient = new ComfyUIWebSocket()

// 设置回调函数 - 添加详细日志
wsClient
  .onResult((result) => {
    console.log('🎯 LineartPage: Received result in onResult callback:', result)

    // 检查结果结构
    if (result) {
      console.log('🔍 LineartPage: Result type:', typeof result)
      console.log('🔍 LineartPage: Result keys:', Object.keys(result))

      if (result.images) {
        console.log('🖼️ LineartPage: Found images array:', result.images)
        console.log('🖼️ LineartPage: Images count:', result.images.length)

        if (result.images.length > 0) {
          const firstImage = result.images[0]
          console.log('🖼️ LineartPage: First image:', firstImage)
          console.log('🖼️ LineartPage: First image URL:', firstImage.url)

          // 设置输出图片
          outputImage.value = firstImage.url
          console.log('✅ LineartPage: Set outputImage.value to:', firstImage.url)

          // 验证设置是否成功
          setTimeout(() => {
            console.log('🔍 LineartPage: outputImage.value after set:', outputImage.value)
          }, 100)
        } else {
          console.log('❌ LineartPage: Images array is empty')
        }
      } else {
        console.log('❌ LineartPage: No images property in result')
      }

      if (result.text) {
        console.log('📝 LineartPage: Found text result:', result.text)
      }

      if (result.data) {
        console.log('📊 LineartPage: Found data result:', result.data)
      }
    } else {
      console.log('❌ LineartPage: Result is null or undefined')
    }

    store.setProcessing(false)
    console.log('✅ LineartPage: Set processing to false')
  })
  .onError((error) => {
    console.error('❌ LineartPage: WebSocket error:', error)
    store.setProcessing(false)
    alert(`处理失败: ${error}`)
  })
  .onStatusChange((status) => {
    console.log('📢 LineartPage: Status changed:', status)
  })

const canSend = computed(() => {
  const result = store.uploadedFile !== null && !store.processing
  console.log('🔍 LineartPage: canSend computed:', result, {
    hasFile: store.uploadedFile !== null,
    notProcessing: !store.processing
  })
  return result
})

// Remove preview image
function removePreview() {
  console.log('🗑️ LineartPage: Removing preview')
  store.setPreviewImage(null)
  store.setUploadedFile(null)
}

const onFileSelect = (file) => {
  console.log('📁 LineartPage: File selected:', file?.name || 'null')
  store.setUploadedFile(file)
}

const processImage = async () => {
  console.log('🚀 LineartPage: processImage called')
  console.log('🔍 LineartPage: canSend.value:', canSend.value)
  console.log('🔍 LineartPage: store.uploadedFile:', store.uploadedFile?.name)

  if (!canSend.value) {
    console.log('❌ LineartPage: Cannot send, returning early')
    return
  }

  console.log('✅ LineartPage: Starting image processing')
  store.setProcessing(true)

  try {
    const formData = new FormData()

    if (store.uploadedFile) {
      formData.append('image', store.uploadedFile)
      console.log('📁 LineartPage: Added image to formData:', store.uploadedFile.name)
    }

    formData.append('aiStrength', store.aiStrength.toString())
    formData.append('bold', store.bold.toString())
    formData.append('stroke', store.stroke.toString())
    formData.append('prompt', store.prompt)
    formData.append('transparent', store.transparent.toString())

    const params = {
      aiStrength: store.aiStrength,
      bold: store.bold,
      stroke: store.stroke,
      prompt: store.prompt,
      transparent: store.transparent,
      fileName: store.uploadedFile?.name
    }

    console.log('📤 LineartPage: Sending request to /gopainter/api/test with parameters:', params)

    const response = await fetch('/gopainter/api/test', {
      method: 'POST',
      body: formData,
    })

    console.log('📡 LineartPage: Response status:', response.status)
    console.log('📡 LineartPage: Response ok:', response.ok)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('📨 LineartPage: Received response:', result)

    if (result.prompt_id) {
      console.log('🔗 LineartPage: Connecting WebSocket with promptId:', result.prompt_id)
      // 使用 WebSocket 客户端连接监控进度
      await wsClient.connect(result.prompt_id)
      console.log('✅ LineartPage: WebSocket connected successfully')
    } else {
      console.error('❌ LineartPage: No prompt_id received from server')
      store.setProcessing(false)
    }

  } catch (error) {
    console.error('❌ LineartPage: Error processing image:', error)
    store.setProcessing(false)
    wsClient.close()
    alert(`处理失败: ${error.message}`)
  }
}

const reset = () => {
  console.log('🔄 LineartPage: Reset called')
  outputImage.value = null
  store.setPreviewImage(null)
  store.setUploadedFile(null)
  wsClient.close()
}

// Cleanup on component unmount
onUnmounted(() => {
  console.log('🧹 LineartPage: Component unmounting, cleaning up')
  wsClient.close()
})

defineExpose({
  reset
})
</script>

<style scoped>
</style>