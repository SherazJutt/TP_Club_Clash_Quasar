<template>
  <div class="q-pa-md">
    <!-- <div v-for="(item, index) in GlobalVariables.Global_AllCarsArr" :key="index">{{ item }}</div> -->
    <!-- <q-form @submit="AddCar" class="formgap flex q-mt-md">
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
    </q-form> -->

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

    <!-- <q-btn color="primary" label="add cars" @click="carsdataadd" /> -->

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase';
import { onSnapshot, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
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

// onSnapshot(doc(db, 'management_data', 'cars'), (data) => {
//   tabscars_d.value = data.data().d
//   tabscars_c.value = data.data().c
//   tabscars_b.value = data.data().b
//   tabscars_a.value = data.data().a
//   tabscars_s.value = data.data().s
//   AllCarsArr = GlobalVariables.Global_AllCarsArr
// })
// setInterval(() => {
//   // console.log(tabscars.value);
//   // console.log(GlobalVariables.Global_AllCarsArr);

// }, 1000);


const interval = setInterval(() => {
  if (GlobalVariables.Global_AllCarsArr.length > 0) {
    let allcars = GlobalVariables.Global_AllCarsArr
    allcars.forEach(element => {
      tabscars_d.value.push(element.Car)
    });
    clearInterval(interval)
  }
}, 250);

const carsdata = [
  {
    "Class": "D",
    "Car": "Mitsubishi Lancer Evolution"
  },
  {
    "Class": "D",
    "Car": "BMW Z4 LCI E89"
  },
  {
    "Class": "D",
    "Car": "Chevrolet Camaro LT"
  },
  {
    "Class": "D",
    "Car": "Nissan Leaf Nismo RC"
  },
  {
    "Class": "D",
    "Car": "Nissan 370Z NISMO"
  },
  {
    "Class": "D",
    "Car": "Volkswagen XL Sport Concept"
  },
  {
    "Class": "D",
    "Car": "DS Automobiles DS E-TENSE"
  },
  {
    "Class": "D",
    "Car": "Dodge Challenger 392 Hemi Scat Pack"
  },
  {
    "Class": "D",
    "Car": "Renault Dezir"
  },
  {
    "Class": "D",
    "Car": "Italdesign Davinci"
  },
  {
    "Class": "D",
    "Car": "BMW i8 Roadster"
  },
  {
    "Class": "D",
    "Car": "Peugeot SR1"
  },
  {
    "Class": "D",
    "Car": "Porsche 718 Cayman"
  },
  {
    "Class": "D",
    "Car": "Infiniti Project Black S"
  },
  {
    "Class": "D",
    "Car": "Lotus Elise Sprint 220"
  },
  {
    "Class": "D",
    "Car": "Lamborghini Countach 25th Anniversary"
  },
  {
    "Class": "D",
    "Car": "Ford Shelby GT350R"
  },
  {
    "Class": "D",
    "Car": "Porsche 911 Targa 4S"
  },
  {
    "Class": "D",
    "Car": "Lotus Emira"
  },
  {
    "Class": "D",
    "Car": "Ginetta G60"
  },
  {
    "Class": "D",
    "Car": "Renault TreZor"
  },
  {
    "Class": "D",
    "Car": "Honda Civic Type-R"
  },
  {
    "Class": "D",
    "Car": "Porsche Taycan Turbo S"
  },
  {
    "Class": "D",
    "Car": "TVR Griffith"
  },
  {
    "Class": "D",
    "Car": "Bentley Continental GT3"
  },
  {
    "Class": "D",
    "Car": "Mazda Furai"
  },
  {
    "Class": "D",
    "Car": "Chevrolet Corvette C7.R"
  },
  {
    "Class": "D",
    "Car": "Lamborghini Huracan Super Trofeo Evo"
  },
  {
    "Class": "D",
    "Car": "Volkswagen Electric R"
  },
  {
    "Class": "D",
    "Car": "Glickenhaus 004C"
  },
  {
    "Class": "C",
    "Car": "Dodge Challenger SRT8"
  },
  {
    "Class": "C",
    "Car": "BMW 3.0 CSL Hommage"
  },
  {
    "Class": "C",
    "Car": "Chevrolet Camaro ZL1 50th Ed."
  },
  {
    "Class": "C",
    "Car": "Lotus Evora Sport 410"
  },
  {
    "Class": "C",
    "Car": "Mercedes-Benz AMG GT S"
  },
  {
    "Class": "C",
    "Car": "BMW M4 GTS"
  },
  {
    "Class": "C",
    "Car": "Rezvani Beast X"
  },
  {
    "Class": "C",
    "Car": "Aston Martin V12 Speedster"
  },
  {
    "Class": "C",
    "Car": "Dodge Viper ACR"
  },
  {
    "Class": "C",
    "Car": "Bolwell MK X Nagari 500"
  },
  {
    "Class": "C",
    "Car": "Ford Shelby GR-1"
  },
  {
    "Class": "C",
    "Car": "Pininfarina H2 Speed"
  },
  {
    "Class": "C",
    "Car": "Artega Scalo Superelletra"
  },
  {
    "Class": "C",
    "Car": "Saleen S1"
  },
  {
    "Class": "C",
    "Car": "Acura NSX (2017)"
  },
  {
    "Class": "C",
    "Car": "Maserati Alfieri"
  },
  {
    "Class": "C",
    "Car": "Ferrari Monza SP1"
  },
  {
    "Class": "C",
    "Car": "ATS Automobili Corsa RRTurbo"
  },
  {
    "Class": "C",
    "Car": "Jaguar XE SV Project 8"
  },
  {
    "Class": "C",
    "Car": "Ferrari F40"
  },
  {
    "Class": "C",
    "Car": "Renault R.S. 01"
  },
  {
    "Class": "C",
    "Car": "Acura NSX GT3 Evo"
  },
  {
    "Class": "C",
    "Car": "Vencer Sarthe"
  },
  {
    "Class": "C",
    "Car": "Bentley Mulliner Bacalar"
  },
  {
    "Class": "C",
    "Car": "Lamborghini Miura Concept"
  },
  {
    "Class": "C",
    "Car": "Porsche 718 Cayman GT4 Clubsport"
  },
  {
    "Class": "C",
    "Car": "Chevrolet Corvette Stingray"
  },
  {
    "Class": "C",
    "Car": "Brabham BT62"
  },
  {
    "Class": "C",
    "Car": "Ferrari 599XX Evo"
  },
  {
    "Class": "C",
    "Car": "Lamborghini Diablo GT"
  },
  {
    "Class": "C",
    "Car": "Arrinera Hussarya 33"
  },
  {
    "Class": "C",
    "Car": "Bugatti EB110"
  },
  {
    "Class": "C",
    "Car": "Lamborghini Gallardo LP560-4"
  },
  {
    "Class": "C",
    "Car": "McLaren GT"
  },
  {
    "Class": "B",
    "Car": "Porsche 911 GTS Coupe"
  },
  {
    "Class": "B",
    "Car": "Aston Martin DB11"
  },
  {
    "Class": "B",
    "Car": "Exotic Rides W70"
  },
  {
    "Class": "B",
    "Car": "Jaguar F-Type SVR"
  },
  {
    "Class": "B",
    "Car": "Porsche 911 GT1 Evolution"
  },
  {
    "Class": "B",
    "Car": "Ford GT"
  },
  {
    "Class": "B",
    "Car": "Lamborghini Asterion"
  },
  {
    "Class": "B",
    "Car": "Ferrari Roma"
  },
  {
    "Class": "B",
    "Car": "Arash AF10"
  },
  {
    "Class": "B",
    "Car": "Cadillac Cien Concept"
  },
  {
    "Class": "B",
    "Car": "Ford GT MK II"
  },
  {
    "Class": "B",
    "Car": "Italdesign Zerouno"
  },
  {
    "Class": "B",
    "Car": "Arash AF8 Falcon Edition"
  },
  {
    "Class": "B",
    "Car": "Ferrari 488 GTB"
  },
  {
    "Class": "B",
    "Car": "Drako GTE"
  },
  {
    "Class": "B",
    "Car": "SCG 003S"
  },
  {
    "Class": "B",
    "Car": "McLaren Elva"
  },
  {
    "Class": "B",
    "Car": "Nissan R390 GT1"
  },
  {
    "Class": "B",
    "Car": "Ferrari F12tdf"
  },
  {
    "Class": "B",
    "Car": "Lamborghini Murcielago LP 640 Roadster"
  },
  {
    "Class": "B",
    "Car": "McLaren 765"
  },
  {
    "Class": "B",
    "Car": "Chevrolet Corvette Grand Sport"
  },
  {
    "Class": "B",
    "Car": "Apex AP-0"
  },
  {
    "Class": "B",
    "Car": "Aston Martin Vantage GT12"
  },
  {
    "Class": "B",
    "Car": "Apollo IE"
  },
  {
    "Class": "B",
    "Car": "Sin R1 550"
  },
  {
    "Class": "B",
    "Car": "Lamborghini Reventon Roadster"
  },
  {
    "Class": "B",
    "Car": "Ferrari Enzo Ferrari"
  },
  {
    "Class": "B",
    "Car": "Aston Martin One77"
  },
  {
    "Class": "B",
    "Car": "Apollo N"
  },
  {
    "Class": "B",
    "Car": "Mercedes-Benz SLR McLaren"
  },
  {
    "Class": "B",
    "Car": "Aston Martin DBS Superleggera"
  },
  {
    "Class": "B",
    "Car": "Lamborghini Essenza SCV12"
  },
  {
    "Class": "B",
    "Car": "Puritalia Berlinetta"
  },
  {
    "Class": "B",
    "Car": "Lamborghini Huracan Evo Spyder"
  },
  {
    "Class": "B",
    "Car": "Porsche Carrera GT"
  },
  {
    "Class": "B",
    "Car": "Nissan GTR-50 Italdesign"
  },
  {
    "Class": "B",
    "Car": "Zenvo TSR-S"
  },
  {
    "Class": "B",
    "Car": "Lamborghini Sesto Elemento"
  },
  {
    "Class": "B",
    "Car": "Porsche 911 GT3 RS"
  },
  {
    "Class": "B",
    "Car": "Ferrari 488 GTB Challenge Evo"
  },
  {
    "Class": "B",
    "Car": "Lotus Evija"
  },
  {
    "Class": "B",
    "Car": "McLaren F1 LM"
  },
  {
    "Class": "B",
    "Car": "Volkswagen W12 Coupe"
  },
  {
    "Class": "B",
    "Car": "Pagani Huayra R"
  },
  {
    "Class": "A",
    "Car": "Aston Martin Vulcan"
  },
  {
    "Class": "A",
    "Car": "Nissan GT-R NISMO"
  },
  {
    "Class": "A",
    "Car": "NIO EP9"
  },
  {
    "Class": "A",
    "Car": "Ferrari J50"
  },
  {
    "Class": "A",
    "Car": "Dodge Viper GTS"
  },
  {
    "Class": "A",
    "Car": "Bentley Continental GT Speed"
  },
  {
    "Class": "A",
    "Car": "Ferrari LaFerrari"
  },
  {
    "Class": "A",
    "Car": "McLaren P1"
  },
  {
    "Class": "A",
    "Car": "Pagani Zonda HP Barchetta"
  },
  {
    "Class": "A",
    "Car": "Lamborghini Aventador SV Coupe"
  },
  {
    "Class": "A",
    "Car": "Ferrari 812 Superfast"
  },
  {
    "Class": "A",
    "Car": "Lego Technic McLaren Senna GTR"
  },
  {
    "Class": "A",
    "Car": "Chevrolet Corvette ZR1"
  },
  {
    "Class": "A",
    "Car": "Jaguar C-X75"
  },
  {
    "Class": "A",
    "Car": "VLF Force 1 V10"
  },
  {
    "Class": "A",
    "Car": "McLaren Senna GTR"
  },
  {
    "Class": "A",
    "Car": "Lamborghini Aventador SVJ Roadster"
  },
  {
    "Class": "A",
    "Car": "Porsche 918 Spyder"
  },
  {
    "Class": "A",
    "Car": "Vanda Electrics Dendrobium"
  },
  {
    "Class": "A",
    "Car": "McLaren 570s Spider"
  },
  {
    "Class": "A",
    "Car": "Lamborghini Aventador J"
  },
  {
    "Class": "A",
    "Car": "Peugeot Onyx"
  },
  {
    "Class": "A",
    "Car": "Pagani Zonda R"
  },
  {
    "Class": "A",
    "Car": "SCG 007S"
  },
  {
    "Class": "A",
    "Car": "Citroen GT by Citroen"
  },
  {
    "Class": "A",
    "Car": "Aston Martin Victor"
  },
  {
    "Class": "A",
    "Car": "Porsche 911 GT2 RS Clubsport"
  },
  {
    "Class": "A",
    "Car": "Pagani Huayra BC"
  },
  {
    "Class": "A",
    "Car": "Lamborghini SC18"
  },
  {
    "Class": "A",
    "Car": "Ferrari LaFerrari Aperta"
  },
  {
    "Class": "A",
    "Car": "Ferrari F8 Tributo"
  },
  {
    "Class": "A",
    "Car": "Lamborghini SC20"
  },
  {
    "Class": "A",
    "Car": "Genty Akylone"
  },
  {
    "Class": "A",
    "Car": "Techrules AT96 Track Version"
  },
  {
    "Class": "A",
    "Car": "Rimac Concept_One"
  },
  {
    "Class": "A",
    "Car": "Aston Martin Valhalla Concept Car"
  },
  {
    "Class": "A",
    "Car": "Pagani Imola"
  },
  {
    "Class": "A",
    "Car": "Lamborghini Countach LPI 800-4"
  },
  {
    "Class": "S",
    "Car": "Lamborghini Centenario"
  },
  {
    "Class": "S",
    "Car": "Ferrari FXX-K"
  },
  {
    "Class": "S",
    "Car": "Icona Vulcano Titanium"
  },
  {
    "Class": "S",
    "Car": "W Motors Lykan HyperSport"
  },
  {
    "Class": "S",
    "Car": "Raesr Tachyon Speed"
  },
  {
    "Class": "S",
    "Car": "Jaguar XJ220S TWR"
  },
  {
    "Class": "S",
    "Car": "Lamborghini Veneno"
  },
  {
    "Class": "S",
    "Car": "Lamborghini Egoista"
  },
  {
    "Class": "S",
    "Car": "TRION Nemesis"
  },
  {
    "Class": "S",
    "Car": "Ferrari SF90 Stradale"
  },
  {
    "Class": "S",
    "Car": "McLaren Senna"
  },
  {
    "Class": "S",
    "Car": "Bugatti Veyron 16.4 Grand Sport Vitesse"
  },
  {
    "Class": "S",
    "Car": "Lamborghini Terzo Millennio"
  },
  {
    "Class": "S",
    "Car": "Vision 1789"
  },
  {
    "Class": "S",
    "Car": "W Motors Fenyr Supersport"
  },
  {
    "Class": "S",
    "Car": "Aston Martin Valkyrie"
  },
  {
    "Class": "S",
    "Car": "Zenvo TS1 GT Anniversary"
  },
  {
    "Class": "S",
    "Car": "Automobili Pininfarina Battista"
  },
  {
    "Class": "S",
    "Car": "Naran Hyper Coupe"
  },
  {
    "Class": "S",
    "Car": "McLaren Speedtail"
  },
  {
    "Class": "S",
    "Car": "Koenigsegg Regera"
  },
  {
    "Class": "S",
    "Car": "Ultima RS"
  },
  {
    "Class": "S",
    "Car": "Lamborghini Sian FKP 37"
  },
  {
    "Class": "S",
    "Car": "Ajlani Drakuma"
  },
  {
    "Class": "S",
    "Car": "Inferno Automobili Inferno"
  },
  {
    "Class": "S",
    "Car": "Bugatti Chiron"
  },
  {
    "Class": "S",
    "Car": "BXR Bailey Blade GT1"
  },
  {
    "Class": "S",
    "Car": "Bugatti Divo"
  },
  {
    "Class": "S",
    "Car": "Tushek TS 900 Racer Pro"
  },
  {
    "Class": "S",
    "Car": "Mazzanti Evantra Millecavalli"
  },
  {
    "Class": "S",
    "Car": "Toroidion 1MW"
  },
  {
    "Class": "S",
    "Car": "Inferno Settimo Cerchio"
  },
  {
    "Class": "S",
    "Car": "Koenigsegg Jesko"
  },
  {
    "Class": "S",
    "Car": "Bugatti Centodieci"
  },
  {
    "Class": "S",
    "Car": "Aspark Owl"
  },
  {
    "Class": "S",
    "Car": "Rimac Nevera"
  },
  {
    "Class": "S",
    "Car": "Koenigsegg Agera RS"
  },
  {
    "Class": "S",
    "Car": "SSC Tuatara"
  },
  {
    "Class": "S",
    "Car": "Bugatti La Voiture Noire"
  },
  {
    "Class": "S",
    "Car": "Koenigsegg Gemera"
  },
  {
    "Class": "S",
    "Car": "Hennessey Venom F5"
  }
]

let car_class = 'C'

const carsdataadd = ((data) => {
  console.log('yes');
  getDoc(doc(db, 'global_data', 'cars_data')).then((data) => {
    let cars = data.data().cars
    cars.forEach(element => {
      if (element.Class == car_class) {
        console.log(element);
      }
    });
  })
  // updateDoc(doc(db, 'global_data', 'cars_data'), {
  //   cars: carsdata
  // }).then(() => {
  //   console.log('added');
  // })
})


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
