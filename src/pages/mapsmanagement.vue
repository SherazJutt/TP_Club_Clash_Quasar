<template>
  <div v-if="GlobalVariables.curr_user_role == 'admin'" class="q-pa-md q-mx-auto" style="max-width: 1200px">
    <q-select transition-hide="jump-up" clearable filled v-model="reflocation" option-label="name" option-value="id" :options="Locations" label="Location" />
    <q-select v-if="reflocation" class="q-mt-sm" transition-hide="jump-up" clearable filled v-model="variant" option-label="track" option-value="data_id" :options="variants" label="Variant" />
    <div>{{ variant }}</div>
    <pre>{{ variants }}</pre>
  </div>
</template>
<script setup>
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
// $q.loading.show()

const router = useRouter()
const GlobalVariables = useGlobalVariables();


// reference locations
const reflocation = ref()

const variant = ref()
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





</script>
<style lang="scss" scoped>

</style>
