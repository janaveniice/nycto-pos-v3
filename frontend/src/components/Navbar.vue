<template>
  <div class="bg-white border-b shadow-sm px-8 flex flex-row justify-between items-center sticky top-0 z-50">
    <img src="../assets/nycto-logo.png" class="h-8 w-auto"/>
    <nav class="px-6 py-4 flex gap-6">
        <RouterLink
            to="/orders"
            class="text-gray-700 hover:text-pink-300"
            active-class="font-semibold text-pink-300"
        >
            Dashboard
        </RouterLink>

        <RouterLink
            to="/pos"
            class="text-gray-700 hover:text-pink-300"
            active-class="font-semibold text-pink-300"
        >
            POS
        </RouterLink>

        <RouterLink
            to="/admin"
            class="text-gray-700 hover:text-pink-300"
            active-class="font-semibold text-pink-300"
        >
            Admin
        </RouterLink>

        <div class="w-px h-6 bg-gray-300"></div>

        <p @click="logout" class="text-black hover:cursor-pointer">Logout</p>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

async function logout() {
  try {
    await fetch("/.netlify/functions/logout", {
      method: "POST",
      credentials: "include"
    });

    router.push("/");
  } catch (err) {
    console.error("Logout failed", err);
  }
}
</script>