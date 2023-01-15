<template>
  <div class="q-pa-xs q-mt-sm">
    <q-stepper v-model="step" vertical color="primary" class="" animated>
      <q-step v-for="(item, index) in 5" :key="index" :name="item" title="Create an ad group" caption="Optional" icon="check">
        An ad group contains one or more ads which target a shared set of keywords.
        <q-stepper-navigation>
          <q-btn :label="item == 5 ? 'Complete' : 'Continue'" @click="item == 5 ? markcompleted() : step = item + 1" color="primary" />
          <q-btn v-if="index > 0" flat @click="step = item - 1" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';

const GlobalVariables = useGlobalVariables();

// variables
const opponent_club = ref()

getDoc(doc(db, 'management_data', 'clash_information')).then(opponent_data => {
  opponent_club.value = opponent_data.data().opponent_club.ClubWithRandomID
})





const AssignStreets = ref(false)
const AddGuide = ref(false)


const step = ref(1)
const markcompleted = (() => {
  console.log('completed');
})


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
});

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



const assignattack = (() => {
  let AttackDataArr = {
    player_name: player_name.value.label,
    main_territory: main_territory.value,
    // Description: Description.value.replace(/\s+/g, ' ').trim(),
    Street: Street.value,
    // recommended_car: recommended_car.value
  }
  // console.log(AttackDataArr);
  updateDoc(doc(db, 'user_races', player_name.value.uid), {
    [opponent_club.value]: {

      AttackStreets: arrayUnion({
        player_name: player_name.value.label,
        player_id: player_name.value.uid,
        main_territory_name: main_territory.value.label,
        main_territory_id: main_territory.value.id,
        Street: Street.value,
      })

    }

  }).then((res) => {
    console.log('completed');
  })

})

const player_territory = ref()
const player_territory_arr = ref([])
// watch(player_name, (playerdata) => {
//   if (playerdata) {
//     console.log(playerdata.uid);
//     onSnapshot(doc(db, 'user_races', playerdata.uid), (data) => {
//       // console.log(data.data());
//       let territory = data.data().AttackStreets;
//       // console.log(territory);
//       territory.forEach(element => {
//         // territory.push(element)
//         console.log(element.main_territory_name);
//       });
//       // player_territory_arr.value = territory
//     })
//     // console.log(player_territory_arr.value);
//   }

// })




const AddGuideForm = (() => {


})






</script>
<style lang="scss">
.textarea {
  >.q-field__inner {
    >.q-field__control {
      min-height: 200px;
    }
  }
}
</style>
