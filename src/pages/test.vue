<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn @click="simulateProgress(0)" label="Button" />

  </div>
</template>

<script setup>
import { ref } from 'vue'

function simulateProgress() {
  console.log(Math.random().toString(36).slice(2));
}


</script>
