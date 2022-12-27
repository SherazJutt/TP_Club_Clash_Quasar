<template>
  <div class="q-pa-md">
    <q-form @submit="AddCar" class="formgap flex q-mt-md">
      <q-select filled autocomplete="off" :model-value="carname" label="Car Name" use-input hide-selected fill-input input-debounce="0" :options="AllCars" @filter="filterFn" @input-value="setreccar">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">add cars to show</q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select filled v-model="carclass" label="Car Class" style="width: 140px;" :options="classoptions" clearable class="text-capitalize fullwidthform" behavior="menu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-btn v-if="carname && carclass" type="submit" color="primary" class="q-px-lg q-py-sm fullwidthform" unelevated>
        <div class="cursor-pointer">Add {{ carname }} to class {{ carclass }}</div>
      </q-btn>
    </q-form>

    <q-card unelevated class="q-mt-lg">

      <q-tabs v-model="cartab" inline-label outside-arrows mobile-arrows class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="classd" label="Class (D)" />
        <q-tab name="classc" label="Class (C)" />
        <q-tab name="classb" label="Class (B)" />
        <q-tab name="classa" label="Class (A)" />
        <q-tab name="classs" label="Class (S)" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="cartab" animated>
        <q-tab-panel name="classd">
          <q-chip v-if="tabscars_d.length > 0" clickable square removable @remove="RemoveCar(index, 'd', tabscars_d)" color="primary" v-for="(item, index) in tabscars_d" :key="index" :label="item" text-color="white" />
          <h3 v-else class="text-bold text-center">Add Cars To Show</h3>
        </q-tab-panel>
        <q-tab-panel name="classc">
          <q-chip v-if="tabscars_c.length > 0" clickable square removable @remove="RemoveCar(index, 'c', tabscars_c)" color="primary" v-for="(item, index) in tabscars_c" :key="index" :label="item" text-color="white" />
          <h3 v-else class="text-bold text-center">Add Cars To Show</h3>
        </q-tab-panel>
        <q-tab-panel name="classb">
          <q-chip v-if="tabscars_b.length > 0" clickable square removable @remove="RemoveCar(index, 'b', tabscars_b)" color="primary" v-for="(item, index) in tabscars_b" :key="index" :label="item" text-color="white" />
          <h3 v-else class="text-bold text-center">Add Cars To Show</h3>
        </q-tab-panel>
        <q-tab-panel name="classa">
          <q-chip v-if="tabscars_a.length > 0" clickable square removable @remove="RemoveCar(index, 'a', tabscars_a)" color="primary" v-for="(item, index) in tabscars_a" :key="index" :label="item" text-color="white" />
          <h3 v-else class="text-bold text-center">Add Cars To Show</h3>
        </q-tab-panel>
        <q-tab-panel name="classs">
          <q-chip v-if="tabscars_s.length > 0" clickable square removable @remove="RemoveCar(index, 's', tabscars_s)" color="primary" v-for="(item, index) in tabscars_s" :key="index" :label="item" text-color="white" />
          <h3 v-else class="text-bold text-center">Add Cars To Show</h3>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase';
import { onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useQuasar } from 'quasar'
import { useGlobalVariables } from 'src/stores/GlobalVariables';

const GlobalVariables = useGlobalVariables();

const $q = useQuasar()

const RemoveCar = (async (index, currclass, currcategory) => {
  let message = 'Are You sure to Remove ' + '( ' + currcategory[index] + ' )'
  $q.dialog({
    title: 'Confirm',
    message: message,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    GlobalVariables.Global_AllCarsArr = []
    currcategory.splice(index, 1)
    await updateDoc(doc(db, 'management_data', 'cars'), {
      [currclass]: currcategory
    }).then(() => {
      console.log('succesfully deleted');
    }).catch((error) => {
      console.log('error', error);
    })
  })
})
// add cars
let AllCarsArr = []
const carname = ref(null)
const AllCars = ref(AllCarsArr)
function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase()
    AllCars.value = AllCarsArr.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
  })
}
function setreccar(val) {
  carname.value = val
}

const classoptions = ref(['d', 'c', 'b', 'a', 's'])
const carclass = ref()
const cartab = ref('classd')

const AddCar = (() => {
  GlobalVariables.Global_AllCarsArr = []
  let lowcarname = carname.value.toLocaleLowerCase()
  updateDoc(doc(db, 'management_data', 'cars'), {
    [carclass.value]: arrayUnion(lowcarname)
  })
  carname.value = ''
  carclass.value = ''
})

// show cars in tabs
const tabscars_d = ref([])
const tabscars_c = ref([])
const tabscars_b = ref([])
const tabscars_a = ref([])
const tabscars_s = ref([])

onSnapshot(doc(db, 'management_data', 'cars'), (data) => {
  tabscars_d.value = data.data().d
  tabscars_c.value = data.data().c
  tabscars_b.value = data.data().b
  tabscars_a.value = data.data().a
  tabscars_s.value = data.data().s
  AllCarsArr = GlobalVariables.Global_AllCarsArr
})
// setInterval(() => {
//   // console.log(tabscars.value);
//   // console.log(GlobalVariables.Global_AllCarsArr);

// }, 1000);
</script>
<style lang="scss">
.formgap {
  gap: 20px;
}

@media screen and (max-width:425px) {
  .fullwidthform {
    width: 100% !important;
  }
}
</style>
