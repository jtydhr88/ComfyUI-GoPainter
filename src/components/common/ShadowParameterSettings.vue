<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Parameter Settings</span>
    </template>
    <template #content>
      <div class="space-y-6">
        <!-- Color Parameter -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">Color</label>
          <div class="flex items-center space-x-3">
            <ColorPicker
              :modelValue="color"
              @update:modelValue="updateColor"
              class="w-12 h-8 rounded border border-gray-300"
            />
            <InputText
              :modelValue="color"
              @update:modelValue="updateColor"
              class="flex-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>

        <!-- Light Source Depth -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">
            Light Source Depth: {{ lightSourceDepth.toFixed(1) }}
          </label>
          <Slider
            :modelValue="lightSourceDepth"
            @update:modelValue="updateLightSourceDepth"
            :min="0"
            :max="2"
            :step="0.1"
            class="w-full"
          />
        </div>

        <!-- Intensity -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">
            Intensity: {{ intensity.toFixed(1) }}
          </label>
          <div class="flex items-center space-x-2">
            <Slider
              :modelValue="intensity"
              @update:modelValue="updateIntensity"
              :min="0"
              :max="2"
              :step="0.1"
              class="flex-1"
            />
            <Button
              icon="pi pi-refresh"
              class="p-button-text p-button-sm text-gray-500 hover:text-gray-700"
              @click="resetIntensity"
              v-tooltip="'Reset Intensity'"
            />
          </div>
        </div>

        <!-- Target Depth -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">
            Target Depth: {{ targetDepth.toFixed(1) }}
          </label>
          <Slider
            :modelValue="targetDepth"
            @update:modelValue="updateTargetDepth"
            :min="0"
            :max="2"
            :step="0.1"
            class="w-full"
          />
        </div>

        <!-- Use Toon Shading -->
        <div class="flex items-center space-x-3">
          <ToggleButton
            :modelValue="useToonShading"
            @update:modelValue="updateUseToonShading"
            onLabel="Use Toon Shading"
            offLabel="Use Toon Shading"
            class="text-sm"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Slider from 'primevue/slider'
import Button from 'primevue/button'
import ColorPicker from 'primevue/colorpicker'
import InputText from 'primevue/inputtext'
import ToggleButton from 'primevue/togglebutton'

// Props
const props = defineProps({
  color: {
    type: String,
    default: '#000000'
  },
  lightSourceDepth: {
    type: Number,
    default: 0
  },
  intensity: {
    type: Number,
    default: 1
  },
  targetDepth: {
    type: Number,
    default: 1
  },
  useToonShading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'update:color',
  'update:lightSourceDepth',
  'update:intensity',
  'update:targetDepth',
  'update:useToonShading'
])

// Methods
const updateColor = (value) => {
  emit('update:color', value)
}

const updateLightSourceDepth = (value) => {
  emit('update:lightSourceDepth', value)
}

const updateIntensity = (value) => {
  emit('update:intensity', value)
}

const updateTargetDepth = (value) => {
  emit('update:targetDepth', value)
}

const updateUseToonShading = (value) => {
  emit('update:useToonShading', value)
}

const resetIntensity = () => {
  emit('update:intensity', 1)
}
</script>

<style scoped>

</style>