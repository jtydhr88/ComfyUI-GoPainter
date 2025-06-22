// utils/websocket.ts - 调试版本
import { ref, reactive } from 'vue'

export interface ProcessStatus {
  visible: boolean
  status: 'idle' | 'connecting' | 'processing' | 'completed' | 'error' | 'disconnected'
  isProcessing: boolean
  queueRemaining: number | null
  promptId: string | null
}

export interface ExecutionResult {
  images?: Array<{
    url: string
    filename: string
    subfolder: string
    type: string
  }>
  text?: string
  data?: any
}

export class ComfyUIWebSocket {
  private websocket: WebSocket | null = null
  private clientId: string
  private baseUrl: string

  public status = reactive<ProcessStatus>({
    visible: false,
    status: 'idle',
    isProcessing: false,
    queueRemaining: null,
    promptId: null
  })

  private callbacks = {
    onResult: null as ((result: ExecutionResult) => void) | null,
    onError: null as ((error: string) => void) | null,
    onStatusChange: null as ((status: ProcessStatus) => void) | null
  }

  constructor(baseUrl: string = 'http://127.0.0.1:8188') {
    this.baseUrl = baseUrl
    this.clientId = this.generateClientId()
    console.log('🔧 ComfyUIWebSocket created with baseUrl:', baseUrl, 'clientId:', this.clientId)
  }

  private generateClientId(): string {
    return 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  public onResult(callback: (result: ExecutionResult) => void) {
    this.callbacks.onResult = callback
    console.log('📝 Result callback registered')
    return this
  }

  public onError(callback: (error: string) => void) {
    this.callbacks.onError = callback
    console.log('📝 Error callback registered')
    return this
  }

  public onStatusChange(callback: (status: ProcessStatus) => void) {
    this.callbacks.onStatusChange = callback
    console.log('📝 Status change callback registered')
    return this
  }

  public connect(promptId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔌 Attempting to connect WebSocket for promptId:', promptId)
      this.close() // Close any existing connection

      const wsUrl = `ws://127.0.0.1:8188/ws?clientId=${this.clientId}`
      console.log('🔗 WebSocket URL:', wsUrl)

      try {
        this.websocket = new WebSocket(wsUrl)
        this.status.promptId = promptId
        this.status.visible = true
        this.status.status = 'connecting'
        this.status.isProcessing = true

        this.websocket.onopen = () => {
          console.log('✅ WebSocket connected successfully')
          this.status.status = 'processing'
          this.notifyStatusChange()
          resolve()
        }

        this.websocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log('📨 WebSocket message received:', message)
            this.handleMessage(message)
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error)
          }
        }

        this.websocket.onerror = (error) => {
          console.error('❌ WebSocket error:', error)
          this.status.status = 'error'
          this.status.isProcessing = false
          this.notifyStatusChange()
          this.callbacks.onError?.('WebSocket connection error')
          reject(error)
        }

