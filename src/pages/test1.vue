<template>
  <!-- <AssignRace /> -->
  <div class="row q-col-gutter-xs">
    <div class="col-6">
      <q-btn class="q-py-md w-100" color="primary" label="Assign Street" @click="AssignStreets = !AssignStreets, AddGuide = false, Guidestable = false" />
    </div>
    <div class="col-6">
      <q-btn class="q-py-md w-100" color="primary" label="Add Street Races Guide" @click="AddGuide = !AddGuide, Guidestable = !Guidestable, AssignStreets = false" />
    </div>
  </div>
</template>
<script setup>
import AssignRace from '../components/attack/Assign.vue';

</script>
