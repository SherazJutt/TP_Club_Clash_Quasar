<template>
  <q-layout>
    <ul>
      <li> <q-img :src="user_data.photoURL" loading="lazy" spinner-color="white" height="140px" style="max-width: 150px" /></li>
      <li>username: <span v-if="user_data.displayName">{{ user_data.displayName }}</span> <span v-else>Set Your Username</span></li>
      <li>email: {{ user_data.email }}</li>
      <li>account create on: {{ creationTime }}</li>
      <li>last sign in on: {{ lastSignInTime }}</li>
      <li>Email verification: <span v-if="(emailVerification == true)">Verified</span><span v-else>Not Verified</span>
      </li>
    </ul>
  </q-layout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { collection, onSnapshot, getDoc, addDoc, doc, deleteDoc, serverTimestamp, setDoc, updateDoc, arrayUnion, FieldValue, } from "firebase/firestore";
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'

const user_data = ref([])
const creationTime = ref()
const lastSignInTime = ref()
const emailVerification = ref()

onAuthStateChanged(auth, (user) => {
  if (user) {
    user_data.value = user
    console.log(user);

    creationTime.value = user.metadata.creationTime;
    lastSignInTime.value = user.metadata.lastSignInTime;
    emailVerification.value = user.emailVerified;

    // email.value = user.email
    // meta.value = user.metadata
    // emailverify.value = user.emailVerified






  } else {
    console.log('not signed in');
  }
});</script>
