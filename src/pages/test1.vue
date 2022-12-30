<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-btn color="primary" icon="check" label="OK" @click="addtrackdata" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';

let variantid = 'Us_Midwest_h1pnvwaeczn'

const trackdata = [
  {
    "time": "90",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Canyon Launch"
  },
  {
    "time": "90",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Covered Bridge"
  },
  {
    "time": "90",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Gold Rush"
  },
  {
    "time": "30",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Its a Twister"
  },
  {
    "time": "120",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Navajo Nation"
  },
  {
    "time": "60",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Rolling Motorway"
  },
  {
    "time": "60",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Time Travel"
  },
  {
    "time": "30",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Trainspotter"
  },
  {
    "time": "90",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Transcontinental Race"
  },
  {
    "time": "120",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "US Wilderness"
  },
  {
    "time": "90",
    "location": "US Midwest",
    "location_id": "Us_Midwest_h1pnvwaeczn",
    "track": "Whirlwind Curve"
  }
]

const addtrackdata = (() => {
  updateDoc(doc(db, 'maps_data', 'variants'), {
    [variantid]: trackdata
  }).then(res => {
    console.log('added');
  })
})

</script>
