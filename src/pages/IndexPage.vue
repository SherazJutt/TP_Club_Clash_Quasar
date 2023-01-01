<template>
  <div class="q-mx-auto" style="max-width: 1000px">
    <q-tabs v-model="tab" class="q-pa-xs" align="justify">
      <q-tab class="text-cyan" name="Defence" label="Defence" />
      <q-tab class="text-red" name="Attack" label="Attack" />
    </q-tabs>
    <q-tab-panels v-model="tab" class="bg-transparen" animated>
      <q-tab-panel name="Defence" class="q-pa-xs">
        <div class="border q-mb-xs" v-if="all_races" v-for="(race, index) in race_data_arr" :key="index">
          <q-expansion-item expand-icon-class="text-white q-pa-none" group="somegroup" :header-class="(race.completed == true) ? 'bg-green text-white q-py-md justify-between' : 'bg-blue-8 bg-blue-8 text-white q-py-md justify-between'">
            <template v-slot:header>
              <div class="c-h-main-h">Race # {{ (index + 1) }}</div>
              <span class="text-bold text-capitalize c-h-main-h q-pr-lg">{{ race.territory }}</span>
            </template>
            <q-markup-table>
              <thead>
                <tr class="text-center">
                  <th v-for="(column, index) in defence_columns" :key="index">{{ column }}</th>
                  <th v-if="race.completed == true">Your Time</th>
                  <th style="width: 110px;" v-if="race.completed == false">Mark As Completed</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center text-capitalize">
                  <td>{{ race.territory }}</td>
                  <td>{{ race.race_no }}</td>
                  <td>{{ race.recommended_car }}</td>
                  <!-- <td>{{ race.reftime.min }} : {{ race.reftime.sec }} : {{ race.reftime.milisec }}</td> -->
                  <td><span v-if="race.completed == true">Completed</span><span v-else>Pending</span></td>
                  <td v-if="race.completed == true">{{ race.finaltime.min }} : {{ race.finaltime.sec }} : {{ race.finaltime.milisec }}</td>
                  <td v-if="race.completed == false"><q-btn flat round color="green" icon="check" @click="markcompleted(index)" /></td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-expansion-item>
        </div>
        <div v-else>
          <h3 class="text-capitalize text-center">NO races assigned</h3>
        </div>

      </q-tab-panel>

      <q-tab-panel name="Attack">

        <q-markup-table v-if="attack_data_arr">
          <thead>
            <tr>
              <th class="text-center" v-for="(column, index) in attack_columns" :key="index">{{ column }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center" v-for="(attack, index) in attack_data_arr" :key="index">
              <td class="text-center">{{ attack.street_no }}</td>
              <td class="text-center">{{ attack.territory }}</td>
              <td class="text-center">{{ attack.difficulty }}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <h3 class="text-center" v-else>not started</h3>
      </q-tab-panel>

    </q-tab-panels>

    <q-dialog persistent v-model="toolbar">
      <q-card>
        <q-toolbar class="bg-green text-white flex justify-between">
          <div>Your Final Lap time</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-sm" id="final-time">
          <div>
            <q-select class="q-mb-xs border" transition-hide="jump-up" clearable filled v-model="finaltime.min" :options="min" label="Minutes" />
            <q-select class="q-mb-xs border" transition-hide="jump-up" clearable filled v-model="finaltime.sec" :options="sec" label="Seconds" />
            <q-input filled class="border q-mb-sm" type="number" clearable v-model="finaltime.milisec" label="Miliseconds" />
            <q-btn color="green" class="w-100" label="Mark As Completed" v-if="finaltime.min && finaltime.sec && finaltime.milisec" @click="clicktwo" v-close-popup />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from 'quasar'
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useGlobalVariables } from 'src/stores/GlobalVariables';
const GlobalVariables = useGlobalVariables();

const $q = useQuasar()
const defence_columns = ref(['Territory', 'Race No', 'Recommended Car', 'Status'])
const attack_columns = ref(['Street No', 'Territory', 'Difficulty'])
const tab = ref()
const toolbar = ref(false)

const finaltime = ref({ min: '', sec: '', milisec: '' })
const min = ['0', '1', '2', '3']
const sec = ['00']
for (let i = 1; i <= 59; i++) {
  sec.push(i)
}

// const user_data = ref()
const race_data_arr = ref()
const attack_data_arr = ref()

let user_id = localStorage.getItem('access_token');
let collection_name = 'user_races'

$q.loading.show()

let no_race = ref(false)
let all_races = ref(false)

let opponent_club = ref()

onMounted(() => {
  getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
    // let opponent_club = opponent_data.data().opponent_club.ClubWithRandomID
    opponent_club.value = opponent_data.data().opponent_club.ClubWithRandomID

    onSnapshot(doc(db, collection_name, user_id), (data) => {
      let defence_arr = [];
      let attack_arr = [];
      if (data.data()[opponent_club.value].defence.length > 0) {
        let defence = data.data()[opponent_club.value].defence;
        let attack = data.data()[opponent_club.value].attack;
        all_races.value = true
        defence.forEach((data) => {
          defence_arr.push(data)
        });
        attack.forEach((data) => {
          attack_arr.push(data)
        });
        race_data_arr.value = defence_arr
        attack_data_arr.value = attack_arr
      } else {
        no_race.value = true
      }
      tab.value = GlobalVariables.current_clash
      $q.loading.hide()
    });
  })
})
const current_index = ref()

const markcompleted = (async (index) => {
  current_index.value = index
  toolbar.value = true
})
const clicktwo = (async (index) => {
  let newdata = {
    completed: true,
    finaltime: finaltime.value,
    race_no: race_data_arr.value[current_index.value].race_no,
    recommended_car: race_data_arr.value[current_index.value].recommended_car,
    // reftime: race_data_arr.value[current_index.value].reftime,
    territory: race_data_arr.value[current_index.value].territory
  }

  race_data_arr.value.splice(current_index.value, 1);

  race_data_arr.value.push(newdata)

  await updateDoc(doc(db, collection_name, user_id), {
    [opponent_club.value]: { defence: race_data_arr.value, attack: attack_data_arr.value }
  }).then(() => {
    // reset final time fields
    finaltime.value = { min: '', sec: '', milisec: '' }
  }).catch((error) => {
    console.log('error', error);
  })
})
</script>
<style lang="scss" scoped>
.c-h-main-h {
  font-size: 20px;
}

#final-time {
  width: 270px;
}

@media screen and (min-width:350px) {

  #final-time {
    width: 300px;
  }
}
</style>
