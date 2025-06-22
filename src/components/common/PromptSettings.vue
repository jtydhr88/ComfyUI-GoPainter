<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold text-gray-800">Prompt Settings</span>
        <Button
          icon="pi pi-question-circle"
          class="p-button-text p-button-sm text-gray-500 hover:text-gray-700"
          v-tooltip="'What is a Prompt?'"
        />
      </div>
    </template>
    <template #content>
      <div class="space-y-4">
        <Textarea
          :modelValue="prompt"
          @update:modelValue="updatePrompt"
          placeholder="Enter the prompt"
          rows="4"
          class="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <!-- Processing Status Display -->
        <Card v-if="wsClient.status.visible" class="rounded-lg border border-blue-200 bg-blue-50">
          <template #content>
            <div class="flex items-center justify-center space-x-3 py-2">
              <ProgressSpinner v-if="wsClient.status.isProcessing" class="w-6 h-6" />
              <i v-else-if="wsClient.status.status === 'completed'" class="pi pi-check-circle text-green-600 text-xl"></i>
              <i v-else-if="wsClient.status.status === 'error'" class="pi pi-times-circle text-red-600 text-xl"></i>

              <div class="text-center">
                <div :class="[
                  'text-sm font-medium',
                  wsClient.status.status === 'completed' ? 'text-green-600' :
                  wsClient.status.status === 'error' ? 'text-red-600' : 'text-blue-600'
                ]">
                  {{ getPromptStatusText() }}
                </div>
                <div v-if="wsClient.status.queueRemaining !== null" class="text-xs text-gray-600 mt-1">
                  Queue remaining: {{ wsClient.status.queueRemaining }}
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div class="flex justify-center space-x-3">
          <Button
            label="Smart AI Analysis"
            icon="pi pi-sparkles"
            :loading="wsClient.status.isProcessing"
            :disabled="!canGetSuggestions || wsClient.status.isProcessing"
            :class="[
              'px-4 py-2 font-medium rounded-lg transition-colors',
              canGetSuggestions && !wsClient.status.isProcessing
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
            @click="fetchSmartSuggestions"
          />
        </div>

        <!-- 错误消息显示 -->
        <div v-if="errorMessage" class="text-xs text-red-500 text-center bg-red-50 p-2 rounded">
          {{ errorMessage }}
        </div>

        <div v-if="lastResult" class="text-xs text-gray-500 text-center">
          {{ getStatusMessage() }}
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import Card from 'primevue/card'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { ComfyUIWebSocket } from '@/utils/websocket'

// Props
const props = defineProps({
  prompt: {
    type: String,
    default: ''
  },
  canGetSuggestions: {
    type: Boolean,
    default: false
  },
  uploadedFile: {
    type: [File, null],
    default: null
  }
})

// Emits
const emit = defineEmits(['update:prompt'])

const lastResult = ref(null)
const errorMessage = ref('')

// 创建专门用于获取 prompt 的 WebSocket 客户端
const wsClient = new ComfyUIWebSocket()

// 设置回调函数
wsClient
  .onResult((result) => {
    console.log('Received prompt result:', result)

    // 处理文本结果 - prompt 建议
    if (result.text) {
      const currentPrompt = props.prompt
      const newSuggestions = result.text
      const newPrompt = currentPrompt ? `${currentPrompt}, ${newSuggestions}` : newSuggestions
      emit('update:prompt', newPrompt)

      lastResult.value = {
        type: 'smart',
        success: true,
        suggestions: newSuggestions.split(', '),
        count: newSuggestions.split(', ').length
      }
    } else if (result.data) {
      // 处理其他数据格式
      let suggestions = []
      let originalCaption = ''

      // 遍历所有节点输出寻找建议
      for (const nodeId in result.data) {
        const nodeOutput = result.data[nodeId]

        if (nodeOutput.text && nodeOutput.text.length > 0) {
          suggestions.push(...nodeOutput.text)
        }

        if (nodeOutput.string && nodeOutput.string.length > 0) {
          suggestions.push(...nodeOutput.string)
        }

        // 检查是否有原始描述
        if (nodeOutput.caption) {
          originalCaption = nodeOutput.caption
        }
      }

      if (suggestions.length > 0) {
        const currentPrompt = props.prompt
        const newSuggestions = suggestions.join(', ')
        const newPrompt = currentPrompt ? `${currentPrompt}, ${newSuggestions}` : newSuggestions
        emit('update:prompt', newPrompt)

        lastResult.value = {
          type: 'smart',
          success: true,
          suggestions: suggestions,
          count: suggestions.length,
          hasOriginalCaption: !!originalCaption
        }

        if (originalCaption) {
          console.log('Original image description:', originalCaption)
        }
      } else {
        console.error('No suggestions found in result')
        lastResult.value = { type: 'smart', success: false }
      }
    } else {
      console.error('No text result found')
      lastResult.value = { type: 'smart', success: false }
    }
  })
  .onError((error) => {
    console.error('Prompt WebSocket error:', error)
    lastResult.value = { type: 'smart', success: false }
    alert('Error fetching smart AI suggestions')
  })
  .onStatusChange((status) => {
    console.log('Prompt status changed:', status)
  })

// Methods
const updatePrompt = (value) => {
  emit('update:prompt', value)
}

const fetchSmartSuggestions = async () => {
  if (!props.canGetSuggestions || !props.uploadedFile || wsClient.status.isProcessing) {
    return
  }

  lastResult.value = null
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('image', props.uploadedFile)

    console.log('Sending request to /gopainter/api/smart-suggestions')

    const response = await fetch('/gopainter/api/smart-suggestions', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Received smart suggestions response:', result)

    if (result.prompt_id) {
      // 使用 WebSocket 连接监控获取 prompt 的进度
      await wsClient.connect(result.prompt_id)
    } else {
      console.error('No prompt_id received from server')
      lastResult.value = { type: 'smart', success: false }
      errorMessage.value = 'Invalid response from server'
      setTimeout(() => errorMessage.value = '', 5000)
    }

  } catch (error) {
    console.error('Error fetching smart suggestions:', error)
    lastResult.value = { type: 'smart', success: false }
    wsClient.close()

    errorMessage.value = 'Network error, please try again'
    setTimeout(() => errorMessage.value = '', 5000)
  }
}

const getPromptStatusText = () => {
  switch (wsClient.status.status) {
    case 'connecting':
      return 'Connecting to AI analysis...'
    case 'processing':
      return 'Analyzing image for smart suggestions...'
    case 'completed':
      return 'Smart suggestions added!'
    case 'error':
      return 'Failed to get suggestions'
    case 'disconnected':
      return 'Connection lost'
    default:
      return 'Preparing analysis...'
  }
}

const getStatusMessage = () => {
  if (!lastResult.value) return ''

  const { type, success, count, hasOriginalCaption } = lastResult.value

  if (!success) {
    return `❌ Failed to get ${type} suggestions`
  }

  if (type === 'generic') {
    return `✅ Added ${count} generic suggestions`
  } else if (type === 'image_based') {
    return `✨ Added ${count} AI-analyzed suggestions from your image`
  } else if (type === 'fallback') {
    return `⚠️ Added ${count} fallback suggestions (AI analysis partial)`
  } else {
    return `✅ Added ${count} smart suggestions`
  }
}

// Cleanup on component unmount
onUnmounted(() => {
  wsClient.close()
})
</script>

<style scoped>
</style>