// composables/useComfyWebSocket.ts
import { onUnmounted } from 'vue'
import { ComfyUIWebSocket, type ExecutionResult, type ProcessStatus } from '@/utils/websocket'

export interface UseComfyWebSocketOptions {
  onResult?: (result: ExecutionResult) => void
  onError?: (error: string) => void
  onStatusChange?: (status: ProcessStatus) => void
  autoCleanup?: boolean
}

export function useComfyWebSocket(options: UseComfyWebSocketOptions = {}) {
  const {
    onResult,
    onError,
    onStatusChange,
    autoCleanup = true
  } = options

  // 创建 WebSocket 客户端实例
  const wsClient = new ComfyUIWebSocket()

  // 设置回调函数
  if (onResult) {
    wsClient.onResult(onResult)
  }

  if (onError) {
    wsClient.onError(onError)
  }

  if (onStatusChange) {
    wsClient.onStatusChange(onStatusChange)
  }

  // 发送请求并监控进度的通用方法
  const executeTask = async (
    apiEndpoint: string,
    formData: FormData,
    options: {
      method?: string
      headers?: Record<string, string>
    } = {}
  ) => {
    try {
      const { method = 'POST', headers = {} } = options

      console.log(`Sending request to ${apiEndpoint}`)

      const response = await fetch(apiEndpoint, {
        method,
        body: formData,
        headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Received response:', result)

      if (result.prompt_id) {
        // 使用 WebSocket 连接监控进度
        await wsClient.connect(result.prompt_id)
        return result
      } else {
        throw new Error('No prompt_id received from server')
      }

    } catch (error) {
      console.error(`Error executing task at ${apiEndpoint}:`, error)
      wsClient.close()
      throw error
    }
  }

  // 图像处理任务
  const processImage = async (
    apiEndpoint: string,
    file: File | null,
    params: Record<string, any> = {}
  ) => {
    const formData = new FormData()

    if (file) {
      formData.append('image', file)
    }

    // 添加参数
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value.toString())
    }

    return executeTask(apiEndpoint, formData)
  }

  // 获取智能建议
  const getSmartSuggestions = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    return executeTask('/gopainter/api/smart-suggestions', formData)
  }

  // 处理 Lineart 任务
  const processLineart = async (
    file: File,
    params: {
      aiStrength: number
      bold: number
      stroke: number
      prompt: string
      transparent: boolean
    }
  ) => {
    return processImage('/gopainter/api/test', file, params)
  }

  // 处理 Coloring 任务
  const processColoring = async (
    lineDrawingFile: File,
    underpaintingFile: File | null,
    params: {
      aiStrength: number
      detail: number
      model: string
      colorPreservation: string
      conversionMode: string
    }
  ) => {
    const formData = new FormData()
    formData.append('lineDrawing', lineDrawingFile)

    if (underpaintingFile) {
      formData.append('underpainting', underpaintingFile)
    }

    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value.toString())
    }

    return executeTask('/gopainter/api/coloring', formData)
  }

  // 获取状态文本的辅助方法
  const getStatusText = (taskType: string = 'task') => {
    switch (wsClient.status.status) {
      case 'connecting':
        return `Connecting to server...`
      case 'processing':
        return `Processing ${taskType}...`
      case 'completed':
        return `${taskType} completed!`
      case 'error':
        return `${taskType} failed`
      case 'disconnected':
        return 'Connection lost'
      default:
        return 'Idle'
    }
  }

  // 清理方法
  const cleanup = () => {
    wsClient.close()
  }

  // 自动清理
  if (autoCleanup) {
    onUnmounted(cleanup)
  }

  return {
    // WebSocket 客户端和状态
    wsClient,
    status: wsClient.status,

    // 通用方法
    executeTask,
    processImage,

    // 特定任务方法
    getSmartSuggestions,
    processLineart,
    processColoring,

    // 辅助方法
    getStatusText,
    cleanup
  }
}

// 预定义的任务类型
export const TASK_TYPES = {
  LINEART: 'lineart',
  COLORING: 'coloring',
  SHADOWING: 'shadowing',
  INKING: 'inking',
  UNDER_COLORING: 'under coloring',
  PROMPT_ANALYSIS: 'prompt analysis'
} as const

export type TaskType = typeof TASK_TYPES[keyof typeof TASK_TYPES]