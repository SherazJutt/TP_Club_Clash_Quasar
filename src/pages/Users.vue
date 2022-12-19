<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-center">Name</th>
          <th class="text-center">Email</th>
          <th class="text-center">Member Of</th>
          <th class="text-center">Role</th>
          <th class="text-center">Status</th>
          <th class="text-center">Account Created On</th>
          <th class="text-center">Profile Image</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="users_data" v-for="(item, index) in users_data" :key="index">
          <td class="text-center">{{ item.name }}</td>
          <td class="text-center">{{ item.email }}</td>
          <td class="text-center text-capitalize">{{ item.member_of }}</td>
          <td class="text-center text-capitalize">{{ item.role }}</td>
          <td class="text-center text-capitalize">{{ item.status }}</td>
          <td class="text-center text-capitalize">{{ item.datetime }}</td>
          <td class="text-center text-capitalize"><q-img :src="item.profileimg" style="width: 50px; height: 50px; border-radius: 5px;" /></td>
          <td class="text-center text-capitalize"><q-btn-dropdown dense="" color="primary" label="">
              <q-list>
                <q-item clickable v-close-popup v-if="item.role == 'admin'" @click="Role(item.uid, 'user')">
                  <q-item-section>
                    <q-item-label>Assign User Role</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-if="item.role == 'user'" @click="Role(item.uid, 'admin')">
                  <q-item-section>
                    <q-item-label>Assign Admin Role</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator color="gray" />
                <q-item clickable v-if="item.member_of == 'none'" v-close-popup @click="MemberOf(item.uid, 'team1')">
                  <q-item-section>
                    <q-item-label>Make Member of team 1</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup v-if="item.member_of == 'team1'" @click="MemberOf(item.uid, 'none')">
                  <q-item-section>
                    <q-item-label>remove from team1</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator color="gray" />
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Disable <span class="text-red">{{ item.name }}</span></q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown></td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase';
import { onSnapshot, doc, getDoc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore";
import { useGlobalVariables } from 'src/stores/GlobalVariables';

const GlobalVariables = useGlobalVariables();

const users_data = ref([])

onSnapshot(collection(db, 'users_data'), (data) => {
  let custom_user_data = []
  data.forEach(data => {
    let uid = data.data().user_id
    let name = data.data().name
    let email = data.data().email
    let member_of = data.data().member_of
    let role = data.data().role
    let status = data.data().status
    let datetime = new Date(data.data().datetime.seconds * 1000 + data.data().datetime.nanoseconds / 1000000).toDateString();
    let profileimg = data.data().profileImg
    custom_user_data.push({ uid, name, email, role, status, datetime, profileimg, member_of })
  });
  users_data.value = custom_user_data
});
// role toggle
const Role = ((index, role) => {
  updateDoc(doc(db, 'users_data', index), {
    role: role
  })
})
// member toggle
const MemberOf = ((index, member) => {
  updateDoc(doc(db, 'users_data', index), {
    member_of: member
  })
})
</script>
<style lang="scss">
.border-red {
  border: 1px solid red;
}

.border-blue {
  border: 1px solid blue;
}
</style>
