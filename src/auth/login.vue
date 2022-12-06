<template>
  <q-page padding>

    <h1 class="">Login</h1>

    <q-form @submit="login" class="q-gutter-md">
      <q-input required="" type="email" v-model="email" label="Email" />
      <q-input required="" type="password" v-model="password" label="Password" />

      <div class="flex justify-between">
        <q-btn label="Login" type="submit" color="primary" />
        <q-btn color="primary" label="Signup here" to="/signup" />
      </div>
    </q-form>

  </q-page>
</template>
<script setup>
import { ref } from "vue";
import { auth } from '../firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'


const router = useRouter()
const email = ref([])
const password = ref([])

const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value).then((data) => {
    localStorage.setItem('access_token', data.user.uid)
    router.push("/")
  }).catch((error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        alert("User not found")
        break
      case 'auth/wrong-password':
        alert("Wrong password")
        break
      default:
        alert("Something went wrong")
    }
  })
}
</script>
