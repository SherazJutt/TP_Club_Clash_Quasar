<template>
  <div v-if="store.curr_user_role == 'admin'">
    <div>{{ store.curr_user_role }}</div>
    <q-btn @click="store.increment()">+</q-btn>
  </div>
  <div v-else-if="store.curr_user_role == 'user'">
    <h3>NOt Admin</h3>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useGlobalVariables } from 'src/stores/GlobalVariables';

const store = useGlobalVariables();

const interval = setInterval(() => {
  console.log(store.curr_user_role);

  if (store.curr_user_role == 'admin') {
    console.log('yes');
    clearInterval(interval)
  }
}, 1000);

onBeforeMount(() => {
  store.setUser()
})


</script>
