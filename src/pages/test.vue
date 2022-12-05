<template>
  <div class="q-pa-md">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum dignissimos at ullam neque! Aut, dolore culpa sit
    blanditiis ullam nulla in recusandae magni? Numquam inventore porro, assumenda odio corporis officiis.
  </div>
</template>

<script setup>
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

console.log('yes');

if (user !== null) {
  user.providerData.forEach((profile) => {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });
}
</script>
