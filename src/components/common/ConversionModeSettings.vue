<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold text-gray-800">Conversion Mode</span>
        <Button
          icon="pi pi-question-circle"
          class="p-button-text p-button-sm text-gray-500 hover:text-gray-700"
          v-tooltip="'Choose the conversion mode for processing'"
        />
      </div>
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <RadioButton
              :modelValue="mode"
              @update:modelValue="updateMode"
              inputId="mode_underpainting"
              name="conversionMode"
              value="underpainting"
            />
            <label for="mode_underpainting" class="text-sm text-gray-700 cursor-pointer">
              Underpainting Layer Separation
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioButton
              :modelValue="mode"
              @update:modelValue="updateMode"
              inputId="mode_line_underpainting"
              name="conversionMode"
              value="line_underpainting"
            />
            <label for="mode_line_underpainting" class="text-sm text-gray-700 cursor-pointer">
              Line Drawing & Underpainting Layer Separation
            </label>
          </div>
        </div>

        <Button
          label="Convert to Layer Separation"
          icon="pi pi-layers"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          @click="handleConvert"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'

// Props
const props = defineProps({
  mode: {
    type: String,
    default: 'underpainting'
  }
})

// Emits
const emit = defineEmits(['update:mode', 'convert'])

// Methods
const updateMode = (value) => {
  emit('update:mode', value)
}

const handleConvert = () => {
  emit('convert')
}
</script>

<style scoped>

</style>