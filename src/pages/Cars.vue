<template>
  <div class="q-pa-md">
    <div>{{ tabclassd }}</div>
    <div>{{ tabclassc }}</div>
    <div class="q-pa-md">
      <h5 class="q-my-lg">Add Car</h5>
      <q-form @submit="AddCar" class="addcarform">
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
            <q-chip outline removable color="primary" v-for="(item, index) in tabclassd" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classc">
            <div class="text-h6">Class C</div>
            <q-chip outline removable color="primary" v-for="(item, index) in tabclassc" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classb">
            <div class="text-h6">Class B</div>
            <q-chip outline removable color="primary" v-for="(item, index) in tabclassb" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classa">
            <div class="text-h6">Class A</div>
            <q-chip outline removable color="primary" v-for="(item, index) in tabclassa" :key="index" :label="item" text-color="white" />
          </q-tab-panel>

          <q-tab-panel name="classs">
            <div class="text-h6">Class S</div>
            <q-chip outline removable color="primary" v-for="(item, index) in tabclasss" :key="index" :label="item" text-color="white" />
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

const GlobalVariables = useGlobalVariables();

// add cars
const classoptions = ref(['d', 'c', 'b', 'a', 's'])
const carname = ref()
const carclass = ref()
const cartab = ref('classd')

// add cars
const AddCar = (() => {
  console.log('clicked');
  updateDoc(doc(db, 'management_data', 'cars'), {
    [carclass.value]: arrayUnion(carname.value)
  })
})

// show cars in tabs
const tabclassd = ref([])
const tabclassc = ref([])
const tabclassb = ref([])
const tabclassa = ref([])
const tabclasss = ref([])
onSnapshot(doc(db, 'management_data', 'cars'), (data) => {
  // console.log(data.data());
  tabclassd.value = data.data().d
  tabclassc.value = data.data().c
  tabclassb.value = data.data().b
  tabclassa.value = data.data().a
  tabclasss.value = data.data().s
  $q.loading.hide()
});



const delcar = ((index) => {
  // tabscars.value.splice(index, 1);
  console.log('index');
})


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
