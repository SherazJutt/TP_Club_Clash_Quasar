<template>
  <q-layout view="lHh Lpr lff" container style="height: 100vh">
    <q-header elevated class="">
      <q-toolbar class="justify-between">
        <q-btn class="toggle" flat @click="drawer = !drawer" round dense icon="menu" />
        <div class="flex mobile-links">
          <q-btn color="primary" to="/" label="TP Club Clash" />
          <!-- <q-btn color="primary" to="/garage" label="garage" /> -->
        </div>
        <q-btn round to="/profile">
          <q-avatar size="28px">
            <img :src="user_data.profileImg" />
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer elevated class="bg-primary" v-model="drawer" show-if-above :width="250" :breakpoint="1280">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list padding class="text-white">

          <q-item clickable to="/" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>home</q-item-section>
          </q-item>

          <q-item clickable to="/garage" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="garage" /></q-item-section>
            <q-item-section>Garage</q-item-section>
          </q-item>

          <q-item clickable to="/profile" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
            <q-item-section>profile</q-item-section>
          </q-item>

          <q-item clickable v-if="(role === 'admin')" to="/assignraces" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="assignment_add" /></q-item-section>
            <q-item-section>Assign races</q-item-section>
          </q-item>

          <q-item clickable v-if="(role === 'admin')" to="/users" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="group" /></q-item-section>
            <q-item-section>users</q-item-section>
          </q-item>
          <!-- manage maps -->
          <q-item clickable v-if="(role === 'admin')" to="/mapsmanagement" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="map" /></q-item-section>
            <q-item-section>Maps Management</q-item-section>
          </q-item>
          <!-- manage cars -->
          <q-item clickable v-if="(role === 'admin')" to="/managecars" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="directions_car" /></q-item-section>
            <q-item-section>Manage Cars</q-item-section>
          </q-item>
          <!-- manage manageterritories -->
          <q-item clickable v-if="(role === 'admin')" to="/manageterritories" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="dataset" /></q-item-section>
            <q-item-section>Manage Territories</q-item-section>
          </q-item>

          <q-item clickable v-if="(role === 'admin')" to="/clashmanagement" style="color: white;" v-ripple>
            <q-item-section avatar><q-icon name="settings" /></q-item-section>
            <q-item-section>clash management</q-item-section>
          </q-item>

        </q-list>

        <q-btn class="text-black logout" style="position: absolute; bottom: 10px; left: 10px; right: 10px;" icon="logout" label="logout" @click="logout" />

      </q-scroll-area>

      <q-img class="absolute-top" src="~assets/A9_Club.png" style="height: 150px;">
        <div class="absolute-bottom" style="height: 150px;">
          <q-avatar size="56px" class="q-mb-sm">
            <q-img v-if="user_data.profileImg" :src="user_data.profileImg" spinner-color="white" spinner-size="30px" />
            <q-img v-else src="~assets/account_cowboy_hat.svg" />
          </q-avatar>
          <div class="text-weight-bold">{{ user_data.name }}</div>
          <div>{{ user_data.email }}</div>
        </div>
      </q-img>
    </q-drawer>

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

const drawer = ref(false)

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
<style lang="scss">
.q-scrollarea__container {
  background: rgba(0, 0, 0, 0.4)
}

.logout {
  background-color: rgba(0, 0, 0, 0.4);
  color: white !important;
  border: 1px solid grey;
}

@media screen and (min-width:1281px) {
  .mobile-links {
    display: none;
  }
}
</style>







