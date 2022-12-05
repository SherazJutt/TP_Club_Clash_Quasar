<template>
  <div class="h-[100vh] flex justify-center items-center bg-gray-900">
    <div>
      <h1 class="text-success text-4xl text-center mb-12">Sign Up</h1>
      <form @submit.prevent="signup" class="p-8 bg-gray-800 w-96 rounded-lg border-2 border-success">
        <input placeholder="Playername" type="text" v-model="playername"
          class="placeholder:text-success text-success bg-transparent border-2 border-success px-4 py-3 w-full rounded-lg focus:outline-none">
        <br>
        <br>
        <input placeholder="Email" type="email" v-model="email"
          class="placeholder:text-success text-success bg-transparent border-2 border-success px-4 py-3 w-full rounded-lg focus:outline-none">
        <br>
        <br>
        <input placeholder="Password" type="password" v-model="password"
          class="placeholder:text-success text-success bg-transparent px-4 py-3 w-full border-2 border-success rounded-lg focus:outline-none">
        <br>
        <br>
        <button type="submit" class="btn btn-success mb-4 text-white w-full">Sign Up</button>
        <router-link to="/auth/Login" class="text-success">Login</router-link>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import router from "../router";
import { db } from '../firebase';

const playername = ref([])
const email = ref([])
const password = ref([])

const signup = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value).then((data) => {
    // add user details in user_data collection
    setDoc(doc(db, "users_data", data.user.uid), {
      name: playername.value,
      email: data.user.email,
      role: 'user',
      status: 'enabled',
      datetime: Date.now()
    });
    // add cars details in cars collection
    setDoc(doc(db, 'cars', data.user.uid), {
      d: arrayUnion(),
      c: arrayUnion(),
      b: arrayUnion(),
      a: arrayUnion(),
      s: arrayUnion(),
    });
    // set token in staorage
    localStorage.setItem('access_token', data.user.uid)
    router.push('/')
  }).catch(error => console.log(error))
}
</script>
<style lang="scss" scoped>

</style>
