<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 1000px">
    <div>{{ clash_info.user_id }}</div>
    <div>{{ clash_info.opponent_club }}</div>
    <div>{{ clash_info.is_defence }}</div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div>{{ user_data }}</div>

    <q-form @submit="assign_race" class="q-gutter-md">

      <div class="main-selects">
        <div class="cols-2-grid">
          <q-select label="Player Name" class="text-capitalize" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="player_name" :options="player_name_arr" />
          <q-select label="Category" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="main_category" :options="main_category_arr" />
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

      <q-btn color="primary" type="submit" v-if="race_no">Assign race no<span class="q-ml-xs"> {{ race_no }}</span><span class="q-ml-xs" v-if="player_name">to {{ player_name.label }}</span></q-btn>
    </q-form>

    <ul class="q-mb-xl">
      <div class="q-mb-xl">{{ outdefencearr }}</div>
      <li class="q-mb-sm" v-for="(item, index) in outdefencearr" :key="index">
        <span>{{ item.category }}</span>
        <span>{{ item.race_no }}</span>
        <button class="q-ml-md" @click="deletePosition(index)">Delete</button>
      </li>
    </ul>


    <div class="q-mb-xl">{{ outattackarr }}</div>
    <ul class="q-mb-xl">
      <li v-for="(item, index) in outattackarr" :key="index">
        <span>category = {{ item.category }}</span> =>
        <span>street no = {{ item.street_no }}</span>=
        <span>difficulty = {{ item.difficulty }}</span>
        <button class="q-ml-md" @click="deletePosition1(index)">Delete</button>
      </li>
    </ul>



    <q-btn color="primary" label="Save changes" class="q-ml-xl" @click="savechanges" />
    <q-btn color="primary" label="Add" class="q-ml-xl" @click="add" />



  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { collection, onSnapshot, getDoc, addDoc, doc, deleteField, deleteDoc, serverTimestamp, setDoc, updateDoc, arrayUnion, FieldValue, arrayRemove, } from "firebase/firestore";
import { db, auth } from '../firebase';

defineProps(['user_data', 'clash_info'])
// player_name
const player_name = ref(null)
const player_name_arr = ref([{ label: 'sheraz', uid: 'glaisdosadmwalskknjd' }, { label: 'haider', uid: 'glaisdoalsdksadmwknjd', },])
// main_category
const main_category = ref(null)
const main_category_arr = ['gold hills', 'back kitchen', 'Sub Urbs', 'high village', 'down village']
// race_no
const race_no = ref(null)
const race_no_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
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
const outdefencearr = ref()
const outattackarr = ref()

// dynamic variables
let curruid = localStorage.getItem('access_token');
let collection_name = 'user_races'
const clubname = 'legion united'

onMounted(() => {
  onSnapshot(doc(db, collection_name, curruid), (data) => {
    let defencearr = [];
    let attackarr = [];
    let defence = data.data()[clubname].defence;
    let attack = data.data()[clubname].attack;
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

// form submit
const assign_race = () => {
  outdefencearr.value.push({
    category: main_category.value,
    race_no: race_no.value,
    available_cars: available_cars.value,
    recommended_car: recommended_car.value,
    reftime: reftime.value,
  })
  updateDoc(doc(db, collection_name, curruid), {
    [clubname]: { defence: outdefencearr.value, attack: outattackarr.value }
  })
  // reset field values
  main_category.value = ''
  race_no.value = ''
  available_cars.value = null
  recommended_car.value = ''
  reftime.value = { min: '', sec: '', milisec: '' }
}

const deletePosition = (index) => {
  outdefencearr.value.splice(index, 1);
}
const deletePosition1 = (index) => {
  outattackarr.value.splice(index, 1);
}
const savechanges = () => {
  updateDoc(doc(db, collection_name, curruid), {
    [clubname]: { defence: outdefencearr.value, attack: outattackarr.value }

  })
}

const add = () => {
  updateDoc(doc(db, collection_name, curruid), {
    [clubname]: {
      defence: [
        {
          "race_no": "9",
          "recommended_car": "BC", "refrence_time": "1:23:245", "category": "down hill"
        },
        {
          "race_no": "10",
          "recommended_car": "ssc", "refrence_time": "1:23:245", "category": "down village"
        },
        {
          "race_no": "12",
          "recommended_car": "f5", "refrence_time": "1:23:245", "category": "sub urbs"
        }
      ],
      attack: [
        {
          "category": "back kitchen",
          "street_no": "5",
          "difficulty": "easy",
        },
        {
          "category": "back kitchen",
          "street_no": "6",
          "difficulty": "easy",
        },
        {
          "category": "back kitchen",
          "street_no": "7",
          "difficulty": "easy",
        }
      ]
    }
  })
}

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
