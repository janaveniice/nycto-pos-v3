<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Background image -->
    <div
      class="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
      style="background-image: url('/backdrop.jpg')"
    ></div>

    <!-- Dark overlay -->
    <div class="fixed top-0 left-0 w-full h-full bg-black/40 z-10"></div>

    <!-- Login content -->
    <div class="relative z-20 flex flex-col items-center justify-center gap-10 min-h-screen">
      <img src="../assets/nycto-inverted.png" class="w-60 h-auto"/>
      <form @submit.prevent="login" class="bg-white/90 px-10 py-10 flex flex-col gap-6 rounded-xl w-2/6 shadow-xl text-black">
        <section class="flex flex-col gap-1">
            <h1 class="text-2xl text-center">Ni hao, fine shyt 😜</h1>
            <p class="text-center text-sm text-gray-400">Let's get you logged in & making the bank!</p>
        </section>
        <section class="w-full flex flex-col gap-2 mt-4">
            <label>Email</label>
            <label class="input bg-white w-full rounded-xl">
                <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"> <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g>
                </svg>
            <input 
                type="email" 
                placeholder="abc@hotmail.com" 
                required 
                v-model="email"
            />
            </label>
        </section>

        <section class="w-full flex flex-col gap-2">
            <label>Password</label>
            <label class="input bg-white w-full rounded-xl">
                <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <g stroke-linejoin="round" troke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g>
                </svg>
                <input
                    type="password"
                    required
                    placeholder="Password"
                    v-model="password"
                />
            </label>
        </section>

        <section v-if="error.length" class="text-red-400 text-sm text-center">{{ error }}. Try again bestie ;)</section>

        <button @click="login" class="w-full text-sm bg-pink-200 text-black py-2 mt-4 rounded-xl hover:bg-pink-300 transition">
          <span v-if="loading"><span class="loading loading-spinner loading-xs"></span></span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function login() {
  loading.value = true;
  error.value = "";

  try {
    const res = await fetch("/.netlify/functions/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      error.value = data.error;
      return;
    }

    router.push("/pos");
  } catch (err) {
    error.value = "Network error";
  } finally {
    loading.value = false;
  }
}
</script>