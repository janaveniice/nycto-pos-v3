<template>
  <div class="flex">
    <!-- Main content -->
    <div class="flex-1 text-black px-4 pr-80">
      <div v-if="loading" class="flex flex-col items-center justify-center mt-6 gap-4">
          <span class="loading loading-spinner text-error"></span>
          <span class="text-xs">Fetching your data hehe</span>
      </div>

      <div v-else class="text-xs">
        <section class="flex flex-row justify-between items-center">
          <section class="flex flex-col gap-2">
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
        <!-- Search -->
        <label class="input bg-white mt-4 rounded-3xl w-80 border border-gray-400">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" placeholder="Search" v-model="searchQuery"/>
        </label>
        </section>

        <!-- Categories -->
        <section class="flex flex-col gap-2 mt-4">
          <h2 class="font-semibold text-base">Categories</h2>
          <section class="flex gap-2 flex-wrap">
            <article
              v-for="category in categories"
              :key="category"
              @click="selectCat(category)"
              :class="[
                'w-fit rounded-xl px-3 py-1 border border-black hover:cursor-pointer',
                selectedCategory === category ? 'bg-pink-200' : ''
              ]"
            >
              <span>{{ category }}</span>
            </article>
          </section>
        </section>

        <section class="flex flex-col gap-2 mt-4">
          <h2 class="font-semibold text-base">Items</h2>
          <article
            v-for="(item, idx) in displayedItems"
            :key="item._id"
            class="border border-gray-300 px-4 py-3 rounded-xl hover:cursor-pointer flex flex-row justify-between items-center"
            @click="addItem(item)"
          >
            <article class="flex flex-row gap-4 items-center">
              <div class="p-1.5 rounded-lg" :style="{ backgroundColor: getCategoryColor(item.category) }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
              </div>
              <article class="flex flex-col">
                <h3 class="text-base font-semibold">{{ item.name }}</h3>
                <span class="text-xs">{{ item.category }}</span>
              </article>
            </article>
            <article class="flex gap-2 text-base">
              <span>${{ item.price }}</span>
              <span v-if="item.price !== item.origPrice" class="line-through">${{ item.origPrice }}</span>
            </article>
          </article>
        </section>
      </div>
    </div>

    <!-- Fixed right sidebar -->
    <aside class="text-black w-76 h-[calc(100vh-64px)] bg-gray-100 border-l border-gray-300 fixed right-0 top-[3.75rem] p-4 flex flex-col gap-2">

      <section class="flex flex-row gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <h2 class="font-semibold text-base">Order Cart</h2>
      </section>
      
      <section class="mt-2 flex flex-col flex-1">
        <h2 class="font-semibold text-sm">Order Items</h2>
        <span v-if="orderItems.length === 0" class="text-xs mt-3">No items in order.</span>

        <section class="h-58 overflow-y-auto">
          <article v-for="item in orderItems" class="flex flex-row rounded-xl mt-3 justify-between items-center">
            <article class="flex flex-row gap-2 items-center">
              <div class="p-1.5 bg-pink-200 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <span class="text-sm">{{ item.name }}</span>
            </article>

            <article class="flex flex-row gap-2 text-sm items-center">
              <span @click="minusQty(item)" class="text-lg hover:cursor-pointer">-</span>
              <input
                type="number"
                class="input w-9 input-xs bg-white text-black text-center rounded-xl"
                v-model.number="item.qty"
                min="1"
              />
              <span @click="addQty(item)" class="text-lg hover:cursor-pointer">+</span>
            </article>
          </article>
        </section>
      </section>

      <section class="mt-auto flex flex-col gap-3">
        <article class="flex flex-col gap-1">
          <label class="text-xs">Discount ($$)</label>
          <input
            type="number"
            class="input input-sm bg-white text-black rounded-xl"
            v-model.number="discount"
            step="0.01"
            min="0"
          />
        </article>

        <article class="flex flex-col gap-1">
          <label class="text-xs">Payment Method</label>
          <select v-model="paymentMethod" class="select select-sm bg-white text-black rounded-xl">
            <option>PayNow</option>
            <option>Cash</option>
          </select>
        </article>

        <div class="w-full h-px bg-gray-300 my-1"></div>

        <article class="flex flex-row justify-between items-center text-sm">
          <span>Subtotal:</span>
          <span>${{ subtotal }}</span>
        </article>

        <article class="flex flex-row justify-between items-center text-sm -mt-2">
          <span>Discount:</span>
          <span>-${{ discount || 0}}</span>
        </article>

        <article class="flex flex-row justify-between items-center font-semibold text-sm -mt-2">
          <span>Total:</span>
          <span>${{ total || 0}}</span>
        </article>


        <button @click="checkout" class="w-full text-sm bg-pink-200 text-black py-2 rounded-3xl hover:bg-pink-300 transition">
          Checkout
        </button>
      </section>
      
    </aside>

    <div v-if="toastVisible" class="toast toast-top z-100 toast-center">
      <div class="alert alert-info px-2 py-1 bg-pink-100 border-pink-100">
        <span class="text-xs">{{ toastMsg }}</span>
      </div>
    </div>

    <div
  v-if="createLoading"
  class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
