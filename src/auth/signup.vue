<template>


  <q-page padding>

    <h1 class="">Sign Up</h1>

    <q-form @submit="signup" class="q-gutter-md">
      <q-input required type="text" v-model="playername" label="Name" />
      <q-input required type="email" v-model="email" label="Email" />
      <q-input required type="password" v-model="password" label="Password" />

      <div class="flex justify-between">
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn color="primary" label="Login here" to="/login" />
      </div>
    </q-form>

  </q-page>
</template>
<script setup>
import { ref } from "vue";
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';

const router = useRouter()

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
    // create a document in user races collection
    setDoc(doc(db, 'user_races', data.user.uid), {
      name: playername.value,
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
