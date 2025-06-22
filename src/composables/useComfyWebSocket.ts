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

  const wsClient = new ComfyUIWebSocket()

  if (onResult) {
    wsClient.onResult(onResult)
  }

  if (onError) {
    wsClient.onError(onError)
  }

  if (onStatusChange) {
    wsClient.onStatusChange(onStatusChange)
  }

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

  const processImage = async (
    apiEndpoint: string,
    file: File | null,
    params: Record<string, any> = {}
  ) => {
    const formData = new FormData()

    if (file) {
      formData.append('image', file)
    }

    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value.toString())
    }

    return executeTask(apiEndpoint, formData)
  }

  const getSmartSuggestions = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    return executeTask('/gopainter/api/smart-suggestions', formData)
  }

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

  const cleanup = () => {
    wsClient.close()
  }

  if (autoCleanup) {
    onUnmounted(cleanup)
  }

  return {
    wsClient,
    status: wsClient.status,

    executeTask,
    processImage,

    getSmartSuggestions,
    processLineart,
    processColoring,

    getStatusText,
    cleanup
  }
}

export const TASK_TYPES = {
  LINEART: 'lineart',
  COLORING: 'coloring',
  SHADOWING: 'shadowing',
  INKING: 'inking',
  UNDER_COLORING: 'under coloring',
  PROMPT_ANALYSIS: 'prompt analysis'
} as const

export type TaskType = typeof TASK_TYPES[keyof typeof TASK_TYPES]