>
  <div class="flex flex-col items-center gap-4">
    <span class="loading loading-spinner text-pink-300"></span>
    <span class="text-sm text-white animate-pulse">Wait ah, I'm creating the order... </span>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const items = ref([]);
const types = ref([]);
const orderItems = ref([]);
const selectedType = ref(null);
const loading = ref(true);
const error = ref(null);
const filteredItems = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const categoryColorMap = ref({});
const discount = ref(0);
const searchQuery = ref(""); 
const paymentMethod = ref("PayNow"); 
const toastMsg = ref('');
const toastVisible = ref(false);
const createLoading = ref(false);

const colorMap = ['#FFE5E7', '#D5D1E9', '#D0E4EE', '#F3F5A9', '#F5CF9F'];

async function fetchPrices() {
  try {
    const res = await fetch("/.netlify/functions/getPrices");
    if (!res.ok) throw new Error("Failed to fetch prices");
    items.value = await res.json();

    // Unique types
    const uniqueTypes = [...new Set(items.value.map(item => capitalize(item.type)))];
    types.value = uniqueTypes;

    // Automatically select first type
    if (types.value.length > 0) {
      selectedType.value = types.value[0];

      // Set filteredItems & categories for the first type
      filteredItems.value = items.value.filter(
        item => capitalize(item.type) === selectedType.value
      );

      categories.value = [
        ...new Set(
          filteredItems.value.map(item => capitalize(item.category))
        )
      ];
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPrices);

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function selectType(type) {
  selectedType.value = type;

  // Update filteredItems & categories whenever a type is clicked
  filteredItems.value = items.value.filter(
    item => capitalize(item.type) === type
  );

  categories.value = [
    ...new Set(
      filteredItems.value.map(item => capitalize(item.category))
    )
  ];
}

function selectCat(category) {
  if (selectedCategory.value === category) {
    // Unclick: reset to all items of selected type
    selectedCategory.value = null;
    filteredItems.value = items.value.filter(
      item => capitalize(item.type) === selectedType.value
    );
  } else {
    // Select category: filter items by both type & category
    selectedCategory.value = category;
    filteredItems.value = items.value.filter(
      item =>
        capitalize(item.type) === selectedType.value &&
        capitalize(item.category) === category
    );
  }
}

function getCategoryColor(category) {
  if (!categoryColorMap.value[category]) {
    const index = Object.keys(categoryColorMap.value).length
    categoryColorMap.value[category] =
      colorMap[index % colorMap.length]
  }
  return categoryColorMap.value[category]
}

function addItem(item) {
  const existing = orderItems.value.find(i => i._id === item._id)

  if (existing) {
    existing.qty += 1
  } else {
    orderItems.value.push({
      ...item,
      qty: 1
    })
  }
}

function addQty(item) {
  item.qty += 1
}

function minusQty(item) {
  if (item.qty > 1) {
    item.qty -= 1
  } else {
    // optional: remove item when qty hits 0
    orderItems.value = orderItems.value.filter(i => i._id !== item._id)
  }
}

const subtotal = computed(() =>
  orderItems.value.reduce((sum, i) => sum + i.price * i.qty, 0)
)

const total = computed(() => subtotal.value - discount.value)

const displayedItems = computed(() => {
  if (!searchQuery.value) return filteredItems.value;
  return filteredItems.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function checkout() {
  if (!orderItems.value.length) {
    alert("No items in the order!");
    return;
  }

  createLoading.value = true;

  const order = {
    items: orderItems.value.map(item => ({
      _id: item._id,
      name: item.name,
      category: item.category,
      price: item.price,
      qty: item.qty,
      origPrice: item.origPrice
    })),
    subtotal: subtotal.value,
    discount: discount.value || 0,
    total: total.value,
    paymentMethod: paymentMethod.value,
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch("/.netlify/functions/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create order");

    orderItems.value = [];
    discount.value = 0;
  } catch (err) {
    toastVisible.value = true;
    toastMsg.value = "Checkout error. Jana fked up somewhr...";
    toastDisappear();
  } finally {
    createLoading.value = false;
    toastVisible.value = true;
    toastMsg.value = "Order created successfully yay!";
    toastDisappear();
  }
}

function toastDisappear() {
  setTimeout(() => {
      toastVisible.value = false;
    }, 2000);
}
</script>