<template>
  <div class="border-b border-gray-200 shadow-sm fixed w-full z-50">
    <TabMenu
      :model="navItems"
      v-model:activeIndex="activeTab"
      class="max-w-7xl mx-auto px-4"
      @tab-change="onTabChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TabMenu from 'primevue/tabmenu'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'tab-change'])

const navItems = ref([
  {label: 'Lineart', icon: 'pi pi-palette'},
  {label: 'Inking', icon: 'pi pi-pencil'},
  {label: 'Under coloring', icon: 'pi pi-brush'},
  {label: 'Shadowing', icon: 'pi pi-moon'},
  {label: 'Coloring', icon: 'pi pi-image'}
])

const activeTab = ref(props.modelValue)

const onTabChange = (event) => {
  activeTab.value = event.index
  emit('update:modelValue', event.index)
  emit('tab-change', {
    index: event.index,
    page: navItems.value[event.index]?.label
  })
}
</script>

<style>

</style>