        this.websocket.onclose = () => {
          console.log('🔌 WebSocket disconnected')
          if (this.status.status !== 'completed') {
            this.status.status = 'disconnected'
            this.status.isProcessing = false
            this.notifyStatusChange()
          }
        }
      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error)
        this.status.status = 'error'
        this.status.isProcessing = false
        this.notifyStatusChange()
        this.callbacks.onError?.('Failed to create WebSocket connection')
        reject(error)
      }
    })
  }

  private handleMessage(message: any) {
    console.log('🔍 Handling WebSocket message type:', message.type)

    switch (message.type) {
      case 'status':
        this.handleStatusMessage(message.data)
        break
      case 'executing':
        this.handleExecutingMessage(message.data)
        break
      default:
        console.log('❓ Unknown message type:', message.type)
    }
  }

  private handleStatusMessage(data: any) {
    console.log('📊 Status message data:', data)

    if (data.status && data.status.exec_info) {
      const queueRemaining = data.status.exec_info.queue_remaining
      console.log('📊 Queue remaining:', queueRemaining)
      this.status.queueRemaining = queueRemaining

      if (queueRemaining === 0 && this.status.isProcessing) {
        console.log('✅ Queue empty, execution likely complete')
        this.status.status = 'completed'
        this.status.isProcessing = false
        this.notifyStatusChange()

        // 保存 promptId，避免在 close() 后丢失
        const currentPromptId = this.status.promptId
        console.log('💾 Saved promptId before close:', currentPromptId)

        // Get the result first, then close
        setTimeout(() => {
          console.log('🔍 Getting execution result for saved promptId:', currentPromptId)
          this.getExecutionResult(currentPromptId!)
            .then(() => {
              console.log('✅ Execution result retrieved, now resetting')
              // Force reset after getting result
              setTimeout(() => this.resetStatus(), 1000)
            })
            .catch((error) => {
              console.error('❌ Error getting result, resetting anyway:', error)
              setTimeout(() => this.resetStatus(), 1000)
            })
        }, 1000)

        // Hide status after a longer delay to allow result retrieval
        setTimeout(() => {
          this.status.visible = false
        }, 5000)
      } else if (queueRemaining > 0) {
        console.log('⏳ Still processing, queue remaining:', queueRemaining)
        this.status.status = 'processing'
        this.status.isProcessing = true
        this.notifyStatusChange()
      }
    }
  }

  private handleExecutingMessage(data: any) {
    console.log('⚡ Executing message data:', data)

    if (data.prompt_id === this.status.promptId) {
      if (data.node === null) {
        console.log('✅ Execution done (node is null)')
        this.status.status = 'completed'
        this.status.isProcessing = false
        this.notifyStatusChange()

        // 保存 promptId，避免在 close() 后丢失
        const currentPromptId = this.status.promptId
        console.log('💾 Saved promptId before close:', currentPromptId)

        // Get the result first, then close
        console.log('🔍 Getting execution result for saved promptId:', currentPromptId)
        this.getExecutionResult(currentPromptId!)
          .then(() => {
            console.log('✅ Execution result retrieved, now resetting')
            // Force reset after getting result
            setTimeout(() => this.resetStatus(), 1000)
          })
          .catch((error) => {
            console.error('❌ Error getting result, resetting anyway:', error)
            setTimeout(() => this.resetStatus(), 1000)
          })

        // Hide status after a longer delay to allow result retrieval
        setTimeout(() => {
          this.status.visible = false
        }, 5000)
      } else {
        console.log('⚡ Still executing node:', data.node)
        this.status.status = 'processing'
        this.status.isProcessing = true
        this.notifyStatusChange()
      }
    }
  }

  private async getExecutionResult(promptId: string): Promise<void> {
    console.log('🔍 Getting execution result for promptId:', promptId)

    // 添加重试机制，因为有时候结果还没准备好
    const maxRetries = 3
    let retryCount = 0

    while (retryCount < maxRetries) {
      try {
        const historyUrl = `${this.baseUrl}/history/${promptId}`
        console.log(`📡 Fetching history from (attempt ${retryCount + 1}):`, historyUrl)

        const response = await fetch(historyUrl)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const history = await response.json()
        console.log('📜 History response:', history)

        if (history[promptId] && history[promptId].outputs) {
          console.log('📤 Found outputs:', history[promptId].outputs)

          const result: ExecutionResult = {
            images: [],
            text: '',
            data: {}
          }

          let hasAnyOutput = false

          // Process the outputs
          for (const nodeId in history[promptId].outputs) {
            const nodeOutput = history[promptId].outputs[nodeId]
            console.log(`🔍 Processing node ${nodeId} output:`, nodeOutput)

            // Handle images
            if (nodeOutput.images && nodeOutput.images.length > 0) {
              console.log(`🖼️ Found ${nodeOutput.images.length} images in node ${nodeId}`)
              hasAnyOutput = true

              for (const imageInfo of nodeOutput.images) {
                console.log('🖼️ Processing image:', imageInfo)

                const imageUrl = this.getImageUrl(
                  imageInfo.filename,
                  imageInfo.subfolder,
                  imageInfo.type
                )

                console.log('🔗 Generated image URL:', imageUrl)

                result.images!.push({
                  url: imageUrl,
                  filename: imageInfo.filename,
                  subfolder: imageInfo.subfolder,
                  type: imageInfo.type
                })
              }
            }

            // Handle text outputs
            if (nodeOutput.text && nodeOutput.text.length > 0) {
              console.log('📝 Found text output:', nodeOutput.text)
              result.text = nodeOutput.text[0]
              hasAnyOutput = true
            }

            // Handle string outputs
            if (nodeOutput.string && nodeOutput.string.length > 0) {
              console.log('📝 Found string output:', nodeOutput.string)
              result.text = nodeOutput.string[0]
              hasAnyOutput = true
            }

            // Store raw data
            result.data[nodeId] = nodeOutput

            // 检查是否有任何类型的输出
            if (Object.keys(nodeOutput).length > 0) {
              hasAnyOutput = true
            }
          }

          if (hasAnyOutput) {
            console.log('✅ Final result object:', result)
            console.log('📞 Calling onResult callback with result')
            this.callbacks.onResult?.(result)
            return // 成功获取结果，退出函数
          } else {
            console.log('⚠️ No meaningful outputs found, but history exists')
            if (retryCount < maxRetries - 1) {
              console.log(`🔄 Retrying in 1 second... (${retryCount + 1}/${maxRetries})`)
              await new Promise(resolve => setTimeout(resolve, 1000))
              retryCount++
              continue
            }
          }
        } else {
          console.log('⚠️ No outputs found in history or history is empty')
          if (retryCount < maxRetries - 1) {
            console.log(`🔄 Retrying in 1 second... (${retryCount + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, 1000))
            retryCount++
            continue
          }
        }

        // 如果到这里说明所有重试都失败了
        console.log('❌ All retries exhausted, no valid outputs found')
        this.callbacks.onError?.('No outputs found after multiple attempts')
        return

      } catch (error) {
        console.error(`❌ Error getting execution result (attempt ${retryCount + 1}):`, error)

        if (retryCount < maxRetries - 1) {
          console.log(`🔄 Retrying due to error... (${retryCount + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          retryCount++
          continue
        } else {
          console.error('❌ All retries exhausted due to errors')
          this.callbacks.onError?.('Failed to get execution result after multiple attempts: ' + error.message)
          throw error
        }
      }
    }
  }

  private getImageUrl(filename: string, subfolder: string, type: string): string {
    const params = new URLSearchParams({
      filename: filename,
      subfolder: subfolder,
      type: type
    })

    const url = `${this.baseUrl}/view?${params.toString()}`
    console.log('🔗 Built image URL:', url)
    return url
  }

  private notifyStatusChange() {
    console.log('📢 Status changed:', this.status)
    this.callbacks.onStatusChange?.(this.status)
  }

  public close() {
    if (this.websocket) {
      console.log('🔌 Closing WebSocket connection')
      this.websocket.close()
      this.websocket = null
    }
    // 不立即重置状态，让结果获取完成后再重置
  }

  public forceReset() {
    this.close()
    this.resetStatus()
  }

  private resetStatus() {
    console.log('🔄 Resetting status')
    this.status.visible = false
    this.status.status = 'idle'
    this.status.isProcessing = false
    this.status.queueRemaining = null
    this.status.promptId = null
  }

  public getStatusText(): string {
    switch (this.status.status) {
      case 'connecting':
        return 'Connecting to server...'
      case 'processing':
        return 'Processing...'
      case 'completed':
        return 'Processing completed!'
      case 'error':
        return 'Processing failed'
      case 'disconnected':
        return 'Connection lost'
      default:
        return 'Idle'
    }
  }
}

// 创建一个全局实例
export const comfyUIWebSocket = new ComfyUIWebSocket()