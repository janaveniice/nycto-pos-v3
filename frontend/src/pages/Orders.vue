<template>
  <div class="flex">
  <!-- Main content -->
    <div class="flex-1 text-black px-4">
      <div v-if="loading" class="flex flex-col items-center justify-center mt-6 gap-4">
          <span class="loading loading-spinner text-error"></span>
          <span class="text-xs">Fetching your data hehe</span>
      </div>

      <div v-else class="text-xs">
        <h1 class="font-semibold text-2xl">Dashboard</h1>

        <!-- Types -->
        <section class="flex flex-col mt-4 gap-2">
          <h2 class="font-semibold text-base">Types</h2>
          <section class="flex gap-2 flex-wrap">
            <article
              v-for="type in types"
              :key="type"
              @click="selectType(type)"
              :class="[
                'w-fit rounded-xl px-3 py-1 border border-black hover:cursor-pointer',
                selectedType === type ? 'bg-pink-200' : ''
              ]"
            >
              <span>{{ type }}</span>
            </article>
          </section>
        </section>
        
        <!-- Filters -->
        <section class="flex flex-row gap-4 mt-6 items-center">
          <span>Filters</span>
          <div class="w-px h-5 bg-gray-300"></div>
          <select v-if="selectedType === 'Daily'" class="select select-xs bg-white rounded-xl border border-gray-400" v-model="selectedDay">
            <option v-for="d in uniqueDays" :key="d.value" :value="d.value">
              {{ d.label }}
            </option>
          </select>
          <select v-if="selectedType === 'Monthly'" class="select select-xs bg-white rounded-xl border border-gray-400" v-model="selectedMonth">
            <option v-for="m in uniqueMonths" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </section>

        <!-- Overview -->
        <section class="flex flex-col mt-6 gap-3">
          <h3 v-if="selectedType === 'Daily'" class="text-xl font-semibold">Daily Overview</h3>
          <h3 v-if="selectedType === 'Monthly'" class="text-xl font-semibold">Daily Overview</h3>
          <section class="flex flex-row gap-6 items-center">
            <!-- Total Sales -->
            <article class="flex w-full flex-row gap-4 items-center bg-pink-100 px-6 py-4 rounded-xl">
              <div class="bg-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <article class="flex flex-col gap-2">
                <span class="font-semibold">Total Sales</span>
                <span v-if="selectedType === 'Daily'">${{ dailyStats?.totalEarnings || 0 }}</span>
                <span v-if="selectedType === 'Monthly'">${{ monthlyStats?.totalEarnings || 0 }}</span>
              </article>
            </article>

            <!-- Total Orders -->
            <article class="flex w-full flex-row gap-4 items-center bg-pink-100 px-6 py-4 rounded-xl">
              <div class="bg-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <article class="flex flex-col gap-2">
                <span class="font-semibold">Total Orders</span>
                <span v-if="selectedType === 'Daily'">{{ dailyStats?.totalOrders || 0 }}</span>
                <span v-if="selectedType === 'Monthly'">{{ monthlyStats?.totalOrders || 0 }}</span>
              </article>
            </article>
            <!-- PayNow -->
            <article class="flex w-full flex-row gap-4 items-center bg-pink-100 px-6 py-4 rounded-xl">
              <div class="bg-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              </div>
              <article class="flex flex-col gap-2">
                <span class="font-semibold">PayNow Transactions</span>
                <span v-if="selectedType === 'Daily'">${{ dailyStats?.payNowTotal || 0 }}</span>
                <span v-if="selectedType === 'Monthly'">${{ monthlyStats?.payNowTotal || 0 }}</span>
              </article>
            </article>

            <!-- Cash -->
            <article class="flex w-full flex-row gap-4 items-center bg-pink-100 px-6 py-4 rounded-xl">
              <div class="bg-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <article class="flex flex-col gap-2">
                <span class="font-semibold">Cash Transactions</span>
                <span v-if="selectedType === 'Daily'">${{ dailyStats?.cashTotal || 0 }}</span>
                <span v-if="selectedType === 'Monthly'">${{ monthlyStats?.cashTotal || 0 }}</span>
              </article>
            </article>
          </section>
        </section>

        <!-- Order History -->
        <h3 class="text-xl font-semibold mt-6 mb-3">Order History</h3>
        <div class="space-y-4">
          <div
            v-for="(order, index) in displayedOrders"
            :key="order._id"
            class="border border-gray-300 rounded-xl overflow-hidden"
          >
            <!-- Header -->
            <button
              @click="toggle(index)"
              class="w-full flex justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200"
            >
              <article class="flex flex-col space-4">
                <span class="font-medium">
                  Order #{{ order._id }}
                </span>
              </article>
              <!-- Arrow icon -->
              <svg
                :class="{'rotate-180': isOpen(index)}"
                class="w-5 h-5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Collapsible content -->
            <div v-show="isOpen(index)" class="px-4 py-3 bg-white flex flex-col gap-2">
              <p><strong>Date/ Time:</strong> {{ formatTime(order.timestamp) }}</p>
              <p><strong>Payment Method:</strong> {{ order.paymentMethod }}</p>

              <!-- Items table -->
              <table class="w-full mt-2 text-left text-sm border-collapse">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="py-1 px-2">Name</th>
                    <th class="py-1 px-2">Category</th>
                    <th class="py-1 px-2">Qty</th>
                    <th class="py-1 px-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item._id" class="border-b border-gray-100">
                    <td class="py-1 px-2">{{ item.name }}</td>
                    <td class="py-1 px-2">{{ item.category }}</td>
                    <td class="py-1 px-2">{{ item.qty }}</td>
                    <td class="py-1 px-2">${{ item.price }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2 font-semibold">Subtotal</td>
                    <td class="py-1 px-2 font-semibold">-</td>
                    <td class="py-1 px-2 font-semibold">-</td>
                    <td class="py-1 px-2 font-semibold">${{ order.subtotal }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2 font-semibold">Discount</td>
                    <td class="py-1 px-2 font-semibold">-</td>
                    <td class="py-1 px-2 font-semibold">-</td>
                    <td class="py-1 px-2 font-semibold">-${{ order.discount }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2 font-semibold">Total</td>
                    <td class="py-1 px-2 font-semibold">-</td>
                    <td class="py-1 px-2 font-semibold">-</td>
                    <td class="py-1 px-2 font-semibold">${{ order.total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p v-if="!displayedOrders.length" class="text-xs mt-3">No orders yet! Gotta convince the girlie pops to get their nails done!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const orders = ref([]);
const error = ref('');
const loading = ref(true);
const selectedMonth = ref('');
const types = ref(["Daily", "Monthly"]);
const selectedType = ref('Daily');
const selectedDay = ref('');
const openIndexes = ref([]);

async function fetchPrices() {
  try {
    const res = await fetch("/.netlify/functions/getOrders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    orders.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPrices);

const uniqueMonths = computed(() => {
  const map = new Map();

  orders.value.forEach(o => {
    const d = new Date(o.timestamp);

    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });

    map.set(value, { label, value });
  });

  return [...map.values()].sort((a, b) =>
    b.value.localeCompare(a.value)
  );
});

watch(uniqueMonths, (months) => {
  if (months.length > 0) {
    selectedMonth.value = months[0].value; // latest month
  }
}, { immediate: true });

const uniqueDays = computed(() => {
  const map = new Map();

  orders.value.forEach(o => {
    const d = new Date(o.timestamp);

    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    map.set(value, { label, value });
  });

  // Latest day first
  return [...map.values()].sort((a, b) =>
    b.value.localeCompare(a.value)
  );
});

watch(uniqueDays, (days) => {
  if (days.length > 0) {
    selectedDay.value = days[0].value;
  }
}, { immediate: true });

function isSameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth();
}

const dailyStats = computed(() => {
  if (!selectedDay.value) return {
    totalOrders: 0,
    totalEarnings: 0,
    payNowTotal: 0,
    cashTotal: 0
  };

  const todayStr = selectedDay.value; // e.g. "2025-02-07"

  const todayOrders = orders.value.filter(o => {
    const orderDateStr = o.timestamp.slice(0, 10); // "YYYY-MM-DD"
    return orderDateStr === todayStr;
  });

  return {
    totalOrders: todayOrders.length,
    totalEarnings: todayOrders.reduce((sum, o) => sum + o.total, 0),
    payNowTotal: todayOrders
      .filter(o => o.paymentMethod === "PayNow")
      .reduce((sum, o) => sum + o.total, 0),
    cashTotal: todayOrders
      .filter(o => o.paymentMethod === "Cash")
      .reduce((sum, o) => sum + o.total, 0),
  };
});

const monthlyStats = computed(() => {
  if (!selectedMonth.value) return null;

  const [year, month] = selectedMonth.value.split("-").map(Number);

  const monthOrders = orders.value.filter(o => {
    const d = new Date(o.timestamp);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  return {
    totalOrders: monthOrders.length,
    totalEarnings: monthOrders.reduce((sum, o) => sum + o.total, 0),
    payNowTotal: monthOrders
      .filter(o => o.paymentMethod === "PayNow")
      .reduce((sum, o) => sum + o.total, 0),
    cashTotal: monthOrders
      .filter(o => o.paymentMethod === "Cash")
      .reduce((sum, o) => sum + o.total, 0),
  };
});

function selectType(type) {
  selectedType.value = type;  
}

const displayedOrders = computed(() => {
  if (!orders.value || orders.value.length === 0) return [];

  if (selectedType.value === "Daily") {
    if (!selectedDay.value) return [];

    // Compare YYYY-MM-DD strings
    return orders.value.filter(o => o.timestamp.slice(0, 10) === selectedDay.value);
  }

  if (selectedType.value === "Monthly") {
    if (!selectedMonth.value) return [];

    // Compare YYYY-MM strings
    return orders.value.filter(o => o.timestamp.slice(0, 7) === selectedMonth.value);
  }

  return [];
});

function toggle(index) {
  if (openIndexes.value.includes(index)) {
    openIndexes.value = openIndexes.value.filter(i => i !== index);
  } else {
    openIndexes.value.push(index);
  }
}

function isOpen(index) {
  return openIndexes.value.includes(index);
}

function formatTime(isoString) {
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false 
  };

  return date.toLocaleString("en-US", options);
}

</script>