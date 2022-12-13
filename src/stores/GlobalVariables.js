import { defineStore } from 'pinia';
import { db } from '../firebase';
import { getDoc, doc } from "firebase/firestore";


export const useGlobalVariables = defineStore('GlobalVariables', {
  state: () => ({
    name: 'null',
    curr_user_role: null,
    curr_user_data: null,
  }),
  actions: {
    setUser() {
      let user_id = localStorage.getItem('access_token')
      getDoc(doc(db, 'users_data', user_id)).then(custom_user_data => {
        this.curr_user_role = custom_user_data.data().role
        this.curr_user_data = custom_user_data.data()
      })
    },
  },
  getters: {

  },
});
