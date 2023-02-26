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

          <q-select label="Territory" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled :disable="!player_name" v-model="main_territory" :options="main_territory_arr" />

          <q-select label="Race No" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled :disable="!main_territory" v-model="race_no" :options="race_no_arr" />

          <q-select filled :model-value="recommended_car" class="col-xs-12 col-sm-6 col-md-4" clearable @clear="clear_recommended_car" :disable="!race_no" label="Recommended Car" use-input hide-selected fill-input input-debounce="0" :options="recommended_cars" @filter="filterFn" @input-value="setreccar">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">add cars to show</q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="col-xs-12 col-sm-6 col-md-4">

            <q-btn class="q-py-md w-100 text-grey-7 bg-grey-2" unelevated :disable="!recommended_car" :label="variant_data ? variant_data.OpponentCar + ' ' + variant_data.OpponentTime : 'Refrence'" @click="addref = true" />

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
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label class="text-primary">{{ scope.opt.name }}</q-item-label>
                          <q-item-label caption :class="scope.opt.total_variants == 0 ? 'text-red' : 'text-primary'">{{ scope.opt.total_variants }} variants found</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select class="q-mt-xs" v-if="reflocation" transition-hide="jump-up" clearable filled v-model="variant" option-label="track" option-value="data_id" :options="variants" label="Variant">
                    <div v-if="variant">{{ variant.time }}</div>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label class="text-primary">{{ scope.opt.track }}</q-item-label>
                          <q-item-label caption :class="scope.opt.total_refs == 0 ? 'text-red' : 'text-primary'">{{ scope.opt.total_refs }} refs found</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select filled v-if="variant" v-model="variant_data" :options="variant_data_options" option-label="OpponentName" label="Reference" clearable options-selected-class="text-deep-orange">
                    <div v-if="variant_data">{{ variant_data.OpponentTime }}</div>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label class="flex justify-between"><span>{{ scope.opt.OpponentName }}</span> <span style="padding-top: 2.45px;" class="q-px-xs rounded-borders bg-red text-white">{{ scope.opt.OpponentClub }}</span></q-item-label>
                          <q-item-label caption>{{ scope.opt.OpponentCar }}</q-item-label>
                          <q-item-label caption class="text-primary">{{ scope.opt.OpponentTime }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-btn class="q-py-md w-100 text-white bg-primary q-mt-xs" unelevated v-if="variant_data" :label="variant_data.OpponentCar + ' ' + variant_data.OpponentTime" @click="addref = false" />

                </q-card-section>

              </q-card>
            </q-dialog>

          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-btn class="q-py-md w-100 h-100" style="font-size: 12px;" color="primary" type="submit" :disable="!variant_data">Assign race no<span class="q-ml-xs"> {{ race_no }}</span><span class="q-ml-xs" v-if="player_name">to {{ player_name.label }}</span></q-btn>
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

      <div class="row q-col-gutter-xs">
        <div class="col-6">
          <q-btn class="q-py-md w-100" :color="AssignStreets ? 'blue' : 'primary'" label="Assign Street" @click="AssignStreets = !AssignStreets, Streetstable = !Streetstable, AddGuide = false, Guidestable = false" />
        </div>
        <div class="col-6">
          <q-btn class="q-py-md w-100" :color="AddGuide ? 'blue' : 'primary'" label="Add Street Races Guide" @click="AddGuide = !AddGuide, Guidestable = !Guidestable, AssignStreets = false, Streetstable = false" />
        </div>
      </div>

      <q-form @submit="AssignStreet" class="row q-col-gutter-xs q-mx-auto q-pr-xs q-pt-md" style="max-width: 1000px;" v-if="AssignStreets">
        <q-select label="Player Name" class="text-capitalize col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="player_name" :options="player_name_arr">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Add members to team1</q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select label="Territory" class="col-xs-12 col-sm-6 col-md-4" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="main_territory" :options="main_territory_arr" />
        <q-select v-model="Street" :options="StreetNO" label="Street No" clearable="" filled class="col-xs-12 col-sm-6 col-md-4" />
        <div class="col-xs-12 col-sm-6 q-mx-auto q-mt-sm">
          <q-btn class="q-pa-none q-py-md w-100" color="primary" type="submit" :disable="!player_name || !main_territory || !Street">
            <div>Assign <span class="text-blue-9" v-if="main_territory">{{ main_territory.label }}</span> street no <span class="text-blue-9" v-if="Street">{{ Street }}</span> To <span class="text-blue-9" v-if="player_name">{{ player_name.label }}</span></div>
          </q-btn>
        </div>
      </q-form>

      <q-markup-table class="q-mt-xl" v-if="Streetstable">
        <thead>
          <tr>
            <th class="text-center">Territory</th>
            <th class="text-center">Territory ID</th>
            <th class="text-center">Street No</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in outAttackStreetsarr" :key="index">
            <td class="text-center">{{ item.main_territory_name }}</td>
            <td class="text-center">{{ item.main_territory_id }}</td>
            <td class="text-center">{{ item.Street_no }}</td>
            <td class="text-center"><q-btn flat class="text-blue-9" icon="delete" @click="RemoveStreet(index)" /></td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- Add Guide -->

      <q-form @submit="AddGuideForm" class="row q-col-gutter-xs q-mx-auto q-pr-xs q-pt-md" style="max-width: 1000px;" v-if="AddGuide">
        <q-select label="Player Name" class="text-capitalize col-xs-12 col-sm-6 col-md-3" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="player_name" :options="player_name_arr">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Add members to team1</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select label="Territory" class="col-xs-12 col-sm-6 col-md-3" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="assigned_main_territory" :options="assigned_main_territory_arr">
          <!-- <div>{{ assigned_main_territory_arr.label }}</div> -->
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" style="border-bottom: 1px solid gray;">
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption class="text-primary">Street No {{ scope.opt.Street_no }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select label="Race No" class="col-xs-12 col-sm-6 col-md-2" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="race_no" :options="race_no_arr" />
        <q-select filled :model-value="recommended_car" class="col-xs-12 col-sm-6 col-md-4" clearable @clear="clear_recommended_car" label="Recommended Car" use-input hide-selected fill-input input-debounce="0" :options="recommended_cars" @filter="filterFn" @input-value="setreccar">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">add cars to show</q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input v-model="Description" type="text" label="Description" autogrow filled class="textarea col-xs-12 col-md-12" />
        <div class="col-xs-12 col-sm-6 q-mx-auto q-mt-sm">
          <q-btn class="q-pa-none q-py-md w-100" color="primary" type="submit" :disable="!Description">
            <div>Assign <span class="text-blue-9" v-if="main_territory">{{ main_territory.label }}</span> street no <span class="text-blue-9" v-if="race_no">{{ race_no }}</span> To <span class="text-blue-9" v-if="player_name">{{ player_name.label }}</span></div>
          </q-btn>
        </div>
      </q-form>

      <q-markup-table class="q-mt-xl" v-if="Guidestable">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">Territory</th>
            <th class="text-center">Race No</th>
            <th class="text-center">Description</th>
            <th class="text-center">Car</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in out_attack_guide_arr" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ item.assigned_territory_name }}</td>
            <td class="text-center">{{ item.race }}</td>
            <td class="text-center" style="max-width: 200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ item.description }}</td>
            <td class="text-center">{{ item.recommended_car }}</td>
            <td class="text-center"><q-btn flat class="text-blue-9" icon="delete" @click="RemoveGuide(index)" /></td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-tab-panel>

  </q-tab-panels>

</div>
</template>
<script setup>
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.loading.show()

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

const intervalone = setInterval(() => {
  if (GlobalVariables.AllCategoriesNameWithId.length > 0) {
    clearInterval(intervalone)
    let Names = GlobalVariables.AllCategoriesNameWithId
    Names.forEach(element => {
      main_territory_arr.value.push({ label: element.name, id: element.id })
    });
  }
}, 1000);
// player_name
const player_name = ref(null)
const player_name_arr = ref()
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

// race_no
const race_no = ref(null)
const race_no_arr = []
for (let i = 1; i <= 16; i++) {
  race_no_arr.push(i)
}
// recommended cara
let recommended_cars_arr = []
const interval2 = setInterval(() => {
  if (GlobalVariables.Global_AllCarsArr.length > 0) {
    let allcars = GlobalVariables.Global_AllCarsArr
    allcars.forEach(element => {
      recommended_cars_arr.push(element.Car)
    });
    clearInterval(interval2)
  }
}, 250);

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
  let internal_locations_arr = data.data().locations
  internal_locations_arr.forEach(element => {
    getDoc(doc(db, 'maps_data', 'variants')).then(res => {
      Locations.value.push({ name: element.name, id: element.id, total_variants: res.data()[element.id].length })
    })
  });
});


