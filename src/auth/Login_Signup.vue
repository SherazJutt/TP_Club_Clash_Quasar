<template>
  <q-layout view="lHh Lpr fff">
    <q-page class="row justify-center items-center">
      <div class="column q-pa-lg">
        <div class="row">
          <q-card class="shadow-24 q-pb-md form-card-main" rounded>
            <q-card-section class="bg-blue-9">
              <h4 class="text-h5 q-my-md text-white">{{ title }}</h4>
            </q-card-section>
            <q-card-section>
              <q-fab @click="switchTypeForm" icon="add" class="absolute text-white bg-blue-7"
                style="top: 0; right: 12px; transform: translateY(-50%);">
                <q-tooltip>New User Registration</q-tooltip>
              </q-fab>
              <q-form class="q-px-sm q-pt-xl">
                <q-input ref="email" square clearable v-model="email" type="email" lazy-rules label="Email">
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-input ref="username" square clearable v-model="username" v-if="register" lazy-rules type="username"
                  label="User Name">
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
                <q-input ref="password" square clearable v-model="password" :type="passwordFieldType" lazy-rules
                  label="Password">

                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
                  </template>
                </q-input>
                <q-input ref="repassword" square clearable v-model="repassword" v-if="register"
                  :type="passwordFieldType" lazy-rules label="repeat password">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
                  </template>
                </q-input>
              </q-form>
            </q-card-section>

            <q-card-actions class="q-px-lg">
              <q-btn unelevated size="lg" color="primary" @click="submit" class="full-width text-white"
                :label="btnLabel" />
            </q-card-actions>
            <q-card-section v-if="!register" class="text-center q-pa-sm">
              <p class="text-grey-6">Forgot your password?</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </q-layout>
</template>

<script>
import { auth } from '../firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

export default ({
  data() {
    return {
      title: 'Login',
      email: '',
      username: '',
      password: '',
      repassword: '',
      register: false,
      passwordFieldType: 'password',
      btnLabel: 'Login',
      visibility: false,
      visibilityIcon: 'visibility'
    }
  },
  methods: {
    submit() {





      if (this.register) {
        console.log('signup =>', this.$refs.email, this.$refs.password);

        createUserWithEmailAndPassword(auth, this.email, this.password).then((data) => {
          // add user details in user_data collection
          setDoc(doc(db, "users_data", data.user.uid), {
            name: this.username,
            email: data.user.email,
            role: 'user',
            status: 'enabled',
            datetime: Date.now()
          });
          // add cars details in cars collection
          setDoc(doc(db, 'cars', data.user.uid), {
            d: arrayUnion(),
            c: arrayUnion(),
            b: arrayUnion(),
            a: arrayUnion(),
            s: arrayUnion(),
          });
          // set token in staorage
          localStorage.setItem('access_token', data.user.uid)
          router.push('/')
        }).catch(error => console.log(error))

      } else {
        // console.log('login =>', this.email, this.password);
        signInWithEmailAndPassword(auth, this.email, this.password).then((data) => {
          localStorage.setItem('access_token', data.user.uid)
          console.log(data.user);
          this.$router.push("/")
        }).catch((error) => {
          switch (error.code) {
            case 'auth/user-not-found':
              alert("User not found")
              break
            case 'auth/wrong-password':
              alert("Wrong password")
              break
            default:
              alert("Something went wrong")
          }
        })
      }

    },
    switchTypeForm() {
      this.register = !this.register
      this.title = this.register ? 'New user' : 'Login'
      this.btnLabel = this.register ? 'Registration' : 'Login'
    },
    switchVisibility() {
      this.visibility = !this.visibility
      this.passwordFieldType = this.visibility ? 'text' : 'password'
      this.visibilityIcon = this.visibility ? 'visibility_off' : 'visibility'
    }
  }
})
</script>

<style lang="scss" scoped>
.form-card-main {
  max-width: 400px;
  min-width: 300px;

  @media (min-width:$breakpoint-xs) {
    min-width: 400px;
  }
}
</style>
