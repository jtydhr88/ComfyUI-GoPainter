import { app } from "../../../scripts/app.js";
import { ref } from "vue";

const defineStore = app.extensionManager.defineStore

export const useLineartStore = defineStore('lineart', () => {

  const uploadedFile = ref<File | null>(null)
  const previewImage = ref<string | null>(null)

  const outputImage = ref<string | null>(null)
  const processing = ref<boolean>(false)

  // 参数状态
  const aiStrength = ref<number>(0.6)
  const bold = ref<number>(0)
  const stroke = ref<number>(0)
  const prompt = ref<string>('')
  // 移除 autoPrompt
  const transparent = ref<boolean>(false)

  function setUploadedFile(file: File | null) {
    uploadedFile.value = file
  }

  function setOutputImage(value: string | null) {
    outputImage.value = value
  }

  function setPreviewImage(value: string | null) {
    previewImage.value = value
  }

  function setProcessing(value: boolean) {
    processing.value = value
  }

  function setAiStrength(value: number) {
    aiStrength.value = value
  }

  function setBold(value: number) {
    bold.value = value
  }

  function setStroke(value: number) {
    stroke.value = value
  }

  function setPrompt(value: string) {
    prompt.value = value
  }

  // 移除 setAutoPrompt

  function setTransparent(value: boolean) {
    transparent.value = value
  }

  // 重置所有状态的方法
  function reset() {
    uploadedFile.value = null
    previewImage.value = null
    outputImage.value = null
    processing.value = false
    aiStrength.value = 0.6
    bold.value = 0
    stroke.value = 0
    prompt.value = ''
    // 移除 autoPrompt.value = false
    transparent.value = false
  }

  return {
    uploadedFile,
    previewImage,
    outputImage,
    processing,
    aiStrength,
    bold,
    stroke,
    prompt,
    // 移除 autoPrompt,
    transparent,

    setUploadedFile,
    setOutputImage,
    setPreviewImage,
    setProcessing,
    setAiStrength,
    setBold,
    setStroke,
    setPrompt,
    // 移除 setAutoPrompt,
    setTransparent,
    reset
  }
})