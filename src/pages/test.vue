<template>
  <div class="q-pa-xs q-mt-sm">
    <q-stepper v-model="step" vertical color="primary" class="" animated>
      <q-step v-for="(item, index) in 5" :key="index" :name="item" title="Create an ad group" caption="Optional" icon="check">
        An ad group contains one or more ads which target a shared set of keywords.
        <q-stepper-navigation>
          <q-btn :label="item == 5 ? 'Complete' : 'Continue'" @click="item == 5 ? markcompleted() : step = item + 1" color="primary" />
          <q-btn v-if="index > 0" flat @click="step = item - 1" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

    <br v-for="item in 5">
    <div>{{ opponent_club }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';

const GlobalVariables = useGlobalVariables();

let user_id = localStorage.getItem('access_token');

const step = ref(1)
const markcompleted = (() => {
  console.log('completed');
})

// variables
const opponent_club = ref()

getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
  opponent_club.value = opponent_data.data().opponent_club.ClubWithRandomID
  console.log(opponent_club.value);
})

getDoc(doc(db, 'user_races', user_id)).then(res => {
  let attacStreets = res.data()[opponent_club.value].AttackStreets
  console.log(attacStreets);
  attacStreets.forEach(element => {
    console.log(element);
  });



})

// getDoc(doc(db, 'user_races', user_id), (data) => {
  // let custom_user_data = []
  // console.log(data);
  // data.forEach(data => {
  //   let uid = data.data().user_id
  //   let label = data.data().name
  //   if (data.data().member_of == 'team1') {
  //     custom_user_data.push({ uid, label })
  //   }
  // });
  // player_name_arr.value = custom_user_data
  // console.log(player_name_arr.value);
// });

</script>
<style lang="scss">
.textarea {
  >.q-field__inner {
    >.q-field__control {
      min-height: 200px;
    }
  }
}
</style>
