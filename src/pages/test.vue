<template>
  <div class="q-pa-md">
    <div class="q-gutter-xs">
      <q-chip removable v-model="icecream" @remove="log('Icecream')" color="primary" text-color="white" icon="cake">
        Ice cream
      </q-chip>
    </div>

    <q-btn color="primary" label="Reset" @click="onResetClick" class="q-mt-sm" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const icecream = ref(true)
    const eclair = ref(true)
    const cupcake = ref(true)
    const gingerbread = ref(true)

    return {
      icecream,
      eclair,
      cupcake,
      gingerbread,

      onResetClick() {
        icecream.value = true
        eclair.value = true
        cupcake.value = true
        gingerbread.value = true
      },

      log(desert) {
        // console.log(`${desert} has been removed`)
      }
    }
  }
}
</script>
