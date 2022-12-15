import { defineStore } from 'pinia';
import { db } from '../firebase';
import { getDoc, doc } from "firebase/firestore";


export const useGlobalVariables = defineStore('GlobalVariables', {
  state: () => ({
    curr_user_role: null,
    curr_user_data: null,
    current_clash: null
  }),
  actions: {
    setDataVariables() {
      let user_id = localStorage.getItem('access_token')
      getDoc(doc(db, 'users_data', user_id)).then(custom_user_data => {
        this.curr_user_role = custom_user_data.data().role
        this.curr_user_data = custom_user_data.data()
      })
      // get management data
      getDoc(doc(db, 'management_data', 'clash_information')).then(management_data => {
        this.current_clash = management_data.data().current_clash
      })
    },
  },
  getters: {

  },
});
