<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Model Settings</span>
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="space-y-2">
          <label for="model" class="block text-sm font-medium text-gray-700">Model</label>
          <Dropdown
            id="model"
            :modelValue="model"
            @update:modelValue="updateModel"
            :options="modelOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="Select Model"
            class="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'

// Props
const props = defineProps({
  model: {
    type: String,
    default: 'Brush'
  }
})

// Emits
const emit = defineEmits(['update:model'])

// Model options
const modelOptions = ref([
  { name: 'Brush', value: 'Brush' },
  { name: 'Pencil', value: 'Pencil' },
  { name: 'Watercolor', value: 'Watercolor' },
  { name: 'Oil Paint', value: 'Oil Paint' },
  { name: 'Digital', value: 'Digital' }
])

// Methods
const updateModel = (value) => {
  emit('update:model', value)
}
</script>

<style scoped>

</style>