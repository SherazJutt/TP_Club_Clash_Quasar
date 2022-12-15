<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn @click="simulateProgress(0)" label="Button" />
    <q-btn label="Confirm" color="primary" @click="confirm" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase';
import { onSnapshot, doc, getDoc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { useQuasar } from 'quasar'
import { async } from '@firebase/util';
const $q = useQuasar()




const confirm = (() => {
  $q.dialog({
    title: 'Delete',
    // message: 'Would you like to turn on the wifi?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    console.log('>>>> OK')
  })
})












const simulateProgress = (async () => {
  const DocIDS = []
  const querySnapshot = await getDocs(collection(db, "user_races"));
  querySnapshot.forEach((doc) => {
    DocIDS.push(doc.id)
  });
  console.log(DocIDS);
})




// let time = data.data().datetime

// const fireBaseTime = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);
// const date = fireBaseTime.toDateString();
// const atTime = fireBaseTime.toLocaleTimeString();
// console.log(date, atTime);
</script>
