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

        <h1>not started</h1>

      </q-tab-panel>

    </q-tab-panels>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from 'quasar'
import { onSnapshot, doc, } from "firebase/firestore";
import { db } from '../firebase';

// props
defineProps(['custom_user_data', 'clash_info', 'local_data'])

const $q = useQuasar()
const defence_columns = ref(['Category', 'Race No', 'Recommended Car', 'Available Cars', 'Reference Time'])
const attack = ref([])
const attack_columns = ref(['Category', 'Street No', 'Difficulty'])
const tab = ref('Defence')

// const user_data = ref()
const race_data_arr = ref()

let uid = localStorage.getItem('access_token');
let collection_name = 'user_races'
const clubname = 'legion united'

$q.loading.show()

let no_race = ref(false)
let all_races = ref(false)


onMounted(() => {
  onSnapshot(doc(db, collection_name, uid), (data) => {
    let defence_arr = [];
    let defence = data.data()[clubname].defence;
    console.log(defence.length);
    if (defence.length > 0) {
      all_races.value = true
      defence.forEach((data) => {
        defence_arr.push(data)
      });
      race_data_arr.value = defence_arr
    } else {
      no_race.value = true
    }
    $q.loading.hide()
  });
})

</script>
<style lang="scss" scoped>
.c-h-main-h {
  font-size: 20px;
}
</style>
