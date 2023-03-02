<template>
<div class="q-pa-md">
  <div class="territory-cards" v-if="main_territories">
    <div class="territory-card flex justify-center items-center border" v-for="(territory, index) in main_territory_arr" :key="index" @click="selected_territory(territory.id)">{{ territory.label }}</div>
  </div>
  <div class="races">
    <div class="race_main q-pa-md flex justify-center items-center border rounded-borders" v-for="(race, index) in main_races" :key="index" :class="{ active_main: activeRace === index }" @click="activeRace = index">{{ race }}</div>
  </div>
</div>
</template>

<script setup >
import { ref } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
// $q.loading.show()

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

const main_territories = ref(true)
const main_territory_arr = ref([])
// const territories_list = ref(['Gold Hills', 'Back Kitchen', 'The Valley', 'Sub Urbs', 'High Village'])

const selected_territory = ((territory_id) => {
  main_territories.value = false
  console.log(territory_id);
})

const activeRace = ref(-1);
const main_races = ref([1, 2, 3, 4])




</script>
<style lang="scss">
.races {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;

  .race_main {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    font-size: 40px;
    font-weight: bold;

    &:hover {
      background-color: green;
      transition: 300ms;
      cursor: pointer;
      color: white;
    }
  }
}

.territory-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;

  .territory-card {
    min-height: 200px;
    background-color: gray;
    border-radius: 25px;
    color: white;

    &:hover {
      transition: 300ms;
      cursor: pointer;
      background-color: green;
    }
  }
}

.active_main {
  background-color: green;
}
</style>
