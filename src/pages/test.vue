<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="With QToolbar" color="primary" @click="toolbar = true" />



    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-input v-model="min" type="text" label="Minutes" />
          <q-input v-model="sec" type="text" label="Seconds" />
          <q-input v-model="milisec" type="text" label="MiliSeconds" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      toolbar: ref(false)
    }
  }
}
</script>
