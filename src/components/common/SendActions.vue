<template>
  <Card class="actions-card">
    <template #content>
      <div class="actions-section">
        <Button
          label="Send"
          icon="pi pi-send"
          :class="['send-button', { 'processing': processing }]"
          :disabled="!canSend || processing"
          @click="handleSend"
        >
          <ProgressSpinner v-if="processing" class="spinner" />
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
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
  }
})

// Emits
const emit = defineEmits(['send'])

// Methods
const handleSend = () => {
  if (!props.canSend || props.processing) return
  emit('send')
}
</script>

<style scoped>

</style>