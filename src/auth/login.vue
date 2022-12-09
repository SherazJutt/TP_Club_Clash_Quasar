<template>
  <q-page class="bg-grey-10">
    <div class="main-page text-center">
      <!-- <h3 class="text-white q-ma-none q-mb-md">Continue With</h3> -->
      <q-btn text-color="white" class="border-white google-btn" @click="SignInWithGoogle">
        <q-avatar size="42px">
          <img src="src/assets/google_logo.svg">
        </q-avatar>
        <span class="siwg">Sign In With Google</span>
      </q-btn>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { auth } from '../firebase'
import { useRouter } from 'vue-router'
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";


const router = useRouter()
const email = ref([])
const password = ref([])

// const login = () => {
//   signInWithEmailAndPassword(auth, email.value, password.value).then((data) => {
//     localStorage.setItem('access_token', data.user.uid)
//     router.push("/")
//   }).catch((error) => {
//     switch (error.code) {
//       case 'auth/user-not-found':
//         alert("User not found")
//         break
//       case 'auth/wrong-password':
//         alert("Wrong password")
//         break
//       default:
//         alert("Something went wrong")
//     }
//   })
// }

const SignInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider).then((data) => {
    console.log(data);
    localStorage.setItem('access_token', data.user.uid)
    router.push("/")
  })
}

setInterval(function () {
  // console.log('logged');
  let token = localStorage.getItem('access_token')
  if (token) {
    router.push("/")
  }

}, 1000);


onMounted(() => {
  console.log('mounted');
  // router.push('/')
})



</script>

<style lang="scss" scoped>
.main-page {
  // background-color: red;
  max-width: 500px;
  max-height: 500px;
}

.q-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.google-btn {
  padding: 9px;
}

.siwg {
  letter-spacing: 1px;
  margin-left: 9px;
}
</style>
