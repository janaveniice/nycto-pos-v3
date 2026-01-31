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
            to="/"
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
    </nav>
  </div>
</template>
