<template>
  <div v-if="GlobalVariables.curr_user_role == 'admin'" class="q-pa-md q-mx-auto" style="max-width: 1200px">
    <q-btn color="primary" label="Add New Territory" @click="AddTerritoryDialog = true" />

    <q-dialog persistent v-model="AddTerritoryDialog">
      <q-card>
        <q-toolbar class="bg-primary text-white flex q-pa-none justify-between">
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-sm" style="width: 300px;">
          <q-form @submit="addterritory" class="">
            <q-input filled type="text" clearable v-model="NewTerritoryName" label="Territory name" />
            <q-btn color="primary" type="submit" class="q-py-sm q-mt-sm w-100" :disable="!NewTerritoryName" :loading="loading[1]">Add Territory</q-btn>
          </q-form>
          <!-- show all territories -->
          <q-list v-if="AllTerritoryNames" class="q-mt-sm" bordered separator>
            <q-item v-for="(item, index) in AllTerritoryNames" :key="index">
              <q-item-section>
                <q-item-label class="flex justify-between items-center">{{ item.name }} <q-btn style="width: 30px;" flat icon="close" @click="RemoveCategory(index)" /></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </q-card-section>
      </q-card>
    </q-dialog>
    <q-form @submit="addtoterritory" class="q-gutter-md q-mt-lg">
      <div class="main-selects">
        <div class="cols-2-grid">
          <q-select label="Territory" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="main_territory" :options="main_territory_arr" />
          <q-select label="Race No" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="race_no" :options="race_no_arr" />
        </div>
        <div class="cols-2-grid">
          <q-select label="Opponent Club" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="OpponentClubName" :options="opponent_clubs_arr" />
          <q-input filled type="text" clearable v-model="Track" label="Track" />
        </div>
        <div class="cols-2-grid">
          <q-input filled type="text" clearable v-model="OpponentName" label="Opponent Name" />

          <q-select filled :model-value="OpponentCar" label="Opponent Car" use-input hide-selected fill-input input-debounce="0" :options="AllCars" @filter="filterFn" @input-value="setreccar">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">add cars to show</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="cols-2-grid">
          <q-select filled v-model="CarClass" label="Car Class" style="width: 140px;" :options="classoptions" clearable class="text-capitalize fullwidthform" behavior="menu">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div>
        <div class="Opponenttime-main">
          <div><span class="text-blue-9">Opponent time: </span> <small v-if="Opponenttime.min">{{ Opponenttime.min }} Minutes </small><small v-if="Opponenttime.sec">{{ Opponenttime.sec }} Seconds </small><small v-if="Opponenttime.milisec">{{ Opponenttime.milisec }} Miliseconds</small></div>
          <div class="Opponenttime q-mt-sm" hint="yes">
            <q-select transition-hide="jump-up" clearable filled v-model="Opponenttime.min" :options="min" label="Minutes" />
            <q-select transition-hide="jump-up" clearable filled v-model="Opponenttime.sec" :options="sec" label="Seconds" />
            <q-input filled type="number" clearable v-model="Opponenttime.milisec" label="Miliseconds" />
          </div>
        </div>
      </div>
      <q-btn color="primary" type="submit" :loading="loading[0]" v-if="OpponentName && race_no && main_territory && OpponentCar">Add</q-btn>

    </q-form>

    <q-markup-table class="q-mt-lg" v-if="territory_data">
      <thead>
        <tr class="text-capitalize">
          <th class="text-center">Race No</th>
          <th class="text-center">Territory</th>
          <th class="text-center">Track</th>
          <th class="text-center">Opponent Club</th>
          <th class="text-center">Opponent time</th>
          <th class="text-center">Opponent Name</th>
          <th class="text-center">Opponent Car</th>
          <th class="text-center">Class</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-capitalize" v-for="(item, index) in territory_data" :key="index">
          <td class="text-center">{{ item.race_no }}</td>
          <td class="text-center">{{ item.territory }}</td>
          <td class="text-center">{{ item.Track }}</td>
          <td class="text-center">{{ item.OpponentClubName.label }}</td>
          <td class="text-center">{{ item.Opponenttime.min }} : {{ item.Opponenttime.sec }} : {{ item.Opponenttime.milisec }}</td>
          <td class="text-center">{{ item.OpponentName }}</td>
          <td class="text-center">{{ item.OpponentCar }}</td>
          <td class="text-center">{{ item.CarClass }}</td>
          <!-- <td class="text-center"><q-btn flat class="text-blue-9" icon="delete" @click="deleteDefenceRace(index)" /></td> -->
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script setup>
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.loading.show()

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

