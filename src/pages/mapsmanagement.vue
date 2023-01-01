<template>
  <div v-if="GlobalVariables.curr_user_role == 'admin'" class="q-mx-auto" style="max-width: 1200px">

    <div class="row q-mt-xs q-pa-xs gap-btns q-col-gutter-xs">
      <div class="col-xs-6 col-sm-4">
        <q-btn class="q-py-md q-px-lg w-100" color="primary" label="Location" @click="LocationToggle = !LocationToggle, VariantToggle = true, VariantDataToggle = true" />
      </div>
      <div class="col-xs-6 col-sm-4">
        <q-btn class="q-py-md q-px-lg w-100" color="primary" label="Variant" @click="VariantToggle = !VariantToggle, LocationToggle = true, VariantDataToggle = true" />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-btn class="q-py-md q-px-lg w-100" color="primary" label="Variant Data" @click="VariantDataToggle = !VariantDataToggle, LocationToggle = true, VariantToggle = true" />
      </div>
    </div>

    <!-- location -->
    <div v-if="!LocationToggle">
      <h5 class="q-ma-none q-mt-md text-center text-bold">Add Location</h5>
      <q-form class="q-mt-md q-pa-xs q-mb-md" @submit="AddLocationSubmit">
        <div class="row">
          <q-input class="col-xs-12 col-sm-10 col-md-8 q-mx-auto q-py-xs q-mb-xs" filled clearable v-model="AddLocation" type="text" label="Location Name" />
        </div>
        <div class="row">
          <q-btn type="submit" color="primary" :disable="!AddLocation" class="q-py-md col-xs-12 col-sm-5 col-md-3 q-mx-auto">
            <div>add {{ AddLocation }}</div>
          </q-btn>
        </div>
      </q-form>
      <div class="text-center ">
        <span v-if="itemrem" class="text-capitalize q-ml-xs text-red">dont delete unless required ( deleting location will delete all its variants and their data )</span>
      </div>
      <div class="q-mt-sm" v-if="locationsdata">
        <q-chip v-model:selected="itemrem" color="red" text-color="white" icon="edit">edit</q-chip>
        <q-chip square="" v-for="(item, index) in locationsdata" :key="index" clickable :removable="itemrem" @remove="delloc(item.name, item.id)" color="primary" text-color="white" :label="item.name" />
      </div>
    </div>
    <!-- variant -->
    <div>
    </div>
    <div v-if="!VariantToggle">
      <h5 class="q-ma-none q-mt-md text-center text-bold">Add Variant</h5>
      <q-form class="row q-mt-xs q-px-xs q-col-gutter-sm" @submit="AddVariantSubmit">
        <q-select class="col-xs-12 col-sm-4" transition-hide="jump-up" clearable @clear="varsdata = []" filled v-model="reflocation" option-label="name" option-value="id" :options="Locations" label="Location" />
        <q-input class="col-xs-12 col-sm-4" :disable="!reflocation" transition-hide="jump-up" clearable filled v-model="variantname" type="text" label="Variant Name" />
        <q-select class="col-xs-12 col-sm-4" transition-hide="jump-up" :disable="!variantname" clearable filled v-model="time" :options="times" label="Time" />
        <div class="col-xs-12 col-sm-8 col-md-6 col-lg-4 q-mx-auto" v-if="time">
          <q-btn type="submit" color="primary" class="q-py-md w-100" :label="'Add ' + variantname + ' in ' + reflocation.name" />
        </div>
      </q-form>
      <div class="q-my-md text-center">Total <span class="text-blue-9">{{ varsdata.length }}</span> Variants in <span class="text-blue-9">{{ reflocation.name }}</span></div>
      <q-markup-table class="q-ma-xs" v-if="varsdata.length > 0">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">variant</th>
            <th class="text-center">time</th>
            <th class="text-center">action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in varsdata" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ item.track }}</td>
            <td class="text-center">{{ item.time }}</td>
            <td class="text-center"><q-btn flat class="text-blue-9" icon="delete" @click="removevar(item)" /></td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <!-- variant data -->
    <div v-if="!VariantDataToggle">
      <h5 class="q-ma-none q-mt-md text-center text-bold">Add Variant Data</h5>
      <q-form class="row q-mt-md q-pa-xs" @submit="">
        <q-input class="col-xs-12 q-py-xs q-mb-xs" filled clearable v-model="AddVariantData" type="text" label="Variant Data  " />
        <q-btn type="submit" color="primary" :disable="!AddVariantData" class="q-py-md w-100">
          <div>add {{ AddVariantData }}</div>
        </q-btn>
      </q-form>
    </div>
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
// $q.loading.show()

const router = useRouter()
const GlobalVariables = useGlobalVariables();

const itemrem = ref(false)

const time = ref()
const times = ref(['30', '60', '90', '120'])

// location
const LocationToggle = ref(true)
const AddLocation = ref()
// variant
const VariantToggle = ref(true)
const AddVariant = ref()
// variant data
const VariantDataToggle = ref(true)
const AddVariantData = ref()

const AddLocationSubmit = (() => {
  console.log(AddLocation);
  updateDoc(doc(db, 'maps_data', 'locations'), {
    locations: arrayUnion({
      name: AddLocation.value,
      id: AddLocation.value.replace(/ /g, "_").toLocaleLowerCase() + '_' + Math.random().toString(36).slice(2)
    })
  }).then((data) => {
    AddLocation.value = ''
    console.log('added');
  })
})

const locationsdata = ref([])

onSnapshot(doc(db, 'maps_data', 'locations'), (data) => {
  let locationsarr = []
  let locations = data.data().locations
  locations.forEach(element => {
    locationsarr.push(element)
  });
  locationsdata.value = locationsarr
});

function delloc(name, id) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete ' + '(' + name + ')' + ' Location',
    cancel: true,
    persistent: true
  }).onOk(() => {
    updateDoc(doc(db, 'maps_data', 'locations'), {
      locations: arrayRemove({ name: name, id: id })
    }).then((data) => {
      console.log('removed');
      itemrem.value = false
    })
  })
}

// reference locations
const reflocation = ref()
let Locations = ref([])
getDoc(doc(db, 'maps_data', 'locations')).then((data) => {
  Locations.value = data.data().locations
})

const variantname = ref()
const AddVariantSubmit = (() => {
  console.log(reflocation.value, variantname.value, time.value);
  updateDoc(doc(db, 'maps_data', 'variants'), {
    [reflocation.value.id]: arrayUnion({
      location: reflocation.value.name,
      location_id: reflocation.value.id,
      location_id: reflocation.value.id,
      track: variantname.value,
      data_id: variantname.value.replace(/ /g, "_").toLocaleLowerCase() + '_' + Math.random().toString(36).slice(2),
      time: time.value
    })
  }).then(() => {
    console.log('added');
  })
})
const varsdata = ref([])

watch(reflocation, (modeldata) => {
  if (modeldata) {
    onSnapshot(doc(db, 'maps_data', 'variants'), (data) => {
      let varsdataarr = []
      let vars = data.data()[reflocation.value.id]
      console.log(vars);
      vars.forEach(element => {
        varsdataarr.push(element)
      });
      varsdata.value = varsdataarr
    });
  }
})
function removevar(item) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete ' + '(' + item.track + ')' + ' Variant',
    cancel: true,
    persistent: true
  }).onOk(() => {
    updateDoc(doc(db, 'maps_data', 'variants'), {
      [reflocation.value.id]: arrayRemove(item)
    }).then(() => {
      console.log('deleted');
    })
  })
}

</script>
<style lang="scss" scoped>
.gap-btns {
  // gap: 4px;
}
</style>
