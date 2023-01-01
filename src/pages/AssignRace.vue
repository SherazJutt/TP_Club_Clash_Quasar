<template>
  <div v-if="GlobalVariables.curr_user_role == 'admin'" class="q-mx-auto q-pa-sm" style="max-width: 1000px">
    <q-tabs v-model="tab" class="bg-grey-1" align="justify">
      <q-tab class="text-cyan" name="Defence" label="Defence" />
      <q-tab class="text-red" name="Attack" label="Attack" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="q-mt-sm">
      <q-tab-panel name="Defence" class="q-pa-none">
        <q-form @submit="assign_race">
          <div class="main-selects row q-col-gutter-sm">

            <q-select label="Player Name" class="text-capitalize col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="player_name" :options="player_name_arr">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Add members to team1</q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select label="Territory" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="main_territory" :options="main_territory_arr" />

            <q-select label="Race No" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="race_no" :options="race_no_arr" />
            <q-select filled :model-value="recommended_car" class="col-xs-12 col-sm-6 col-md-4" clearable @clear="clear_recommended_car" label="Recommended Car" use-input hide-selected fill-input input-debounce="0" :options="recommended_cars" @filter="filterFn" @input-value="setreccar">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">add cars to show</q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-btn class="q-py-md w-100 text-grey-7 bg-grey-2" :disable="!recommended_car" unelevated label="Refrence" @click="addref = true" />
              <q-dialog persistent v-model="addref">
                <q-card>
                  <q-toolbar class="bg-primary text-white flex q-pa-none justify-between">
                    <span v-if="variant" class="q-ml-md">{{ variant.data_id }}</span>
                    <q-space />
                    <q-btn flat round icon="close" v-close-popup />
                  </q-toolbar>
                  <q-card-section class="q-pa-sm" id="ref-time">
                    <q-select transition-hide="jump-up" clearable filled v-model="reflocation" option-label="name" option-value="id" :options="Locations" label="Location" />
                    <q-select class="q-mt-sm" v-if="reflocation" transition-hide="jump-up" clearable filled v-model="variant" option-label="track" option-value="data_id" :options="variants" label="Variant" />
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
              <q-btn class="q-py-md w-100 h-100" style="font-size: 12px;" color="primary" type="submit" :disable="!player_name && !race_no && !main_territory && !recommended_car">Assign race no<span class="q-ml-xs"> {{ race_no }}</span><span class="q-ml-xs" v-if="player_name">to {{ player_name.label }}</span></q-btn>
            </div>
          </div>
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
        <div v-else="outdefencearr.length = 0">
          <h3 v-if="player_name">No Races assigned to {{ player_name.label }}</h3>
        </div>
      </q-tab-panel>
      <!-- attack -->
      <q-tab-panel name="Attack" class="q-pa-none">
        <q-form @submit="assign_attack" class="q-mb-sm">
          <div class="main-selects row q-col-gutter-sm">
            <q-select label="Player Name" class="text-capitalize col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="player_name" :options="player_name_arr" />
            <q-select label="territory" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="main_territory" :options="main_territory_arr" />

            <q-select label="Stret No" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="street_no" :options="street_no_arr" />
            <q-select label="Difficulty" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="difficulty" :options="difficulty_arr" />
            <div class="col-xs-12 col-sm-8">
              <q-btn class="q-py-md w-100 h-100" color="primary" type="submit" :disable="(street_no == null)">Assign Street no<span class="q-ml-xs"> {{ street_no }}</span><span class="q-ml-xs" v-if="player_name">to {{ player_name.label }}</span></q-btn>
            </div>
          </div>
        </q-form>

        <q-separator class="q-my-md" />

        <q-markup-table class="q-ma-xs" v-if="outattackarr.length > 0">
          <thead>
            <tr>
              <th class="text-center">Territory</th>
              <th class="text-center">Street No</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attack, index) in outattackarr" :key="index">
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
const main_territory_arr = ref([])
const intervalone = setInterval(() => {
  if (GlobalVariables.AllCategoriesNameWithId.length > 0) {
    clearInterval(intervalone)
    let Names = GlobalVariables.AllCategoriesNameWithId
    Names.forEach(element => {
      main_territory_arr.value.push(element.name)
    });
  }
}, 1000);

