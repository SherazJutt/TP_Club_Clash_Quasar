<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="flex q-pa-md items-center">
      <h5 class="q-mr-md q-my-md">Change Clash Status:</h5>
      <q-radio v-model="current_clash_radio" size="lg" val="Defence" label="Defence" class="text-primary q-mr-lg" @click="ShowUpdateBtn" />
      <q-radio v-model="current_clash_radio" size="lg" val="Attack" label="Attack" color="red" class="text-red q-mr-lg" @click="ShowUpdateBtn" />
      <q-btn :loading="submit_loading" type="submit" style="max-height: 40px;" v-if="current_clash_update_btn == true" :class="(current_clash_radio == 'Defence') ? 'border-blue' : 'border-red'" unelevated>
        <div class="cursor-pointer">Change to <span :class="(current_clash_radio == 'Defence') ? 'text-blue-9' : 'text-red'">{{ current_clash_radio }}</span></div>
      </q-btn>
    </q-form>
    <q-separator color="primary" />
    <div class="q-pb-md">
      <h5 class="q-my-md">Change Clash Opponent:</h5>
      <q-select label="Select Clash Opponent" style="max-width: 50%;" class="" clearable transition-show="jump-up" transition-hide="jump-up" filled v-model="opponent_club" :options="opponent_clubs_arr" />
      <q-btn color="primary" class="q-mt-md" @click="UpdateOpponent" label="Update" />
    </div>
    <q-separator color="primary" />

    <div class="q-pa-md">
      <h5 class="q-my-lg">Add Opponent Club</h5>
      <q-form @submit="AddOpponent" class="" style="max-width: 50%;">
        <q-input required filled v-model="OpponentClubNameField" label="Opponent Club Name" />
        <q-input required filled v-model="OpponentClubIdField" class="q-mt-md" label="Opponent Club ID" />
        <q-btn :loading="AddOpponentLoading" type="submit" color="primary" label="Add Opponent Club" class="q-mt-md q-px-lg q-py-sm" unelevated />
      </q-form>
    </div>

    <q-separator color="primary" />

    <!-- add cars -->
    <div class="q-pa-md">
      <h5 class="q-my-lg">Add Car</h5>
      <q-form @submit="AddCar" class="addcarform" style="width: 50%;">
        <q-input required filled v-model="carname" label="Car Name" clearable />
        <q-select filled v-model="carclass" label="Car Class" :options="classoptions" clearable class="text-capitalize" behavior="menu">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn type="submit" color="primary" class="q-px-lg q-py-sm" style="max-width: 300px;" unelevated>
          <div class="cursor-pointer">Add {{ carname }} to class {{ carclass }}</div>
        </q-btn>
      </q-form>


      <q-card class="q-mt-lg">
        <q-tabs v-model="cartab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
          <q-tab name="classd" label="Class (D)" />
          <q-tab name="classc" label="Class (C)" />
          <q-tab name="classb" label="Class (B)" />
          <q-tab name="classa" label="Class (A)" />
          <q-tab name="classs" label="Class (S)" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="cartab" animated>
          <q-tab-panel name="classd">
            <div class="text-h6">Class D</div>
            <q-chip outline color="teal" v-for="(item, index) in tabscars.d" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classc">
            <div class="text-h6">Class C</div>
            <q-chip outline color="teal" v-for="(item, index) in tabscars.c" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classb">
            <div class="text-h6">Class B</div>
            <q-chip outline color="teal" v-for="(item, index) in tabscars.b" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classa">
            <div class="text-h6">Class A</div>
            <q-chip outline color="teal" v-for="(item, index) in tabscars.a" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classs">
            <div class="text-h6">Class S</div>
            <q-chip outline color="teal" v-for="(item, index) in tabscars.s" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

        </q-tab-panels>
      </q-card>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase';
import { onSnapshot, doc, getDoc, updateDoc, arrayUnion, getDocs, collection, arrayRemove } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.loading.show()

const opponent_club = ref(null)
const opponent_clubs_arr = ref()

const GlobalVariables = useGlobalVariables();

const current_clash_radio = ref()

const OpponentClubNameField = ref()
const OpponentClubIdField = ref()

const current_clash_update_btn = ref(false)

// add cars
const classoptions = ref(['d', 'c', 'b', 'a', 's'])
const carname = ref()
const carclass = ref()
const cartab = ref('classd')

const submit_loading = ref(false)
const AddOpponentLoading = ref(false)

const interval = setInterval(() => {
  if (GlobalVariables.current_clash !== null) {
    current_clash_radio.value = GlobalVariables.current_clash
    clearInterval(interval)
    $q.loading.hide()
  }
}, 100);

onMounted(async () => {
  getDoc(doc(db, 'management_data', 'opponents')).then(opponent_data => {
    opponent_clubs_arr.value = opponent_data.data().opponent_clubs
  })
})

const AddOpponent = (async () => {
  AddOpponentLoading.value = true
  const DocIDS = []
  let ClubTitle = OpponentClubNameField.value + '_' + OpponentClubIdField.value
  let ClubWithRandomID = ClubTitle.replace(/ /g, "_").toLocaleLowerCase() + '_' + Math.random().toString(36).slice(2)

  await updateDoc(doc(db, 'management_data', 'opponents'), {
    opponent_clubs: arrayUnion({
      datetime: new Date(),
      label: OpponentClubNameField.value,
      uid: OpponentClubIdField.value,
      ClubWithRandomID: ClubWithRandomID
    })
  }).then(async () => {
    const querySnapshot = await getDocs(collection(db, "user_races"));
    querySnapshot.forEach((doc) => {
      DocIDS.push(doc.id)
    });

    DocIDS.forEach(async (dt) => {
      await updateDoc(doc(db, 'user_races', dt), {
        [ClubWithRandomID]: { defence: [], attack: [] }
      })
    })

    OpponentClubNameField.value = ''
    OpponentClubIdField.value = ''
    AddOpponentLoading.value = false

  })

})
const UpdateOpponent = (async () => {
  console.log(opponent_club.value.ClubWithRandomID);
  await updateDoc(doc(db, 'management_data', 'clash_information'),
    {
      opponent_club: {
        club_name: opponent_club.value.datetime,
        club_name: opponent_club.value.label,
        club_id: opponent_club.value.uid,
        ClubWithRandomID: opponent_club.value.ClubWithRandomID
      }
    }).then(() => {
      opponent_club.value.label = ''
      opponent_club.value.uid = ''
      opponent_club.value.ClubWithRandomID = ''
      console.log('updated');
    })
})

const onSubmit = (async () => {
  submit_loading.value = true
  await updateDoc(doc(db, 'management_data', 'clash_information'), { current_clash: current_clash_radio.value })
    .then((response) => {
      current_clash_update_btn.value = false
      submit_loading.value = false
    })
})

const ShowUpdateBtn = (() => {
  current_clash_update_btn.value = true
})

// add cars
const AddCar = (() => {
  console.log('clicked');
  updateDoc(doc(db, 'management_data', 'cars'), {
    [carclass.value]: arrayUnion(carname.value)
  })
})

// show cars in tabs
const tabscars = ref([])
onSnapshot(doc(db, 'management_data', 'cars'), (data) => {
  // console.log(data.data());
  tabscars.value = data.data()
});

</script>
<style lang="scss">
.border-red {
  border: 1px solid red;
}

.border-blue {
  border: 1px solid blue;
}

.addcarform {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
</style>
