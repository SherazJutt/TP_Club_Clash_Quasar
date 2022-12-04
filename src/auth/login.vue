<template>
    <div class="h-[100vh] flex justify-center items-center bg-gray-800">
        <div>
            <h1 class="text-success text-4xl text-center mb-12">Login</h1>
            <form @submit.prevent="login" class="p-8 w-96 rounded-lg border-2 border-success">
                <input placeholder="Email" type="email" v-model="email"
                    class="placeholder:text-success text-success bg-transparent border-2 border-success px-4 py-3 w-full rounded-lg focus:outline-none">
                <br>
                <br>
                <input placeholder="Password" type="password" v-model="password"
                    class="placeholder:text-success text-success bg-transparent px-4 py-3 w-full border-2 border-success rounded-lg focus:outline-none">
                <br>
                <br>
                <button type="submit" class="btn btn-success mb-4 text-white w-full">Login</button>
                <router-link to="/auth/signup" class="text-success">Signup</router-link>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { auth } from '../firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import router from "../router";

const email = ref([])
const password = ref([])

const login = () => {
    signInWithEmailAndPassword(auth, email.value, password.value).then((data) => {
        localStorage.setItem('access_token', data.user.uid)
        router.push('/')
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
<style lang="scss" scoped>

</style>