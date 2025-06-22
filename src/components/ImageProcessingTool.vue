<template>
  <div class="min-h-screen">
    <!-- Top Navigation -->
    <NavigationBar
      v-model="activeTab"
      :credits="credits"
      @tab-change="onTabChange"
    />

    <!-- Main Content Area -->
    <div class="max-w-7xl pt-8">
      <!-- Dynamic Page Components -->
      <component
        :is="currentPageComponent"
        ref="currentPageRef"
        :key="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import NavigationBar from './NavigationBar.vue'
import LineartPage from './pages/LineartPage.vue'
import InkingPage from './pages/InkingPage.vue'
import UnderColoringPage from './pages/UnderColoringPage.vue'
import ShadowingPage from './pages/ShadowingPage.vue'
import ColoringPage from './pages/ColoringPage.vue'

// Navigation state
const activeTab = ref(0)
const credits = ref(0)
const currentPageRef = ref(null)

// Page mapping
const pageComponents = {
  0: LineartPage,         // Lineart
  1: InkingPage,          // Inking
  2: UnderColoringPage,   // Under coloring
  3: ShadowingPage,       // Shadowing
  4: ColoringPage,        // Coloring
  5: LineartPage,         // img2img
  6: LineartPage,         // Upscaling
  7: LineartPage          // photo2illust
}

const pageNames = [
  'Lineart', 'Inking', 'Under coloring', 'Shadowing',
  'Coloring', 'img2img', 'Upscaling', 'photo2illust'
]

// Computed properties
const currentPage = computed(() => pageNames[activeTab.value])
const currentPageComponent = computed(() => pageComponents[activeTab.value])

// Methods
const onTabChange = async (event) => {
  // Reset current page state before switching
  if (currentPageRef.value && currentPageRef.value.reset) {
    currentPageRef.value.reset()
  }

  activeTab.value = event.index

  // Wait for component to mount before accessing it
  await nextTick()

  console.log(`Switched to ${currentPage.value} page`)
}

// Global event handlers
const handleGlobalError = (error) => {
  console.error('Application error:', error)
  // Here you could show a toast notification or error dialog
}

// Provide global error handling
window.addEventListener('error', handleGlobalError)
window.addEventListener('unhandledrejection', handleGlobalError)
</script>

<style scoped>

</style>