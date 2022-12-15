<template>
  <div v-if="GlobalVariables.curr_user_role == 'admin'" class="q-pa-md q-mx-auto" style="max-width: 1000px">

    <q-tabs v-model="tab" class="bg-grey-1 q-px-md" align="justify">
      <q-tab class="text-cyan" name="Defence" label="Defence" />
      <q-tab class="text-red" name="Attack" label="Attack" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Defence">
        <q-form @submit="assign_race" class="q-gutter-md">
          <div class="main-selects">
            <div class="cols-2-grid">
              <q-select label="Player Name" class="text-capitalize" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="player_name" :options="player_name_arr" />
              <q-select label="Territory" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="main_territory" :options="main_territory_arr" />
            </div>

            <div class="cols-2-grid">
              <q-select label="Race No" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="race_no" :options="race_no_arr" />
              <q-select filled v-model="available_cars" multiple :options="available_cars_arr" transition-hide="jump-up" use-chips stack-label label="Available Cars" />
            </div>
          </div>

          <div>
            <div class="recommended_cars">
              <q-select filled class="mt-30px" :model-value="recommended_car" label="Recommended Car" use-input hide-selected fill-input input-debounce="0" :options="recommended_cars" @filter="filterFn" @input-value="setreccar">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">add cars to show</q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div class="reftime-main">
                <div><span class="text-blue-9">Reference time: </span> <small v-if="reftime.min">{{ reftime.min }} Minutes </small><small v-if="reftime.sec">{{ reftime.sec }} Seconds </small><small v-if="reftime.milisec">{{ reftime.milisec }} Miliseconds</small></div>
                <div class="reftime q-mt-sm" hint="yes">
                  <q-select transition-hide="jump-up" clearable filled v-model="reftime.min" :options="min" label="Minutes" />
                  <q-select transition-hide="jump-up" clearable filled v-model="reftime.sec" :options="sec" label="Seconds" />
                  <q-input filled type="number" clearable v-model="reftime.milisec" label="Miliseconds" />
                </div>
              </div>
            </div>
          </div>

          <q-btn color="primary" type="submit" v-if="player_name && race_no && main_territory && available_cars && recommended_car">Assign race no<span class="q-ml-xs"> {{ race_no }}</span><span class="q-ml-xs" v-if="player_name">to {{ player_name.label }}</span></q-btn>
        </q-form>

        <q-markup-table class="q-mt-xl" v-if="outdefencearr.length > 0">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Territory</th>
              <th class="text-center">Race No</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(race, index) in outdefencearr" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ race.territory }}</td>
              <td class="text-center">{{ race.race_no }}</td>
              <td class="text-center"><q-btn flat class="text-blue-9" icon="delete" @click="deleteDefenceRace(index)" /></td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-tab-panel>

      <!-- attack -->

      <q-tab-panel name="Attack">

        <q-form @submit="assign_attack" class="q-gutter-md">
          <div class="main-selects">
            <div class="cols-2-grid">
              <q-select label="Player Name" class="text-capitalize" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="player_name" :options="player_name_arr" />
              <q-select label="territory" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="main_territory" :options="main_territory_arr" />
            </div>

            <div class="cols-2-grid">
              <q-select label="Stret No" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="street_no" :options="street_no_arr" />
              <q-select label="Difficulty" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="difficulty" :options="difficulty_arr" />
            </div>
          </div>

          <q-btn color="primary" type="submit" v-if="player_name && main_territory && street_no">Assign Street no<span class="q-ml-xs"> {{ street_no }}</span><span class="q-ml-xs" v-if="player_name">to {{ player_name.label }}</span></q-btn>
        </q-form>

        <q-markup-table class="q-mt-xl" v-if="outattackarr.length > 0">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Territory</th>
              <th class="text-center">Street No</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attack, index) in outattackarr" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ attack.territory }}</td>
              <td class="text-center">{{ attack.street_no }}</td>
              <td class="text-center"><q-btn flat class="text-blue-9" icon="delete" @click="deleteAttackStreet(index)" /></td>
            </tr>
          </tbody>
        </q-markup-table>

      </q-tab-panel>

    </q-tab-panels>

  </div>
</template>
<script setup>
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { async } from "@firebase/util";

const $q = useQuasar()
$q.loading.show()

const tab = ref()

const router = useRouter()
const GlobalVariables = useGlobalVariables();


const interval = setInterval(() => {
  if (GlobalVariables.curr_user_role == 'admin') {
    clearInterval(interval)
    $q.loading.hide()
  }
  if (GlobalVariables.curr_user_role == 'user') {
    clearInterval(interval)
    router.push('/')
  }
}, 100);

