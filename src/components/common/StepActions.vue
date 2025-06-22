<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #content>
      <div class="flex justify-center">
        <Button
          label="Send"
          icon="pi pi-send"
          :class="[
            'px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors',
            { 'opacity-50 cursor-not-allowed': !canSend || processing }
          ]"
          :disabled="!canSend || processing"
          @click="handleSend"
        >
          <ProgressSpinner v-if="processing" class="ml-2 w-4 h-4" />
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

// Props
const props = defineProps({
  canSend: {
    type: Boolean,
    default: false
  },
  processing: {
    type: Boolean,
    default: false
  },
  sendLabel: {
    type: String,
    default: 'Send'
  },
  convertLabel: {
    type: String,
    default: 'Convert'
  },
  showConvert: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['send', 'convert'])

// Data
const convertProcessing = ref(false)

// Methods
const handleSend = () => {
  if (!props.canSend || props.processing) return
  emit('send')
}

const handleConvert = async () => {
  if (!props.canSend || convertProcessing.value) return

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