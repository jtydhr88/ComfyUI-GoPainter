<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">{{ title }}</span>
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
        <div class="mt-4 space-y-2">
          <i class="pi pi-image text-4xl text-gray-400"></i>
          <p class="text-gray-600">Drop image here</p>
          <p class="text-sm text-gray-500">or</p>
          <p class="text-sm text-gray-500">Click to upload</p>
        </div>
      </div>

      <div class="mt-4 text-center">
        <Button
          label="Paste from clipboard"
          icon="pi pi-clipboard"
          class="p-button-text text-blue-600 hover:text-blue-800"
          @click="pasteFromClipboard"
        />
      </div>

      <div v-if="previewImage" class="mt-4 relative">
        <img :src="previewImage" alt="Uploaded preview" class="w-full h-48 object-cover rounded-lg" />
        <Button
          icon="pi pi-times"
          class="absolute top-2 right-2 p-button-text p-button-sm bg-red-500 text-white hover:bg-red-600 rounded-full"
          @click="removeImage"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['file-selected'])

const previewImage = ref(null)
const uploadedFile = ref(null)

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
    return
  }

  uploadedFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
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
          break
        }
      }
    }
  } catch (err) {
    console.warn('Failed to read clipboard:', err)
  }
}

const removeImage = () => {
  previewImage.value = null
  uploadedFile.value = null
  emit('file-selected', null)
}
</script>

<style scoped>

</style>