watch(reflocation, (location) => {
  if (location) {
    getDoc(doc(db, 'maps_data', 'variants')).then(res => {
      variants.value = []
      let data = res.data()[location.id]
      data.forEach(element => {
        getDoc(doc(db, 'maps_data', 'variants_data')).then(res => {
          let variants_data_count_arr = []
          let data = res.data().data
          data.forEach(variant => {
            if (element.data_id == variant.data_of) {
              variants_data_count_arr.push(variant)
            }
          })
          variants.value.push({
            data_id: element.data_id,
            location: element.location,
            location_id: element.location_id,
            time: element.time,
            track: element.track,
            total_refs: variants_data_count_arr.length
          })
        })
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

// main_territory
const main_territory = ref(null)
const main_territory_arr = ref([])

// database functions
const outdefencearr = ref([])
const outattackarr = ref([])
const outAttackStreetsarr = ref([])

watch(player_name, (modeldata) => {
  if (modeldata) {
    outdefencearr.value = []
    getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
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
  variant_data.value = null
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
const Streetstable = ref(false)
const AddGuide = ref(true)
const Guidestable = ref(true)
const Description = ref()

// street
const Street = ref()
let StreetNO = ref([1, 2, 3, 4])

// race
let RaceNO = ref([])
for (let index = 1; index <= 16; index++) {
  RaceNO.value.push(index)
}

const AssignStreet = (() => {
  outAttackStreetsarr.value.push({
    main_territory_name: main_territory.value.label,
    main_territory_id: main_territory.value.id,
    Street_no: Street.value,
    data_id: main_territory.value.id + '_street_no_' + Street.value
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
      territory.forEach(element => {
        territorydata.push({ label: element.main_territory_name, id: element.main_territory_id, Street_no: element.Street_no })
      });
      assigned_main_territory_arr.value = territorydata
    })
  }

})

const AddGuideForm = (() => {
  outattackarr.value.push({
    player_name: player_name.value.label,
    player_id: player_name.value.uid,
    assigned_territory_name: assigned_main_territory.value.label,
    assigned_territory_id: assigned_main_territory.value.id,
    data_of: assigned_main_territory.value.id + '_street_no_' + assigned_main_territory.value.Street_no,
    race: race_no.value,
    recommended_car: recommended_car.value,
    description: Description.value
  })
  console.log(outattackarr.value);
  updateDoc(doc(db, collection_name, player_name.value.uid), {
    [opponent_club.value]: { AttackStreets: outAttackStreetsarr.value, defence: outdefencearr.value, attack: outattackarr.value }
  }).then((res) => {
    // assigned_main_territory.value = ''
    race_no.value = ''
    recommended_car.value = ''
    Description.value = ''
  })

})

const RemoveStreet = ((index) => {

  $q.dialog({
    title: 'Confirm To Delete This Street',
    cancel: true,
    persistent: true
  }).onOk(() => {
    outAttackStreetsarr.value.splice(index, 1)
    updateDoc(doc(db, collection_name, player_name.value.uid), {
      [opponent_club.value]: { AttackStreets: outAttackStreetsarr.value, defence: outdefencearr.value, attack: out_attack_guide_arr.value }
    }).then(() => {
      console.log('succesfully deleted');
    }).catch((error) => {
      console.log('error', error);
    })
  })
})
const RemoveGuide = ((index) => {

  $q.dialog({
    title: 'Confirm To Delete This Race',
    cancel: true,
    persistent: true
  }).onOk(() => {
    out_attack_guide_arr.value.splice(index, 1)
    updateDoc(doc(db, collection_name, player_name.value.uid), {
      [opponent_club.value]: { AttackStreets: outAttackStreetsarr.value, defence: outdefencearr.value, attack: out_attack_guide_arr.value }
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