// player_name
const player_name = ref(null)
const player_name_arr = ref()
// main_territory
const main_territory = ref(null)
const main_territory_arr = ['gold hills', 'back kitchen', 'Sub Urbs', 'high village', 'down village']
// race_no
const race_no = ref(null)
const race_no_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
// street_no
const street_no = ref(null)
const street_no_arr = ['1', '2', '3', '4']
// difficulty
const difficulty = ref(null)
const difficulty_arr = ['Easy', 'Medium', 'Hard']
// available_cars
const available_cars = ref(null)
const available_cars_arr = ['d', 'c', 'b', 'a', 's']
// recommended_car
const recommended_cars_arr = ['tvr', 'ssc', 'venom', 'jesko', 'imola']
const recommended_car = ref(null)
const recommended_cars = ref(recommended_cars_arr)
function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase()
    recommended_cars.value = recommended_cars_arr.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
  })
}
function setreccar(val) {
  recommended_car.value = val
}
// refrence_time
const reftime = ref({ min: '', sec: '', milisec: '' })
const min = ['1', '2']
const sec = ['1', '2', '3', '4', '5', '5', '7', '8', '9']

// database functions
const outdefencearr = ref([])
const outattackarr = ref([])

// variables
let user_id = localStorage.getItem('access_token')
let collection_name = 'user_races'
const opponent_club = ref()

watch(player_name, (modeldata) => {
  if (modeldata) {
    outdefencearr.value = []
    getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
      opponent_club.value = opponent_data.data().opponent_club.ClubWithRandomID
      onSnapshot(doc(db, collection_name, modeldata.uid), (data) => {
        let defencearr = [];
        let attackarr = [];
        let defence = data.data()[opponent_club.value].defence;
        let attack = data.data()[opponent_club.value].attack;
        defence.forEach(element => {
          defencearr.push(element)
        });
        attack.forEach(element => {
          attackarr.push(element)
        });
        outdefencearr.value = defencearr
        outattackarr.value = attackarr
      });

    })

  } else {
    outdefencearr.value = []
  }

})

//custom user data
getDocs(collection(db, 'users_data')).then(data => {
  let custom_user_data = []
  data.forEach((data) => {
    let uid = data.data().user_id
    let label = data.data().name
    custom_user_data.push({ uid, label })
  });
  player_name_arr.value = custom_user_data
  tab.value = GlobalVariables.current_clash
})

// assign race
const assign_race = () => {
  outdefencearr.value.push({
    territory: main_territory.value,
    race_no: race_no.value,
    available_cars: available_cars.value,
    recommended_car: recommended_car.value,
    reftime: reftime.value,
  })
  updateDoc(doc(db, collection_name, player_name.value.uid), {
    [opponent_club.value]: { defence: outdefencearr.value, attack: outattackarr.value }
  })
  // reset field values
  main_territory.value = ''
  race_no.value = ''
  available_cars.value = null
  recommended_car.value = ''
  reftime.value = { min: '', sec: '', milisec: '' }
}
// assign attack
const assign_attack = () => {
  outattackarr.value.push({
    territory: main_territory.value,
    street_no: street_no.value,
    difficulty: difficulty.value,
  })
  updateDoc(doc(db, collection_name, player_name.value.uid), {
    [opponent_club.value]: { defence: outdefencearr.value, attack: outattackarr.value }
  })
  // reset field values
  main_territory.value = ''
  race_no.value = ''
  street_no.value = ''
  difficulty.value = ''
  available_cars.value = null
  recommended_car.value = ''
  reftime.value = { min: '', sec: '', milisec: '' }
}


const deleteDefenceRace = ((index) => {
  $q.dialog({
    title: 'Confirm To Delete Race # ',
    // message: 'Would you like to turn on the wifi?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    outdefencearr.value.splice(index, 1);

    await updateDoc(doc(db, collection_name, player_name.value.uid), {
      [opponent_club.value]: { defence: outdefencearr.value, attack: outattackarr.value }
    }).then(() => {
      console.log('succesfully deleted');
    }).catch((error) => {
      console.log('error', error);
    })
  })
})
const deleteAttackStreet = (async (index) => {
  $q.dialog({
    title: 'Confirm To Delete Street # ',
    // message: 'Would you like to turn on the wifi?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    outattackarr.value.splice(index, 1);
    await updateDoc(doc(db, collection_name, player_name.value.uid), {
      [opponent_club.value]: { defence: outdefencearr.value, attack: outattackarr.value }
    }).then(() => {
      console.log('succesfully deleted');
    }).catch((error) => {
      console.log('error', error);
    })

  })








})

</script>
<style lang="scss" scoped>
.cols-2-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.main-selects {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.reftime-main {
  grid-column: 2/5;
}

.reftime {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.recommended_cars {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.mt-30px {
  margin-top: 30px;
}
</style>
