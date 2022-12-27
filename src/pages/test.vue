<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn :loading="loading[0]" color="secondary" @click="simulateProgress" label="Button" />

  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const loading = ref([false])

    const progress = ref(false)

    function simulateProgress(number) {
      // we set loading state
      loading.value[0] = true

      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        loading.value[number] = false
      }, 3000)
    }

    return {
      loading,
      progress,
      simulateProgress
    }
  }
}
</script>
