<template>
  <q-layout class="bg-grey-1">
    <q-header reveal elevated class="text-white bg-blue-9" height-hint="61.59">
      <q-toolbar class="q-py-sm q-px-md">
        <q-avatar square size="42px">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-75 -40 120 80">
            <path fill="#fff" d="M-75-40H45v80H-75z" />
            <path fill="#01411C" d="M-45-40h90v80h-90z" />
            <circle r="24" fill="#fff" />
            <circle r="22" cx="-7" cy="-40" fill="#01411C" transform="rotate(-41.634 45 -40)" />
            <path fill="#fff" d="M8.751-17.959l10.11 11.373L3.997-9.844l13.94-6.1-7.692 13.129z" />
          </svg>
        </q-avatar>
        <div class="GL__toolbar-link q-ml-xs q-gutter-md text-body2 text-weight-medium row items-center no-wrap full-width justify-center">
          <router-link class="text-white" to="/">Home</router-link>
          <router-link class="text-white" to="/garage">Garage</router-link>
        </div>

        <q-space />

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn dense flat round size="sm" icon="notifications" />
          <q-btn dense flat>
            <div class="row items-center no-wrap">
              <q-icon name="add" size="20px" />
            </div>
            <q-menu auto-close max-width="false">
              <q-list dense style="min-width: 120px">
                <q-item clickable to="/assignraces" class="text-black items-center">Assign Races</q-item>
                <q-separator color="gray" />
                <q-item clickable>New Car</q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense flat>
            <q-avatar circle size="40px">
              <img :src="user_data.photoURL">
            </q-avatar>

            <q-menu auto-close color="red">
              <q-list dense>
                <q-item class="text-black text-center justify-center">
                  <div>Signed in as <br> <strong>{{ user_data.displayName }}</strong></div>
                </q-item>
                <q-separator color="gray" />
                <q-item to="/profile" class="text-black items-center">Profile</q-item>
                <q-separator color="gray" />
                <q-item @click="logout" clickable class="items-center">Sign out</q-item>
              </q-list>
            </q-menu>
          </q-btn>


        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const user_data = ref([])

function logout() {
  signOut(auth).then(() => {
    localStorage.removeItem('access_token')
    router.push("/auth")
  })
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    user_data.value = user
  } else {
    console.log('not signed in');
  }
})
</script>
<style lang="scss" scoped>

</style>
