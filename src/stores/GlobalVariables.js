import { defineStore } from 'pinia';
import { db } from '../firebase';
import { getDoc, doc, onSnapshot } from "firebase/firestore";


export const useGlobalVariables = defineStore('GlobalVariables', {
  state: () => ({
    curr_user_role: null,
    curr_user_data: null,
    current_clash: null,
    current_clash_opponent: [],
    Global_AllCarsArr: [],
    AllCategoriesNameWithId: []
  }),
  actions: {
    setDataVariables() {
      let user_id = localStorage.getItem('access_token')
      getDoc(doc(db, 'users_data', user_id)).then(custom_user_data => {
        this.curr_user_role = custom_user_data.data().role
        this.curr_user_data = custom_user_data.data()
      })
      // get management data
      onSnapshot(doc(db, 'management_data', 'clash_information'), (data) => {
        this.current_clash = data.data().current_clash
        this.current_clash_opponent = data.data().opponent_club.ClubWithRandomID
      });
      // get all cars
      onSnapshot(doc(db, 'global_data', 'cars_data'), (data) => {
        let cars = data.data().cars
        cars.forEach(element => {
          this.Global_AllCarsArr.push(element)
        });
      });
      // get all territories
      onSnapshot(doc(db, 'management_data', 'TerritoryManagement'), (data) => {
        this.AllCategoriesNameWithId = data.data().TerritoryNames
      });
    },
  },
  getters: {

  },
});
