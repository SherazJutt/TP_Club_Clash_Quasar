<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Default progress" color="primary" @click="showDefault" />
  </div>
</template>

<script>
import { useQuasar, QSpinnerGears } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()



    return { showDefault }
  }
}
</script>
