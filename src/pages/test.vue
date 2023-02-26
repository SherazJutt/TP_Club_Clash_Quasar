<template>
<div class="q-pa-md">
  <q-btn color="primary" icon="check" label="OK" @click="add_data" />
</div>
</template>

<script setup >
import { ref } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'


const add_data = (() => {
  getDoc(doc(db, 'management_data', 'TerritoryManagement')).then((data) => {
    let data_arr = data.data().TerritoryNames
    data_arr.forEach(element => {
      for (let i = 1; i <= 16; i++) {
        updateDoc(doc(db, 'management_data', 'TerritoryManagement'), {
          [element.id]: arrayUnion({
            id: i,
            label: i,
            is_junction: false,
            is_assigned: false,
            assigned_to: null,
            assigned_to_id: null
          })
        })
      }

    });
  });
})








</script>
