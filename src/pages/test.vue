<template>
  <div>
    <q-btn color="primary" class="q-ma-xl" label="OK" @click="onClick" />
  </div>
</template>
<script setup>
import { db, auth } from '../firebase'
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { useRouter } from 'vue-router'

const router = useRouter()

const onClick = () => {

  getDoc(doc(db, 'management_data', 'clash_information')).then(data => {
    let opponent_club = data.data().opponent_club
    console.log('opponent', data.data().opponent_club);

    setDoc(doc(db, "users_data", 'ynCOHXLVfbSuJSzNlHO4wFj5rZ92'), {
      user_id: 'ynCOHXLVfbSuJSzNlHO4wFj5rZ92',
      datetime: new Date(),
      [opponent_club]: { defence: [], attack: [] }
    });
    console.log('done');



  })



  // setDoc(doc(db, "users_data", data.user.uid), {
  //   user_id: data.user.uid,
  //   name: data.user.displayName,
  //   email: data.user.email,
  //   role: 'user',
  //   status: 'enabled',
  //   datetime: new Date(),
  //   currclub: { defence: [], attack: [] }
  // });
}
</script>
