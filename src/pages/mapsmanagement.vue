<template>
  <div v-if="GlobalVariables.curr_user_role == 'admin'" class="q-mx-auto" style="max-width: 1200px">

    <div class="row q-mt-xs q-pa-xs gap-btns q-col-gutter-xs">
      <div class="col-xs-6 col-sm-4">
        <q-btn class="q-py-md q-px-lg w-100" color="primary" label="Location" @click="LocationToggle = !LocationToggle" />
      </div>
      <div class="col-xs-6 col-sm-4">
        <q-btn class="q-py-md q-px-lg w-100" color="primary" label="Variant" @click="VariantToggle = !VariantToggle" />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-btn class="q-py-md q-px-lg w-100" color="primary" label="Variant Data" @click="VariantDataToggle = !VariantDataToggle" />
      </div>
    </div>


    <div v-if="!LocationToggle">
      <h5 class="q-ma-none q-mt-md text-center text-bold">Location</h5>
      <q-form class="row q-mt-md q-pa-xs" @submit="AddLocationSubmit">
        <q-input class="col-xs-12 q-py-xs q-mb-xs" filled clearable v-model="AddLocation" type="text" label="Location Name" />
        <q-btn type="submit" color="primary" :disable="!AddLocation" class="q-py-md col-xs-12 col-sm-4 col-md-3 col-lg-2">
          <div>add {{ AddLocation }}</div>
        </q-btn>
      </q-form>
      <div class="q-mt-md" v-if="locationsdata">
        <!-- <q-chip class="text-white" icon="edit" label="Edit" clickable @click="itemrem = !itemrem" /> -->

        <q-chip v-model:selected="itemrem" color="red" text-color="white" icon="edit">edit</q-chip>


        <q-chip square="" v-for="(item, index) in locationsdata" :key="index" clickable :removable="itemrem" @remove="delloc(item.name, item.id)" color="primary" text-color="white" :label="item.name" />
      </div>
    </div>
    <div v-if="!VariantToggle">
      <h5 class="q-ma-none q-mt-md text-center text-bold">Variant</h5>
      <q-form class="row q-mt-md q-pa-xs" @submit="">
        <q-input class="col-xs-12 q-py-xs q-mb-xs" filled clearable v-model="AddVariant" type="text" label="Variant Name" />
        <q-btn type="submit" color="primary" :disable="!AddVariant" class="q-py-md w-100">
          <div>add {{ AddVariant }}</div>
        </q-btn>
      </q-form>
    </div>
    <div v-if="!VariantDataToggle">
      <h5 class="q-ma-none q-mt-md text-center text-bold">Variant Data</h5>
      <q-form class="row q-mt-md q-pa-xs" @submit="">
        <q-input class="col-xs-12 q-py-xs q-mb-xs" filled clearable v-model="AddVariantData" type="text" label="Variant Data  " />
        <q-btn type="submit" color="primary" :disable="!AddVariantData" class="q-py-md w-100">
          <div>add {{ AddVariantData }}</div>
        </q-btn>
      </q-form>
    </div>
    <!-- <div v-if="!VariantdataToggle">
      <h5 class="q-ma-none q-mt-md text-center text-bold">Variant Data</h5>
      <q-form class="row q-mt-md q-pa-xs" @submit="">
        <q-input class="col-xs-12 q-py-xs q-mb-xs" filled clearable v-model="AddVariantdata" type="text" label="Location Name" />
        <q-btn type="submit" color="primary" :disable="!AddVariantData" class="q-py-md w-100">
          <div>add {{ AddVariantData }}</div>
        </q-btn>
      </q-form>
    </div> -->

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
  updateDoc(doc(db, 'maps_data', 'testdata'), {
    locations: arrayUnion(
      {
        name: AddLocation.value,
        id: AddLocation.value.replace(/ /g, "_").toLocaleLowerCase() + '_' + Math.random().toString(36).slice(2)
      }
    )
  }).then((data) => {
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
  console.log(locationsdata.value);
});

function delloc(name, id) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete ' + '(' + name + ')' + ' Location',
    cancel: true,
    persistent: true
  }).onOk(() => {
    updateDoc(doc(db, 'maps_data', 'testdata'), {
      locations: arrayRemove(
        {
          name: name,
          id: id
        }
      )
    }).then((data) => {
      console.log('removed');
    })
  })
}

// reference locations
const reflocation = ref()

const variant = ref()
const reftime = ref()
const variants = ref([])

let Locations = ref([])
getDoc(doc(db, 'maps_data', 'locations')).then((data) => {
  Locations.value = data.data().locations
})

watch(reflocation, (location) => {
  if (location) {
    variants.value = []
    variant.value = null
    getDoc(doc(db, 'maps_data', 'variants')).then(res => {
      let data = res.data()[location.id]
      data.forEach(element => {
        variants.value.push(element)
      });
    })
  }
})


const adddata = (() => {
  console.log('yes');
  updateDoc(doc(db, 'maps_data', 'variants_data'), {
    data: arrayUnion(
      {
        location: reflocation.value.name,
        track_id: variant.value.data_id,
        track_name: variant.value.track,
        time: reftime.value
      }
    )
  }).then((data) => {
    console.log('added');
  })
})


// getDoc(doc(db, 'maps_data', 'variants_data')).then((data) => {
//   console.log(data.data());
//   let vardata = data.data().data
//   vardata.forEach(element => {
//     if (element.track_id == 'out_of_bounds_ovbj066dcoa') {
//       console.log(element);
//     }
//   });
// })



</script>
<style lang="scss" scoped>
.gap-btns {
  // gap: 4px;
}
</style>
