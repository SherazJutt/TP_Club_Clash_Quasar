<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 1000px">
    <q-tabs v-model="tab" class="bg-grey-1 q-px-md" align="justify">
      <q-tab class="text-cyan" name="Defence" label="Defence" />
      <q-tab class="text-red" name="Attack" label="Attack" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Defence">
        <div>
          <h3 class="text-capitalize text-center" v-if="no_race">NO races assigned</h3>
        </div>

        <div class="border q-mb-sm" v-if="all_races" v-for="(race, index) in race_data_arr" :key="index">
          <q-expansion-item expand-icon-class="text-white q-pa-none" group="somegroup" header-class="bg-blue-8 text-white q-py-md justify-between">
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
                  <td class="text-center"><span v-for="(item, index) in race.available_cars" :key="index" class="text-uppercase"><span class="border-primary" style="border-radius: 100px; padding: 3px 7px; margin-right: 4px;">{{ item }}</span></span></td>
                  <td class="text-center">{{ race.reftime.min }} : {{ race.reftime.sec }} : {{ race.reftime.milisec }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-expansion-item>
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
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ attack.category }}</td>
              <td class="text-center">{{ attack.street_no }}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <h3 class="text-center" v-else>not started</h3>

      </q-tab-panel>

    </q-tab-panels>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from 'quasar'
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useGlobalVariables } from 'src/stores/GlobalVariables';
const GlobalVariables = useGlobalVariables();

const $q = useQuasar()
const defence_columns = ref(['Category', 'Race No', 'Recommended Car', 'Available Cars', 'Reference Time'])
const attack = ref([])
const attack_columns = ref(['#', 'Category', 'Street No', 'Difficulty'])
const tab = ref()

// const user_data = ref()
const race_data_arr = ref()
const attack_data_arr = ref()

let user_id = localStorage.getItem('access_token');
let collection_name = 'user_races'

$q.loading.show()

let no_race = ref(false)
let all_races = ref(false)

onMounted(() => {
  getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
    let opponent_club = opponent_data.data().opponent_club.ClubWithRandomID

    onSnapshot(doc(db, collection_name, user_id), (data) => {
      let defence_arr = [];
      let attack_arr = [];
      if (data.data()[opponent_club].defence.length > 0) {
        let defence = data.data()[opponent_club].defence;
        let attack = data.data()[opponent_club].attack;
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

</script>
<style lang="scss" scoped>
.c-h-main-h {
  font-size: 20px;
}
</style>
