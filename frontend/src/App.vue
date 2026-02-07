<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="!route.meta.hideNavbar" />

    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";

const route = useRoute();
</script>