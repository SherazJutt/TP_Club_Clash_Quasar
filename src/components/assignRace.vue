<template>
  <div>

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
                <span class="q-ml-md">Reference</span>
                <q-space />
                <q-btn flat round icon="close" v-close-popup />
              </q-toolbar>
              <q-card-section class="q-pa-sm" id="ref-time">
                <q-select transition-hide="jump-up" clearable filled v-model="reflocation" option-label="name" option-value="id" :options="Locations" label="Locations">
                  <span class="w-100 text-right" v-if="!reflocation">Total {{ Locations.length }}</span>
                </q-select>

                <div class="text-center q-mt-xs" v-if="reflocation">
                  <small class="text-capitalize"><span class="text-blue-9">{{ variants.length }}</span> variants found in <span class="text-blue-9">{{ reflocation.name }}</span></small>
                </div>

                <q-select class="q-mt-xs" v-if="reflocation" transition-hide="jump-up" clearable filled v-model="variant" option-label="track" option-value="data_id" :options="variants" label="Variant">
                  <div v-if="variant">{{ variant.time }}</div>
                </q-select>

                <div class="text-center q-my-xs" v-if="variant">
                  <small class="text-capitalize"><span class="text-blue-9">{{ variant_data_options.length }}</span> references found in <span class="text-blue-9">{{ variant.track }}</span></small>
                </div>

                <q-select filled v-if="variant" v-model="variant_data" :options="variant_data_options" option-label="OpponentName" label="Reference" clearable options-selected-class="text-deep-orange">
                  <div v-if="variant_data">{{ variant_data.OpponentTime }}</div>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="flex justify-between"><span>{{ scope.opt.OpponentName }}</span> <span style="padding-top: 2.45px;" class="q-px-xs rounded-borders bg-red text-white">{{ scope.opt.OpponentClub }}</span></q-item-label>
                        <q-item-label caption>{{ scope.opt.track }} <span style="padding: 2px; border-radius: 10px;" class="border">{{ scope.opt.time }}</span></q-item-label>
                        <q-item-label caption class="text-primary">{{ scope.opt.OpponentTime }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

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
        <!-- <tr v-for="(race, index) in outdefencearr" :key="index">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-center">{{ race.territory }}</td>
          <td class="text-center">{{ race.race_no }}</td>
          <td class="text-center"><q-btn flat class="text-blue-9" icon="delete" @click="deleteDefenceRace(index)" /></td>
        </tr> -->
      </tbody>
    </q-markup-table>
    <div v-else="outdefencearr.length = 0">
      <h3 v-if="player_name">No Races assigned to {{ player_name.label }}</h3>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { collection, onSnapshot, getDoc, doc, updateDoc } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
// $q.loading.show()

const tab = ref()

const router = useRouter()
const GlobalVariables = useGlobalVariables();

// variables
let collection_name = 'user_races'
const opponent_club = ref()

const interval = setInterval(() => {
  if (GlobalVariables.curr_user_role == 'admin') {
    clearInterval(interval)
    opponent_club.value = GlobalVariables.current_clash_opponent
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
      main_territory_arr.value.push({ label: element.name, id: element.id })
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

const variant_data = ref()
const variant_data_options = ref([])

watch(variant, (variant) => {
  if (variant) {
    getDoc(doc(db, 'maps_data', 'variants_data')).then(res => {
      let variants_data_arr = []
      let data = res.data().data
      data.forEach(element => {
        if (variant.data_id == element.data_of) {
          variants_data_arr.push(element)
        }
      })
      variant_data_options.value = variants_data_arr
    })
  }
})
// database functions
const outdefencearr = ref([])
const outattackarr = ref([])
const outAttackStreetsarr = ref([])

watch(player_name, (modeldata) => {
  if (modeldata) {
    outdefencearr.value = []
    getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
      // opponent_club.value = opponent_data.data().opponent_club.ClubWithRandomID
      onSnapshot(doc(db, collection_name, modeldata.uid), (data) => {
        let defencearr = [];
        let attackarr = [];
        let AttackStreetsarr = [];
        let defence = data.data()[opponent_club.value].defence;
        let attack = data.data()[opponent_club.value].attack;
        let AttackStreets = data.data()[opponent_club.value].AttackStreets;
        defence.forEach(element => {
          defencearr.push(element)
        });
        attack.forEach(element => {
          attackarr.push(element)
        });
        AttackStreets.forEach(element => {
          AttackStreetsarr.push(element)
        });
        outdefencearr.value = defencearr
        outattackarr.value = attackarr
        outAttackStreetsarr.value = AttackStreetsarr
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
    territory: main_territory.value.label,
    race_no: race_no.value,
    recommended_car: recommended_car.value,
    reftime: variant_data.value,
    completed: false,
  })
  updateDoc(doc(db, collection_name, player_name.value.uid), {
    [opponent_club.value]: { defence: outdefencearr.value, attack: outattackarr.value, AttackStreets: outAttackStreetsarr.value, }
  })
  // reset field values
  main_territory.value = ''
  race_no.value = ''
  recommended_car.value = ''
  // reftime.value = { min: '', sec: '', milisec: '' }
  addref.value = false
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
      [opponent_club.value]: { defence: outdefencearr.value, attack: outattackarr.value, AttackStreets: outAttackStreetsarr.value, }
    }).then(() => {
      console.log('succesfully deleted');
    }).catch((error) => {
      console.log('error', error);
    })
  })
})

// <============================== ATTACK================================>

const AssignStreets = ref(false)
const AddGuide = ref(true)
const Guidestable = ref(true)


const step = ref(1)
const markcompleted = (() => {
  console.log('completed');
})

const Description = ref()

// street
const Street = ref()
let StreetNO = ref([1, 2, 3, 4])

// race
const Race = ref()
let RaceNO = ref([])
for (let index = 1; index <= 16; index++) {
  RaceNO.value.push(index)
}

const assignattack = (() => {

  outAttackStreetsarr.value.push({
    main_territory_name: main_territory.value.label,
    main_territory_id: main_territory.value.id,
    Street_no: Street.value
  })
  updateDoc(doc(db, collection_name, player_name.value.uid), {
    [opponent_club.value]: { AttackStreets: outAttackStreetsarr.value, defence: outdefencearr.value, attack: outattackarr.value }
  })

})

const assigned_main_territory = ref()
const assigned_main_territory_arr = ref([])
const out_attack_guide_arr = ref([])

watch(player_name, (playerdata) => {
  if (playerdata) {
    //  attack guide data
    onSnapshot(doc(db, 'user_races', playerdata.uid), (data) => {
      let attack_guide_internal_arr = []
      let atack_streets_refs = data.data()[opponent_club.value].attack
      atack_streets_refs.forEach(data => {
        attack_guide_internal_arr.push(data)
      });
      out_attack_guide_arr.value = attack_guide_internal_arr
    });

    getDoc(doc(db, 'user_races', playerdata.uid)).then((data) => {
      let territorydata = []
      let territory = data.data()[opponent_club.value].AttackStreets;
      console.log(opponent_club.value)
      territory.forEach(element => {
        territorydata.push({ label: element.main_territory_name, id: element.main_territory_id })
      });
      assigned_main_territory_arr.value = territorydata
    })
  }

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
