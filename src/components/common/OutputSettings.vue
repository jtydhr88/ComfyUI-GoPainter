<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Output Settings</span>
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <Checkbox
            :modelValue="transparent"
            @update:modelValue="updateTransparent"
            inputId="transparentOutput"
            binary
          />
          <label for="transparentOutput" class="text-sm text-gray-700 cursor-pointer">
            Output with transparent image
          </label>
        </div>

        <Button
          label="Send"
          icon="pi pi-send"
          :class="[
            'w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center',
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
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

// Props
const props = defineProps({
  transparent: {
    type: Boolean,
    default: false
  },
  canSend: {
    type: Boolean,
    default: false
  },
  processing: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:transparent', 'send'])

// Methods
const updateTransparent = (value) => {
  emit('update:transparent', value)
}

const handleSend = () => {
  if (!props.canSend || props.processing) return
  emit('send')
}
</script>

<style scoped>

</style>