<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 1000px">

    <q-tabs v-model="tab" class="bg-grey-1 q-px-md" dense align="justify">
      <q-tab class="text-cyan" name="Defence" label="Defence" />
      <q-tab class="text-red" name="Attack" label="Attack" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Defence">
        <div class="border q-mb-sm" v-for="(race, index) in defence" :key="index">
          <q-expansion-item expand-icon-class="text-white" group="somegroup"
            style="font-size: 20px; border-radius: 30px"
            :label="'Race ' + ' #             ' + (index + 1) + ((race.category))"
            header-class="bg-blue-8 text-white q-py-md">
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-center" v-for="(column, index) in columns" :key="index">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="text-center">{{ race.category }}</td>
                  <td class="text-center">{{ race.race_no }}</td>
                  <td class="text-center">{{ race.recommended_car }}</td>
                  <td class="text-center">{{ race.ref_time }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-expansion-item>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Attack">
        <div class="text-h6">Attack</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>

  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { collection, onSnapshot, getDoc, addDoc, doc, deleteDoc, serverTimestamp, setDoc, updateDoc, arrayUnion, FieldValue, } from "firebase/firestore";
import { db } from '../firebase';
import { useQuasar } from 'quasar'

const $q = useQuasar()
let timer
const inputfield = ref([])
const defence = ref([])
const attack = ref([])
const columns = ref(['Category', 'Race No', 'Recommended Car', 'Refrence Time'])
const tab = ref('Defence')


onMounted(() => {
  // $q.loading.show()
  let uid = localStorage.getItem('access_token');
  getDoc(doc(db, "user_races", uid)).then(data => {
    defence.value = data.data().races[0].defence;
    attack.value = data.data().races[0].attack;
    console.log(data.data().races[0].defence);
    $q.loading.hide()
  })

})

const addnewsnippet = () => {
  addDoc(collection(db, "cars"), {
    done: true,
  })
  inputfield.value = ''
}

</script>
