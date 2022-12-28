<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-btn color="primary" icon="check" label="OK" @click="addtrackdata" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount, onMounted } from "vue";
import { collection, getDocs, onSnapshot, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';
import { db } from '../firebase';

const Shanghai = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "1",
    "Track": "Shanghai",
    "Trackvariant": "Nanjing Stroll",
    "OpponentClub": "UERK",
    "OpponentName": "David",
    "CarClass": "D",
    "OpponentCar": "Pagani Huayra BC",
    "OpponentTime": "1.06.330"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "5",
    "Track": "Shanghai",
    "Trackvariant": "Pudong Rise",
    "OpponentClub": "UERK",
    "OpponentName": "Oil",
    "CarClass": "C",
    "OpponentCar": "Gallardo",
    "OpponentTime": "1.11.717"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "13",
    "Track": "Shanghai",
    "Trackvariant": "The Pearl of the Orient",
    "OpponentClub": "UERK",
    "OpponentName": "JF05",
    "CarClass": "B",
    "OpponentCar": "Gallardo",
    "OpponentTime": "1.09.615"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "7",
    "Track": "Shanghai",
    "Trackvariant": "Pudong Rise",
    "OpponentClub": "UERK",
    "OpponentName": "nueinchan",
    "CarClass": "C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.12.013"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "19",
    "Track": "Shanghai",
    "Trackvariant": "Nanjing Stroll",
    "OpponentClub": "UERK",
    "OpponentName": "Akuma Chan",
    "CarClass": "A",
    "OpponentCar": "918 Spyder",
    "OpponentTime": "1.06.435"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "7",
    "Track": "Shanghai",
    "Trackvariant": "Pudong Rise",
    "OpponentClub": "UERK",
    "OpponentName": "Oil",
    "CarClass": "D/C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.12.825"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "19",
    "Track": "Shanghai",
    "Trackvariant": "Nanjing Stroll",
    "OpponentClub": "UERK",
    "OpponentName": "Knight",
    "CarClass": "A",
    "OpponentCar": "Huracan Super Trofeo",
    "OpponentTime": "1.13.675"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "5",
    "Track": "Shanghai",
    "Trackvariant": "The Pearl of the Orient",
    "OpponentClub": "UERK",
    "OpponentName": "Xmen",
    "CarClass": "C",
    "OpponentCar": "Porsche Carrera",
    "OpponentTime": "1.09.931"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "23",
    "Track": "Shanghai",
    "Trackvariant": "Double Roundabout",
    "OpponentClub": "UERK",
    "OpponentName": "Oil",
    "CarClass": "S",
    "OpponentCar": "Rimac Nevera",
    "OpponentTime": "00.30.116"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "5",
    "Track": "Shanghai",
    "Trackvariant": "Pudong Rise",
    "OpponentClub": "UERK",
    "OpponentName": "Regularity",
    "CarClass": "C",
    "OpponentCar": "Gallardo",
    "OpponentTime": "1.11.976"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "20",
    "Track": "Shanghai",
    "Trackvariant": "Shen City",
    "OpponentClub": "UERK",
    "OpponentName": "LightDash",
    "CarClass": "B",
    "OpponentCar": "Aston Martin DBS",
    "OpponentTime": "00.51.429"
  }
]
const Scotland = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "2",
    "Track": "Scotland",
    "Trackvariant": "Ancient Ruins",
    "OpponentClub": "UERK",
    "OpponentName": "Akuma Chan",
    "CarClass": "D",
    "OpponentCar": "VLF",
    "OpponentTime": "00.59.796"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "7",
    "Track": "Scotland",
    "Trackvariant": "Ancient Ruins",
    "OpponentClub": "UERK",
    "OpponentName": "Oil",
    "CarClass": "C",
    "OpponentCar": "SV",
    "OpponentTime": "1.00.321"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "8",
    "Track": "Scotland",
    "Trackvariant": "The Cave",
    "OpponentClub": "UERK",
    "OpponentName": "Orange",
    "CarClass": "C",
    "OpponentCar": "Ferrari 599xx",
    "OpponentTime": "00.57.508"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "14",
    "Track": "Scotland",
    "Trackvariant": "The Cave",
    "OpponentClub": "UERK",
    "OpponentName": "JF05",
    "CarClass": "B",
    "OpponentCar": "Ferrari 599xx",
    "OpponentTime": "00.57.528"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "4",
    "Track": "Scotland",
    "Trackvariant": "Ancient Ruins",
    "OpponentClub": "UERK",
    "OpponentName": "Gioni",
    "CarClass": "C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.01.801"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "8",
    "Track": "Scotland",
    "Trackvariant": "The Cave",
    "OpponentClub": "UERK",
    "OpponentName": "Regularity",
    "CarClass": "C",
    "OpponentCar": "718 Cayman GT4",
    "OpponentTime": "00.58.320"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "20",
    "Track": "Scotland",
    "Trackvariant": "Ancient Ruins",
    "OpponentClub": "UERK",
    "OpponentName": "Driver_555",
    "CarClass": "S",
    "OpponentCar": "TVR",
    "OpponentTime": "1.04.770"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "4",
    "Track": "Scotland",
    "Trackvariant": "Ancient Ruins",
    "OpponentClub": "UERK",
    "OpponentName": "Tarek Hossen",
    "CarClass": "D",
    "OpponentCar": "TVR",
    "OpponentTime": "1.04.830"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "8",
    "Track": "Scotland",
    "Trackvariant": "The Cave",
    "OpponentClub": "UERK",
    "OpponentName": "nueinchan",
    "CarClass": "D/C",
    "OpponentCar": "C7.R",
    "OpponentTime": "1.01.111"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "20",
    "Track": "Scotland",
    "Trackvariant": "Ancient Ruins",
    "OpponentClub": "UERK",
    "OpponentName": "Ferrari 250",
    "CarClass": "A",
    "OpponentCar": "TVR",
    "OpponentTime": "1.05.115"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "7",
    "Track": "Scotland",
    "Trackvariant": "The path of the Wind",
    "OpponentClub": "UERK",
    "OpponentName": "Akuma Chan",
    "CarClass": "C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.03.258"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "7",
    "Track": "Scotland",
    "Trackvariant": "Ancient Ruins",
    "OpponentClub": "UERK",
    "OpponentName": "Netpes",
    "CarClass": "D",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.01.797"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "8",
    "Track": "Scotland",
    "Trackvariant": "The Cave",
    "OpponentClub": "UERK",
    "OpponentName": "Xmen",
    "CarClass": "D",
    "OpponentCar": "488 Challenge Evo",
    "OpponentTime": "00.57.873"
  }
]
const Rome = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "3",
    "Track": "Rome",
    "Trackvariant": "Eternal City",
    "OpponentClub": "UERK",
    "OpponentName": "Netpes",
    "CarClass": "D",
    "OpponentCar": "Chiron",
    "OpponentTime": "00.58.670"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "10",
    "Track": "ROME",
    "Trackvariant": "St Peter's Kickoff",
    "OpponentClub": "UERK",
    "OpponentName": "Knight",
    "CarClass": "C",
    "OpponentCar": "Laferari",
    "OpponentTime": "1.14.206"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "22",
    "Track": "ROME",
    "Trackvariant": "St Peter's Kickoff",
    "OpponentClub": "UERK",
    "OpponentName": "Knight",
    "CarClass": "S",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.15.365"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "2",
    "Track": "ROME",
    "Trackvariant": "St Peter's Kickoff",
    "OpponentClub": "UERK",
    "OpponentName": "rub_da_nub",
    "CarClass": "C",
    "OpponentCar": "FXX-K",
    "OpponentTime": "1.17.271"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "9",
    "Track": "ROME",
    "Trackvariant": "St Peter's Kickoff",
    "OpponentClub": "UERK",
    "OpponentName": "Netpes",
    "CarClass": "B",
    "OpponentCar": "TVR",
    "OpponentTime": "1.20.895"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "21",
    "Track": "Rome",
    "Trackvariant": "Eternal City",
    "OpponentClub": "UERK",
    "OpponentName": "Akuma Chan",
    "CarClass": "S",
    "OpponentCar": "Icona",
    "OpponentTime": "1.03.534"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "2",
    "Track": "ROME",
    "Trackvariant": "St Peter's Kickoff",
    "OpponentClub": "UERK",
    "OpponentName": "Driver_555",
    "CarClass": "D",
    "OpponentCar": "SR1",
    "OpponentTime": "1.23.420"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "9",
    "Track": "ROME",
    "Trackvariant": "St Peter's Kickoff",
    "OpponentClub": "UERK",
    "OpponentName": "BingusTheDinoCat",
    "CarClass": "D",
    "OpponentCar": "Volkswagen XL Sport",
    "OpponentTime": "1.24.927"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "21",
    "Track": "Rome",
    "Trackvariant": "Eternal City",
    "OpponentClub": "UERK",
    "OpponentName": "Gioni",
    "CarClass": "S",
    "OpponentCar": "TVR",
    "OpponentTime": "1.10.290"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "4",
    "Track": "Rome",
    "Trackvariant": "Tiber Stream",
    "OpponentClub": "UERK",
    "OpponentName": "Salim Shady",
    "CarClass": "D",
    "OpponentCar": "Trezor",
    "OpponentTime": "1.12.437"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "10",
    "Track": "ROME",
    "Trackvariant": "St Peter's Kickoff",
    "OpponentClub": "UERK",
    "OpponentName": "Salim Shady",
    "CarClass": "D/C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.15.716"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "24",
    "Track": "Rome",
    "Trackvariant": "Tiber Stream",
    "OpponentClub": "UERK",
    "OpponentName": "Ferrari 250",
    "CarClass": "A",
    "OpponentCar": "VLF",
    "OpponentTime": "1.04.737"
  }
]
const Himalayas = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "4",
    "Track": "Himalayas",
    "Trackvariant": "Cliffhanger",
    "OpponentClub": "UERK",
    "OpponentName": "David",
    "CarClass": "D",
    "OpponentCar": "TVR",
    "OpponentTime": "1.14.403"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "12",
    "Track": "Himalayas",
    "Trackvariant": "Dipping Down",
    "OpponentClub": "UERK",
    "OpponentName": "LightDash",
    "CarClass": "B",
    "OpponentCar": "Apollo N",
    "OpponentTime": "1.05.964"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "23",
    "Track": "Himalayas",
    "Trackvariant": "Dipping Down",
    "OpponentClub": "UERK",
    "OpponentName": "Oil",
    "CarClass": "S",
    "OpponentCar": "Regera",
    "OpponentTime": "1.01.139"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "6",
    "Track": "Himalayas",
    "Trackvariant": "Dipping Down",
    "OpponentClub": "UERK",
    "OpponentName": "Orange",
    "CarClass": "C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.07.305"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "15",
    "Track": "Himalayas",
    "Trackvariant": "Freefall",
    "OpponentClub": "UERK",
    "OpponentName": "Regularity",
    "CarClass": "A",
    "OpponentCar": "Apollo N",
    "OpponentTime": "00.20.902"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "6",
    "Track": "Himalayas",
    "Trackvariant": "Dipping Down",
    "OpponentClub": "UERK",
    "OpponentName": "Night fury",
    "CarClass": "C",
    "OpponentCar": "SV",
    "OpponentTime": "1.06.947"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "15",
    "Track": "Himalayas",
    "Trackvariant": "Freefall",
    "OpponentClub": "UERK",
    "OpponentName": "Tarek Hossen",
    "CarClass": "B",
    "OpponentCar": "F1 LM",
    "OpponentTime": "00.20.590"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "1",
    "Track": "Himalayas",
    "Trackvariant": "Frozen Route",
    "OpponentClub": "UERK",
    "OpponentName": "Salim Shady",
    "CarClass": "D",
    "OpponentCar": "TVR",
    "OpponentTime": "1.16.837"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "3",
    "Track": "Himalayas",
    "Trackvariant": "Cliffhanger",
    "OpponentClub": "UERK",
    "OpponentName": "JF05",
    "CarClass": "D",
    "OpponentCar": "TVR",
    "OpponentTime": "1.14.443"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "4",
    "Track": "Himalayas",
    "Trackvariant": "Cliffhanger",
    "OpponentClub": "UERK",
    "OpponentName": "BingusTheDinoCat",
    "CarClass": "D",
    "OpponentCar": "TVR",
    "OpponentTime": "1.14.134"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "15",
    "Track": "Himalayas",
    "Trackvariant": "Freefall",
    "OpponentClub": "UERK",
    "OpponentName": "BingusTheDinoCat",
    "CarClass": "B",
    "OpponentCar": "Pagani Imola",
    "OpponentTime": "00.20.309"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "23",
    "Track": "Himalayas",
    "Trackvariant": "Dipping Down",
    "OpponentClub": "UERK",
    "OpponentName": "Gioni",
    "CarClass": "A",
    "OpponentCar": "Maserati Alfieri",
    "OpponentTime": "1.09.237"
  }
]
const Cairo = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "6",
    "Track": "Cairo",
    "Trackvariant": "Nile River",
    "OpponentClub": "UERK",
    "OpponentName": "JF05",
    "CarClass": "C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.16.981"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "1",
    "Track": "Cairo",
    "Trackvariant": "Thousand Minarets",
    "OpponentClub": "UERK",
    "OpponentName": "Ferrari 250",
    "CarClass": "C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.16.301"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "14",
    "Track": "Cairo",
    "Trackvariant": "Ancient Wonders",
    "OpponentClub": "UERK",
    "OpponentName": "BingusTheDinoCat",
    "CarClass": "B",
    "OpponentCar": "Gallardo",
    "OpponentTime": "1.01.350"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "1",
    "Track": "Cairo",
    "Trackvariant": "Thousand Minarets",
    "OpponentClub": "UERK",
    "OpponentName": "Orange",
    "CarClass": "D",
    "OpponentCar": "TVR",
    "OpponentTime": "1.20.580"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "14",
    "Track": "Cairo",
    "Trackvariant": "Ancient Wonders",
    "OpponentClub": "UERK",
    "OpponentName": "Xmen",
    "CarClass": "C/B",
    "OpponentCar": "Rezvani",
    "OpponentTime": "1.07.285"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "6",
    "Track": "Cairo",
    "Trackvariant": "Ancient Wonders",
    "OpponentClub": "UERK",
    "OpponentName": "Salim Shady",
    "CarClass": "C",
    "OpponentCar": "VW W12",
    "OpponentTime": "00.58.601"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "6",
    "Track": "Cairo",
    "Trackvariant": "Thousand Minarets",
    "OpponentClub": "UERK",
    "OpponentName": "Tarek Hossen",
    "CarClass": "C",
    "OpponentCar": "Arrinera",
    "OpponentTime": "1.15.711"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "14",
    "Track": "Cairo",
    "Trackvariant": "Ancient Wonders",
    "OpponentClub": "UERK",
    "OpponentName": "David",
    "CarClass": "C",
    "OpponentCar": "Chevrolet Corvette GS",
    "OpponentTime": "1.00.674"
  },
]
const NewYork = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "9",
    "Track": "New York",
    "Trackvariant": "UpTown",
    "OpponentClub": "UERK",
    "OpponentName": "Driver_555",
    "CarClass": "C",
    "OpponentCar": "Dezir",
    "OpponentTime": "1.16.489"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "12",
    "Track": "New York",
    "Trackvariant": "Leaps & Bounds",
    "OpponentClub": "UERK",
    "OpponentName": "rub_da_nub",
    "CarClass": "B",
    "OpponentCar": "Aston Martin Vantage",
    "OpponentTime": "1.15.901"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "9",
    "Track": "New York",
    "Trackvariant": "UpTown",
    "OpponentClub": "UERK",
    "OpponentName": "Netpes",
    "CarClass": "C",
    "OpponentCar": "Icona",
    "OpponentTime": "1.06.864"
  }
]
const UsMidwest = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "11",
    "Track": "US MidWest",
    "Trackvariant": "TRanscontinental",
    "OpponentClub": "UERK",
    "OpponentName": "LightDash",
    "CarClass": "B",
    "OpponentCar": "F12 TDF",
    "OpponentTime": "1.07.448"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "15",
    "Track": "US MidWest",
    "Trackvariant": "Trainspotter",
    "OpponentClub": "UERK",
    "OpponentName": "Netpes",
    "CarClass": "B",
    "OpponentCar": "FXX-K",
    "OpponentTime": "00.24.082"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "17",
    "Track": "US MidWest",
    "Trackvariant": "Canyon Launch",
    "OpponentClub": "UERK",
    "OpponentName": "rub_da_nub",
    "CarClass": "A",
    "OpponentCar": "Aston Martin Vulcan",
    "OpponentTime": "1.15.605"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "17",
    "Track": "US MidWest",
    "Trackvariant": "Canyon Launch",
    "OpponentClub": "UERK",
    "OpponentName": "Xmen",
    "CarClass": "A",
    "OpponentCar": "Ford Shelby GR-1",
    "OpponentTime": "1.20.781"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "9",
    "Track": "US MidWest",
    "Trackvariant": "Gold Rush",
    "OpponentClub": "UERK",
    "OpponentName": "Orange",
    "CarClass": "C",
    "OpponentCar": "Gallardo",
    "OpponentTime": "1.05.891"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "11",
    "Track": "US MidWest",
    "Trackvariant": "Canyon Launch",
    "OpponentClub": "UERK",
    "OpponentName": "Oil",
    "CarClass": "C/B",
    "OpponentCar": "VLF",
    "OpponentTime": "1.11.401"
  },
]
const Nevada = [
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "16",
    "Track": "Nevada",
    "Trackvariant": "Tunnel Sprint",
    "OpponentClub": "UERK",
    "OpponentName": "Gioni",
    "CarClass": "B",
    "OpponentCar": "Speedtail",
    "OpponentTime": "00.23.407"
  },
  {
    "BlueTerritory": "Back Kitchen",
    "RedTerritory": "Financial District",
    "RaceNo": "17",
    "Track": "Nevada",
    "Trackvariant": "Dam Buster",
    "OpponentClub": "UERK",
    "OpponentName": "nueinchan",
    "CarClass": "A",
    "OpponentCar": "Aston Martin Vulcan",
    "OpponentTime": "1.24.213"
  },
  {
    "BlueTerritory": "Down Village",
    "RedTerritory": "Under Pass",
    "RaceNo": "13",
    "Track": "Nevada",
    "Trackvariant": "Desert Life",
    "OpponentClub": "UERK",
    "OpponentName": "LightDash",
    "CarClass": "B",
    "OpponentCar": "Acura NSX 2017",
    "OpponentTime": "1.20.984"
  },
  {
    "BlueTerritory": "Gold Hills",
    "RedTerritory": "Uptown",
    "RaceNo": "13",
    "Track": "Nevada",
    "Trackvariant": "Desert Life",
    "OpponentClub": "UERK",
    "OpponentName": "LightDash",
    "CarClass": "B",
    "OpponentCar": "BMW M4 GTS",
    "OpponentTime": "1.24.101"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "12",
    "Track": "Nevada",
    "Trackvariant": "Desert Life",
    "OpponentClub": "UERK",
    "OpponentName": "Ferrari 250",
    "CarClass": "B",
    "OpponentCar": "F-Type SVR",
    "OpponentTime": "1.20.483"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "18",
    "Track": "Nevada",
    "Trackvariant": "The Narrows",
    "OpponentClub": "UERK",
    "OpponentName": "Akuma Chan",
    "CarClass": "A",
    "OpponentCar": "J50",
    "OpponentTime": "1.37.098"
  },
  {
    "BlueTerritory": "High Village",
    "RedTerritory": "East Valley",
    "RaceNo": "21",
    "Track": "Nevada",
    "Trackvariant": "Tunnel Sprint",
    "OpponentClub": "UERK",
    "OpponentName": "Tarek Hossen",
    "CarClass": "S",
    "OpponentCar": "Huracan Evo",
    "OpponentTime": "00.23.130"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "13",
    "Track": "Nevada",
    "Trackvariant": "Desert Life",
    "OpponentClub": "UERK",
    "OpponentName": "Xmen",
    "CarClass": "C",
    "OpponentCar": "Porsche 911 GT3RS",
    "OpponentTime": "1.17.532"
  },
  {
    "BlueTerritory": "Sub Urbs",
    "RedTerritory": "River Park",
    "RaceNo": "17",
    "Track": "Nevada",
    "Trackvariant": "Desert Run",
    "OpponentClub": "UERK",
    "OpponentName": "Regularity",
    "CarClass": "A",
    "OpponentCar": "Aston Martin DBS",
    "OpponentTime": "1.12.684"
  }
]

const addtrackdata = (() => {
  updateDoc(doc(db, 'management_data', 'Tracks'), {
    Shanghai: Shanghai,
    Scotland: Scotland,
    Rome: Rome,
    Himalayas: Himalayas,
    Cairo: Cairo,
    NewYork: NewYork,
    UsMidwest: UsMidwest,
    Nevada: Nevada
  }).then(res => {
    console.log('added');
  })
})
</script>
