<template>
  <q-page class="bg-grey-10">
    <div class="main-page text-center flex column">
      <!-- <h3 class="text-white q-ma-none q-mb-md">Continue With</h3> -->
      <q-btn text-color="white" class="border-white google-btn" @click="SignInWithGoogle">
        <q-icon size="40px">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48">
            <defs>
              <path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
            </defs>
            <clipPath id="b">
              <use xlink:href="#a" overflow="visible" />
            </clipPath>
            <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
            <path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
            <path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
            <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
          </svg>
        </q-icon>
        <span class="siwg">Sign In With Google</span>
      </q-btn>
      <!-- <q-btn v-if="next_button == true" class="q-mt-md q-pa-md" color="primary" label="go to home" /> -->
    </div>
  </q-page>
</template>
<script setup>
import { db, auth } from '../firebase'
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from 'vue-router'
import { ref } from "vue";


const router = useRouter()

// let login_btn = ref(true)
// let next_button = ref(false)

const SignInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then((data) => {
    const isNewUser = getAdditionalUserInfo(data).isNewUser
    if (isNewUser == true) {
      // add user details in user_data collection
      setDoc(doc(db, "users_data", data.user.uid), {
        user_id: data.user.uid,
        name: data.user.displayName,
        email: data.user.email,
        role: 'user',
        status: 'enabled',
        datetime: new Date(),
      });
      // set opponent club array
      console.log(data.user.uid);
      getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
        let opponent_club = opponent_data.data().opponent_club
        setDoc(doc(db, "user_races", data.user.uid), {
          [opponent_club]: { defence: [], attack: [] }
        });
      })
    }
    localStorage.setItem('access_token', data.user.uid)
    router.push("/")
  })
}
// setTimeout(function () {
//   next_button.value = true
// }, 3000);
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
