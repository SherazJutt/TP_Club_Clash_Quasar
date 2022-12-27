import { defineStore } from 'pinia';
import { db } from '../firebase';
import { getDoc, doc, onSnapshot } from "firebase/firestore";


export const useGlobalVariables = defineStore('GlobalVariables', {
  state: () => ({
    curr_user_role: null,
    curr_user_data: null,
    current_clash: null,
    Global_AllCarsArr: []
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
      });
      // get all cars
      onSnapshot(doc(db, 'management_data', 'cars'), (data) => {
        let d = data.data().d
        let c = data.data().c
        let b = data.data().b
        let a = data.data().a
        let s = data.data().s
        d.forEach(element => {
          this.Global_AllCarsArr.push(element)
        });
        c.forEach(element => {
          this.Global_AllCarsArr.push(element)
        });
        b.forEach(element => {
          this.Global_AllCarsArr.push(element)
        });
        a.forEach(element => {
          this.Global_AllCarsArr.push(element)
        });
        s.forEach(element => {
          this.Global_AllCarsArr.push(element)
        });
        // console.log(this.Global_AllCarsArr);
      });
    },
  },
  getters: {

  },
});
