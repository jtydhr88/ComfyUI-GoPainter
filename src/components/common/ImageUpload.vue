<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Rough Sketch Input Field</span>
    </template>
    <template #content>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
           @drop="onDrop" @dragover="onDragOver" @dragleave="onDragLeave">
        <FileUpload
          mode="basic"
          name="demo[]"
          :auto="false"
          chooseLabel="Drop image here"
          class="w-full"
          @select="onFileSelect"
          accept="image/*"
        />
        <div class="mt-4 space-y-3">
          <i class="pi pi-image text-4xl text-gray-400"></i>
          <p class="text-gray-600">Drop image here</p>
          <p class="text-sm text-gray-500">or</p>
          <Button
            label="Paste from clipboard"
            icon="pi pi-clipboard"
            class="p-button-text text-blue-600 hover:text-blue-800"
            @click="pasteFromClipboard"
          />
        </div>
      </div>

      <div v-if="uploadedFile && !previewImage" class="mt-4 p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <i class="pi pi-file text-gray-500"></i>
            <div>
              <p class="text-sm font-medium text-gray-700">{{ uploadedFile.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(uploadedFile.size) }}</p>
            </div>
          </div>
          <Button
            icon="pi pi-times"
            class="p-button-text p-button-sm text-red-600 hover:text-red-800"
            @click="removeImage"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'

const props = defineProps({
  uploadedFile: {
    type: [File, null],
    default: null
  },
  previewImage: {
    type: [String, null],
    default: null
  }
})

const emit = defineEmits(['file-selected', 'update:uploadedFile', 'update:previewImage'])

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const onFileSelect = (event) => {
  const file = event.files[0]
  handleFile(file)
}

const onDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const onDragOver = (event) => {
  event.preventDefault()
}

const onDragLeave = (event) => {
  event.preventDefault()
}

const handleFile = (file) => {
  if (!file || !file.type.startsWith('image/')) {
    console.warn('Invalid file type. Please select an image.')
    return
  }
  emit('update:uploadedFile', file)

  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:previewImage', e.target.result)
  }
  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    emit('update:previewImage', null)
  }
  reader.readAsDataURL(file)

  emit('file-selected', file)
}

const pasteFromClipboard = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read()
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          const blob = await clipboardItem.getType(type)
          const file = new File([blob], 'pasted-image.png', { type })
          handleFile(file)
          return // Exit after processing first image
        }
      }
    }
    console.warn('No image found in clipboard')
  } catch (err) {
    console.warn('Failed to read clipboard:', err)
    alert('Unable to access clipboard. Please use drag & drop or file selection instead.')
  }
}

const removeImage = () => {
  emit('update:previewImage', null)
  emit('update:uploadedFile', null)
  emit('file-selected', null)
}
</script>

<style scoped>
.border-dashed:hover {
  border-color: #9ca3af;
}
</style>