// Opponent Name
const OpponentName = ref(null)
// main_territory
const main_territory = ref(null)
const main_territory_arr = ['Gold Hills', 'Back Kitchen', 'Sub Urbs', 'High Village', 'Down Village', 'Up Town', 'River Park', 'Under Pass', 'Financial District', 'East Valley']
const Track = ref()
const OpponentClubName = ref()
const opponent_clubs_arr = ref()
const CarClass = ref()
const classoptions = ref(['d', 'c', 'b', 'a', 's'])

// race_no
const race_no = ref(null)
const race_no_arr = []
for (let i = 1; i <= 24; i++) {
  race_no_arr.push(i)
}
// Opponent car
let AllCarsArr = []
const OpponentCar = ref(null)
const AllCars = ref(AllCarsArr)
function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase()
    AllCars.value = AllCarsArr.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
  })
}
function setreccar(val) {
  OpponentCar.value = val
}
setInterval(() => {
  AllCarsArr = GlobalVariables.Global_AllCarsArr
}, 250);
// Opponenttime
const Opponenttime = ref({ min: '', sec: '', milisec: '' })
const min = ['0', '1', '2', '3']
const sec = ['00']
for (let i = 1; i <= 59; i++) {
  sec.push(i)
}

const loading = ref([false])
const addtoterritory = (() => {
  // set loading in button
  loading.value[0] = true

  console.log(main_territory.value.replace(/ /g, ""), race_no.value, OpponentName.value, OpponentCar.value, Opponenttime.value);
  let territory = main_territory.value.replace(/ /g, "")
  const territorydata = {
    territory: territory,
    race_no: race_no.value,
    Track: Track.value,
    OpponentName: OpponentName.value,
    OpponentClubName: OpponentClubName.value,
    OpponentCar: OpponentCar.value,
    CarClass: CarClass.value,
    Opponenttime: Opponenttime.value,
  }
  updateDoc(doc(db, 'territories', territory), {
    [race_no.value]: territorydata
  }).then((res) => {
    loading.value[0] = false
    // reset field values
    race_no.value = ''
    Track.value = ''
    OpponentName.value = ''
    OpponentClubName.value = ''
    CarClass.value = ''
    OpponentCar.value = ''
    Opponenttime.value = { min: '', sec: '', milisec: '' }
  })
})
onMounted(async () => {
  getDoc(doc(db, 'management_data', 'opponents')).then(opponent_data => {
    opponent_clubs_arr.value = opponent_data.data().opponent_clubs
  })
})

let territory_data = ref()

// show updated dropdown territory data
watch(main_territory, (modeldata) => {
  if (modeldata) {
    console.log(modeldata.replace(/ /g, ""));
    let curr_territory = modeldata.replace(/ /g, "")
    onSnapshot(doc(db, 'territories', curr_territory), (data) => {
      territory_data.value = data.data()
      console.log(territory_data.value);
    });
  } else {
    territory_data.value = null
  }
})

const AddTerritoryDialog = ref(false)
const NewTerritoryName = ref()

const addterritory = (() => {
  loading.value[1] = true
  let territoryid = NewTerritoryName.value.replace(/ /g, "-") + '-' + self.crypto.randomUUID();
  let NewTerData = {
    name: NewTerritoryName.value,
    id: territoryid
  }
  updateDoc(doc(db, 'management_data', 'TerritoryManagement'),
    {
      TerritoryNames: arrayUnion(NewTerData)
    }).then(res => {
      NewTerritoryName.value = '', console.log('added');
      loading.value[1] = false
    })
})

// all territories
const AllTerritoryNames = ref()
onSnapshot(doc(db, 'management_data', 'TerritoryManagement'), (data) => {
  let TerName = data.data().TerritoryNames
  let TerNameArr = []
  TerName.forEach(element => {
    TerNameArr.push(element)
  });
  AllTerritoryNames.value = TerNameArr
});

const RemoveCategory = ((index) => {
  AllTerritoryNames.value.splice(index, 1)
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

.Opponenttime-main {
  grid-column: 2/5;
}

.Opponenttime {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.OpponentCar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.mt-30px {
  margin-top: 30px;
}
</style>
