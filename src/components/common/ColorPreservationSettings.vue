<template>
  <Card class="rounded-lg shadow-md border border-gray-200">
    <template #title>
      <span class="text-lg font-semibold text-gray-800">Color Preservation Settings</span>
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">Color Preservation</label>
          <div class="flex space-x-4">
            <div class="flex items-center space-x-2">
              <RadioButton
                :modelValue="preservation"
                @update:modelValue="updatePreservation"
                inputId="preservation_on"
                name="preservation"
                value="ON"
              />
              <label for="preservation_on" class="text-sm text-gray-700 cursor-pointer">ON</label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioButton
                :modelValue="preservation"
                @update:modelValue="updatePreservation"
                inputId="preservation_off"
                name="preservation"
                value="OFF"
              />
              <label for="preservation_off" class="text-sm text-gray-700 cursor-pointer">OFF</label>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import RadioButton from 'primevue/radiobutton'

// Props
const props = defineProps({
  preservation: {
    type: String,
    default: 'OFF'
  }
})

// Emits
const emit = defineEmits(['update:preservation'])

// Methods
const updatePreservation = (value) => {
  emit('update:preservation', value)
}
</script>

<style scoped>

</style>