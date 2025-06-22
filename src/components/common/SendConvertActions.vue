<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #content>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            label="Send"
            icon="pi pi-send"
            :class="[
              'px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center',
              { 'opacity-50 cursor-not-allowed': !canSend || sendProcessing }
            ]"
            :disabled="!canSend || sendProcessing"
            @click="handleSend"
          >
            <ProgressSpinner v-if="sendProcessing" class="ml-2 w-4 h-4" />
          </Button>

          <Button
            label="Convert to PSD"
            icon="pi pi-file-export"
            :class="[
              'px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center',
              { 'opacity-50 cursor-not-allowed': !canConvert || convertProcessing }
            ]"
            :disabled="!canConvert || convertProcessing"
            @click="handleConvert"
          >
            <ProgressSpinner v-if="convertProcessing" class="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

// Props
const props = defineProps({
  canSend: {
    type: Boolean,
    default: false
  },
  canConvert: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['send', 'convert'])

// Data
const sendProcessing = ref(false)
const convertProcessing = ref(false)

// Methods
const handleSend = async () => {
  if (!props.canSend || sendProcessing.value) return

  sendProcessing.value = true
  emit('send')

  // Reset processing state after a delay
  setTimeout(() => {
    sendProcessing.value = false
  }, 3000)
}

const handleConvert = async () => {
  if (!props.canConvert || convertProcessing.value) return

  convertProcessing.value = true
  emit('convert')

  // Reset processing state after a delay
  setTimeout(() => {
    convertProcessing.value = false
  }, 2000)
}
</script>

<style scoped>

</style>