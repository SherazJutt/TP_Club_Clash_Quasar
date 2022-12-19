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
          <div v-if="(role === 'admin')">
            <q-btn dense flat>
              <div class="row items-center no-wrap">
                <q-icon name="add" size="20px" />
              </div>
              <q-menu auto-close max-width="false">
                <q-list dense style="min-width: 120px">
                  <q-item clickable to="/clashmanagement" class="text-black items-center">Clash Management</q-item>
                  <q-separator color="gray" />
                  <q-item clickable to="/Users" class="text-black items-center">Users</q-item>
                  <q-separator color="gray" />
                  <q-item clickable to="/assignraces" class="text-black items-center">Assign Races</q-item>
                  <q-separator color="gray" />
                  <q-item clickable>New Car</q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <q-btn dense flat>
            <q-avatar circle size="30px">
              <q-img v-if="user_data.profileImg" :src="user_data.profileImg" spinner-color="white" spinner-size="10px" />
              <q-img v-else src="~assets/account_cowboy_hat.svg" />
            </q-avatar>
            <q-menu auto-close color="red">
              <q-list dense>
                <q-item class="text-black text-center justify-center">
                  <div>Signed in as <br> <strong>{{ user_data.name }}</strong></div>
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
      <router-view :local_data="local_data" />
    </q-page-container>

  </q-layout>

</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { db, auth } from '../firebase'
import { useRouter } from 'vue-router'
import { signOut } from "firebase/auth";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { useQuasar } from 'quasar'

const $q = useQuasar()

const GlobalVariables = useGlobalVariables();

const router = useRouter()

// locally stored user data
let user_id = localStorage.getItem('access_token');
const local_data = ref({ user_id: user_id })

//custom user data
const user_data = ref([])
const role = ref()

onSnapshot(doc(db, 'users_data', user_id), (data) => {
  user_data.value = data.data()
  role.value = data.data().role
});

// logout
function logout() {
  signOut(auth).then(() => {
    localStorage.removeItem('access_token')
    router.push("/auth")
  })
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    signOut(auth).then(() => {
      localStorage.removeItem('access_token')
      $q.loading.hide()
      router.push("/auth")
    })
  }
})
onBeforeMount(() => {
  GlobalVariables.setDataVariables()
})

</script>
<style lang="scss" scoped>

</style>
