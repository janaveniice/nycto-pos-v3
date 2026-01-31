<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar component -->
    <Navbar />

    <!-- Main page content rendered by Vue Router -->
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<style>
/* optional global App styles */
</style>
