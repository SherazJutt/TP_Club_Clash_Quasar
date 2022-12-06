<template>
  <q-layout class="bg-grey-1">
    <q-header reveal elevated class="text-white bg-blue-9" height-hint="61.59">
      <q-toolbar class="q-py-sm q-px-md">
        <q-avatar square size="42px">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-75 -40 120 80">
            <path fill="#fff" d="M-75-40H45v80H-75z" />
            <path fill="#01411C" d="M-45-40h90v80h-90z" />
            <circle r="24" fill="#fff" />
            <circle r="22" cx="-7" cy="-40" fill="#01411C" transform="rotate(-41.634 45 -40)" />
            <path fill="#fff" d="M8.751-17.959l10.11 11.373L3.997-9.844l13.94-6.1-7.692 13.129z" />
          </svg>
        </q-avatar>
        <div
          class="GL__toolbar-link q-ml-xs q-gutter-md text-body2 text-weight-medium row items-center no-wrap full-width justify-center">
          <router-link class="text-white" to="/">Home</router-link>
          <router-link class="text-white" to="/garage">Garage</router-link>
        </div>

        <q-space />

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn dense flat round size="sm" icon="notifications" />
          <q-btn dense flat>
            <div class="row items-center no-wrap">
              <q-icon name="add" size="20px" />
              <q-icon name="arrow_drop_down" size="16px" style="margin-left: -2px" />
            </div>
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable class="GL__menu-link">
                  <q-item-section>New Car</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense flat no-wrap>
            <q-avatar rounded size="20px">
              <img src="https://cdn.quasar.dev/img/avatar3.jpg">
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item class="GL__menu-link-signed-in">
                  <q-item-section>
                    <div>Signed in as <strong>Sheraz</strong></div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GL__menu-link">
                  <q-item-section><router-link class="text-decoration-none rl-profile"
                      to="/profile">Profile</router-link></q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GL__menu-link">
                  <q-item-section @click="logout">Sign out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script setup>
import { auth } from '../firebase'
import { signOut } from "firebase/auth";
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  signOut(auth).then(() => {
    localStorage.removeItem('access_token')
    router.push("/auth")
  }).catch((error) => {
    console.log(error);
  });
}
</script>
<style lang="scss" scoped>
.rl-profile {
  color: black;

  &:hover {
    color: white;
  }
}

.GL {
  &__select-GL__menu-link {
    .default-type {
      visibility: hidden;
    }

    &:hover {
      background: #0366d6;
      color: white;

      .q-item__section--side {
        color: white;
      }

      .default-type {
        visibility: visible;
      }
    }
  }

  &__toolbar-link {
    a {
      color: white;
      text-decoration: none;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  &__menu-link:hover {
    background: #0366d6;
    color: white;
  }

  &__menu-link-signed-in,
  &__menu-link-status {
    &:hover {
      &>div {
        background: white !important;
      }
    }
  }

  &__menu-link-status {
    color: $blue-grey-6;

    &:hover {
      color: $light-blue-9;
    }
  }

  &__toolbar-select.q-field--focused {
    width: 450px !important;

    .q-field__append {
      display: none;
    }
  }
}
</style>
