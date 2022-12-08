<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 1000px">
    <div v-if="(user_role === 'admin')">{{ user_data }}</div>

    <q-tabs v-model="tab" class="bg-grey-1 q-px-md" align="justify">
      <q-tab class="text-cyan" name="Defence" label="Defence" />
      <q-tab class="text-red" name="Attack" label="Attack" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Defence">
        <div class="border q-mb-sm" v-for="(race, index) in defence" :key="index">
          <q-expansion-item expand-icon-class="text-white q-pa-none" group="somegroup"
            header-class="bg-blue-8 text-white q-py-md justify-between">
            <template v-slot:header>
              <div class="c-h-main-h">Race # {{ (index + 1) }}</div>
              <span class="text-bold text-capitalize c-h-main-h q-pr-lg">{{
                  race.category
              }}</span>
            </template>
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-center" v-for="(column, index) in defence_columns" :key="index">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="text-center">{{ race.category }}</td>
                  <td class="text-center">{{ race.race_no }}</td>
                  <td class="text-center">{{ race.recommended_car }}</td>
                  <td class="text-center">{{ race.ref_time }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-expansion-item>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Attack">
        <q-markup-table class="q-mb-md">
          <thead>
            <tr>
              <th class="text-center" v-for="(column, index) in attack_columns" :key="index">{{ column }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center" v-for="(street, index) in attack" :key="index">
              <td class="text-center">{{ street.category }}</td>
              <td class="text-center">{{ street.street_no }}</td>
              <td class="text-center">{{ street.difficulty }}</td>
            </tr>
          </tbody>
        </q-markup-table>

        <div class="border q-mb-sm hidden" v-for="(race, index) in attack" :key="index">
          <q-expansion-item expand-icon-class="text-white q-pa-none" group="somegroup"
            header-class="bg-blue-8 text-white q-py-md justify-between">
            <template v-slot:header>
              <div class="c-h-main-h">Race # {{ (index + 1) }}</div>
              <span class="text-bold text-capitalize c-h-main-h q-pr-lg">{{
                  race.category
              }}</span>
            </template>
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-center" v-for="(column, index) in defence_columns" :key="index">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="text-center">{{ race.category }}</td>
                  <td class="text-center">{{ race.race_no }}</td>
                  <td class="text-center">{{ race.recommended_car }}</td>
                  <td class="text-center">{{ race.ref_time }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-expansion-item>
        </div>

      </q-tab-panel>

    </q-tab-panels>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { collection, onSnapshot, getDoc, addDoc, doc, deleteField, deleteDoc, serverTimestamp, setDoc, updateDoc, arrayUnion, FieldValue, arrayRemove, } from "firebase/firestore";
import { db, auth } from '../firebase';
import { date, useQuasar } from 'quasar'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

const $q = useQuasar()
const inputfield = ref([])
const defence = ref([])
const attack = ref([])
const defence_columns = ref(['Category', 'Race No', 'Recommended Car', 'Refrence Time'])
const attack_columns = ref(['Category', 'Street No', 'Difficulty'])
const tab = ref('Defence')
const user_role = ref()
const user_data = ref()
const allraces = ref()
const allarray = ref()



let uid = localStorage.getItem('access_token');
if (uid) {
  $q.loading.show()
}

onMounted(() => {


  // onSnapshot(doc(db, "user_races", "IVgzvOggrDNNahOdkpnjfFdWnsq1"), (data) => {
  //   console.log("Current data: ", data.data().defence);
  //   let olddataarr = [];
  //   let docdata = data.data().defence;
  //   docdata.forEach(element => {
  //     olddataarr.push(data.data().defence)
  //   });
  //   allarray.value = olddataarr[0]
  //   // console.log(allarray.value);
  // });

  // getDoc(doc(db, "user_races", 'IVgzvOggrDNNahOdkpnjfFdWnsq1')).then(data => {
  //   // console.log(data.data().defence);
  //   let olddataarr = []
  //   data.data().defence.forEach(element => {
  //     console.log(element);
  //     olddataarr.push(data.data().defence)
  //   });
  //   allarray.value = olddataarr[0]
  //   // console.log(data.data().defence[0]);
  // })





  if (uid) {
    getDoc(doc(db, "user_races", uid)).then(data => {
      // defence.value = data.data().races[0].defence;
      // attack.value = data.data().races[0].attack;
      allraces.value = data.data();
      // console.log(data.data().defence[0].races);
      $q.loading.hide()
    })
  }
  getDoc(doc(db, "users_data", '4HlBybDueJRoMQjvtfS40yqvMXD3')).then(data => {
    // console.log(data.data());
    user_role.value = data.data().role
    user_data.value = data.data()
  })

})

</script>
<style lang="scss" scoped>
.c-h-main-h {
  font-size: 20px;
}
</style>
