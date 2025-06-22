<template>
  <Card class="rounded-lg shadow-md border border-gray-200 h-full">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Output Field</span>
    </template>
    <template #content>
      <div class="h-96 flex flex-col">
        <div v-if="!image" class="flex-1 flex flex-col items-center justify-center text-gray-500">
          <i class="pi pi-image text-6xl mb-4 text-gray-300"></i>
          <p class="text-center">Processed image will appear here</p>
        </div>

        <div v-else class="flex-1 relative">
          <img :src="image" alt="Processed result" @load="onImageLoad" class="w-full h-full object-contain rounded-lg" />
          <div v-if="loading" class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg">
            <ProgressSpinner class="mb-2" />
            <p class="text-white">Processing...</p>
          </div>
        </div>

        <div class="flex justify-center space-x-2 mt-4" v-if="image && !loading">
          <Button
            icon="pi pi-thumbs-up"
            class="p-button-text text-green-600 hover:text-green-800"
            v-tooltip="'Like result'"
            @click="likeImage"
          />
          <Button
            icon="pi pi-download"
            class="p-button-text text-blue-600 hover:text-blue-800"
            v-tooltip="'Download image'"
            @click="downloadImage"
          />
          <Button
            icon="pi pi-share-alt"
            class="p-button-text text-purple-600 hover:text-purple-800"
            v-tooltip="'Share image'"
            @click="shareImage"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-text text-red-600 hover:text-red-800"
            v-tooltip="'Remove image'"
            @click="removeImage"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, watch } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
  image: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['like', 'download', 'share', 'remove'])

const loading = ref(false)

watch(() => props.image, (newImage, oldImage) => {
  if (newImage && newImage !== oldImage) {
    loading.value = true
  }
})

const onImageLoad = () => {
  loading.value = false
}

const likeImage = () => {
  emit('like', props.image)
  console.log('Image liked!')
}

const downloadImage = () => {
  if (!props.image) return

  const link = document.createElement('a')
  link.href = props.image
  link.download = `processed-image-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  emit('download', props.image)
}

const shareImage = async () => {
  if (!props.image) return

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'AI Processed Image',
        text: 'Check out this AI-processed image!',
        url: props.image
      })
    } else {
      await navigator.clipboard.writeText(props.image)
      console.log('Image URL copied to clipboard!')
    }
    emit('share', props.image)
  } catch (error) {
    console.error('Failed to share:', error)
  }
}

const removeImage = () => {
  emit('remove')
}
</script>

<style scoped>

</style>