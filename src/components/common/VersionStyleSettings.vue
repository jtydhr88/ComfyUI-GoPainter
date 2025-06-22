<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Version and Style settings</span>
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="space-y-2">
          <label for="version" class="block text-sm font-medium text-gray-700">Version</label>
          <Dropdown
            id="version"
            :modelValue="version"
            @update:modelValue="updateVersion"
            :options="versionOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="Select Version"
            class="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="space-y-2">
          <label for="style" class="block text-sm font-medium text-gray-700">Style</label>
          <Dropdown
            id="style"
            :modelValue="style"
            @update:modelValue="updateStyle"
            :options="styleOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="Select Style"
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
  version: {
    type: String,
    default: 'v1.2'
  },
  style: {
    type: String,
    default: 'default_g_pen'
  }
})

// Emits
const emit = defineEmits(['update:version', 'update:style'])

// Options
const versionOptions = ref([
  { name: 'v1.2', value: 'v1.2' },
  { name: 'v1.1', value: 'v1.1' },
  { name: 'v1.0', value: 'v1.0' }
])

const styleOptions = ref([
  { name: 'Default (G Pen)', value: 'default_g_pen' },
  { name: 'Manga Style', value: 'manga_style' },
  { name: 'Sketch Style', value: 'sketch_style' },
  { name: 'Clean Line', value: 'clean_line' }
])

// Methods
const updateVersion = (value) => {
  emit('update:version', value)
}

const updateStyle = (value) => {
  emit('update:style', value)
}
</script>

<style scoped>

</style>