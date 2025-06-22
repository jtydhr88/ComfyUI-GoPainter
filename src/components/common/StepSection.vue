<template>
  <Card :class="[
    'rounded-lg shadow-md border border-gray-200 transition-all',
    {
      'border-blue-500': isActive,
      'opacity-50': !isEnabled
    }
  ]">
    <template #title>
      <div class="flex items-center space-x-3">
        <div :class="[
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          {
            'bg-blue-600 text-white': isActive,
            'bg-green-600 text-white': isCompleted,
            'bg-gray-300 text-gray-600': !isActive && !isCompleted
          }
        ]">
          <span v-if="!isCompleted">{{ stepNumber }}</span>
          <i v-else class="pi pi-check"></i>
        </div>
        <span class="text-lg font-semibold text-gray-800">{{ title }}</span>
      </div>
    </template>
    <template #content>
      <div :class="['space-y-4', { 'opacity-50 pointer-events-none': !isEnabled }]">
        <slot />
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  stepNumber: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>

</style>