// race_no
const race_no = ref(null)
const race_no_arr = []
for (let i = 1; i <= 16; i++) {
  race_no_arr.push(i)
}
// street_no
const street_no = ref(null)
const street_no_arr = ['1', '2', '3', '4']
// difficulty
const difficulty = ref(null)
const difficulty_arr = ['Easy', 'Medium', 'Hard']
// recommended_car
let recommended_cars_arr = []
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

const interval2 = setInterval(() => {
  if (GlobalVariables.Global_AllCarsArr.length > 0) {
    let allcars = GlobalVariables.Global_AllCarsArr
    allcars.forEach(element => {
      recommended_cars_arr.push(element.Car)
    });
    clearInterval(interval2)
  }
}, 250);

const clear_recommended_car = (() => {
  recommended_car.value = null
})

// reference locations
const reflocation = ref()

const variant = ref()
const variants = ref([])

const addref = ref(false)


let Locations = ref([])
getDoc(doc(db, 'maps_data', 'locations')).then((data) => {
  Locations.value = data.data().locations
})

watch(reflocation, (location) => {
  if (location) {
    getDoc(doc(db, 'maps_data', 'variants')).then(res => {
      variants.value = []
      let data = res.data()[location.id]
      data.forEach(element => {
        variants.value.push(element)
      });
    })
  }
})

// getDoc(doc(db, 'management_data', 'maps_management')).then((data) => {
//   // console.log(data.data().Locations);
//   Locations.value = data.data().Locations
//   console.log(Locations.value);
// })

// console.log(Math.random().toString(36).slice(2));

// =================>
// refrence_time
// const reftime = ref({ min: '', sec: '', milisec: '' })
// const min = ['0', '1', '2', '3']
// const sec = ['00']
// for (let i = 1; i <= 59; i++) {
//   sec.push(i)
// }
// =================>

// database functions
const outdefencearr = ref([])
const outattackarr = ref([])

// variables
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

onSnapshot(collection(db, 'users_data'), (data) => {
  let custom_user_data = []
  data.forEach(data => {
    let uid = data.data().user_id
    let label = data.data().name
    if (data.data().member_of == 'team1') {
      custom_user_data.push({ uid, label })
    }
  });
  player_name_arr.value = custom_user_data
  tab.value = GlobalVariables.current_clash
});

// assign race
const assign_race = () => {
  outdefencearr.value.push({
    territory: main_territory.value,
    race_no: race_no.value,
    recommended_car: recommended_car.value,
    // reftime: reftime.value,
    completed: false,
  })
  updateDoc(doc(db, collection_name, player_name.value.uid), {
    [opponent_club.value]: { defence: outdefencearr.value, attack: outattackarr.value }
  })
  // reset field values
  main_territory.value = ''
  race_no.value = ''
  recommended_car.value = ''
  // reftime.value = { min: '', sec: '', milisec: '' }
  addref.value = false
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
  recommended_car.value = ''
  reftime.value = { min: '', sec: '', milisec: '' }
}

const deleteDefenceRace = ((index) => {
  let title = 'Confirm To Delete Race #'
  let indextitle = index + 1
  let CurrentRaceWithTitle = title + indextitle
  $q.dialog({
    title: CurrentRaceWithTitle,
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
  let title = 'Confirm To Delete Street #'
  let indextitle = index + 1
  let CurrentstreetWithTitle = title + indextitle
  $q.dialog({
    title: CurrentstreetWithTitle,
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
.main-selects {

  // >label,
  // button {
  //   margin-top: 10px;
  // }
}

#ref-time {
  width: 270px;
}

@media screen and (min-width:350px) {

  #ref-time {
    width: 300px;
  }
}
</style>
