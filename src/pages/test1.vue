<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-btn color="primary" icon="check" label="OK" @click="adddata" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';


let Locations = [
  'Auckland', 'Buenos Aires', 'Cairo', 'Greenland', 'Himalayas', 'Nevada', 'New York', 'Osaka', 'Rome', 'San Fransisco', 'Scotland', 'Shanghai', 'The Caribbean', 'Us Midwest'
]
// const adddata1 = (() => {
//   Locations.forEach(element => {
//     let uuid = element.replace(/ /g, "_") + '_' + Math.random().toString(36).slice(2);
//     console.log(uuid);
//     updateDoc(doc(db, 'management_data', 'maps_management'), {
//       Locations:
//         arrayUnion({
//           name: element,
//           id: uuid
//         })
//     }).then((res) => {
//       console.log('added');
//     })
//   });

// })

// const adddata = (() => {
//   getDoc(doc(db, 'management_data', 'TerritoryManagement')).then((data) => {
//     let names = data.data().names
//     names.forEach(element => {
//       console.log(element.name + ' => ' + element.id);
//       let uuid = element.name.replace(/ /g, "_") + '_' + Math.random().toString(36).slice(2)
//       updateDoc(doc(db, 'management_data', 'TerritoryManagement'), {
//         TerritoryNames:
//           arrayUnion({
//             name: element.name,
//             id: uuid
//           })
//       }).then((res) => {
//         console.log('added');
//       })
//     });
//   })
// })
const adddata = (() => {
  names.forEach(element => {
    console.log(element.name + ' => ' + element.id);
    let uuid = element.name.replace(/ /g, "_") + '_' + Math.random().toString(36).slice(2)
    updateDoc(doc(db, 'management_data', 'TerritoryManagement'), {
      TerritoryNames:
        arrayUnion({
          name: element.name,
          id: uuid
        })
    }).then((res) => {
      console.log('added');
    })
  });
})

// Locations.forEach(element => {
//   console.log(element);
// });

</script>
