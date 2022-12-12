<template>
  <q-layout>
    <div class="q-mx-auto border q-mt-xl q-pa-md" style="max-width:350px;">
      <div style=" width: 100px; border-radius: 100px;" class="q-mx-auto q-mb-md"> <q-img :src="user_data.photoURL" loading="lazy" style="border-radius: 100px;" width=" 100%" spinner-color="white" /></div>
      <div class="user_details">
        <div>Username: <span v-if="user_data.displayName">{{ user_data.displayName }}</span> <span v-else>Set Your Username</span></div>
        <div>email: {{ user_data.email }}</div>
        <div>account create on: {{ creationTime }}</div>
        <div>last sign in on: {{ lastSignInTime }}</div>
        <div>Email verification: <span v-if="(emailVerification == true)">Verified</span><span v-else>Not Verified</span></div>
      </div>
    </div>

    <br v-for="item in 15">

    <!-- <ul>
      <li> <q-img :src="user_data.photoURL" loading="lazy" spinner-color="white" height="140px" style="max-width: 150px" /></li>
      <li>username: <span v-if="user_data.displayName">{{ user_data.displayName }}</span> <span v-else>Set Your Username</span></li>
      <li>email: {{ user_data.email }}</li>
      <li>account create on: {{ creationTime }}</li>
      <li>last sign in on: {{ lastSignInTime }}</li>
      <li>Email verification: <span v-if="(emailVerification == true)">Verified</span><span v-else>Not Verified</span></li>
    </ul> -->
  </q-layout>
</template>
<script setup>
import { ref } from "vue";
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'

const user_data = ref([])
const creationTime = ref()
const lastSignInTime = ref()
const emailVerification = ref()

onAuthStateChanged(auth, (user) => {
  if (user) {
    user_data.value = user
    creationTime.value = user.metadata.creationTime;
    lastSignInTime.value = user.metadata.lastSignInTime;
    emailVerification.value = user.emailVerified;
  } else {
    console.log('not signed in');
  }
});
</script>
<style lang="scss">
.user_details {
  display: flex;
  flex-direction: column;

  &>div {
    margin: 4px 0;
  }
}
</style>
