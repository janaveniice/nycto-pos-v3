<template>
  <div class="flex">
  <!-- Main content -->
    <div class="flex-1 text-black px-4">
      <div v-if="loading" class="flex flex-col items-center justify-center mt-6 gap-4">
          <span class="loading loading-spinner text-error"></span>
          <span class="text-xs">Fetching your data hehe</span>
      </div>

      <div v-else class="text-xs">
        <section class="flex flex-row justify-between items-center">
          <!-- Types -->
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

          <article class="flex flex-row gap-4 items-center">
            <label class="input bg-white rounded-3xl w-80 border border-gray-400">
              <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" placeholder="Search" v-model="searchQuery"/>
            </label>
            <div class="w-px h-6 bg-gray-300"></div>
            <button @click="handleActionClick(null)" class="w-fit text-sm bg-pink-200 text-black py-2 px-4 rounded-2xl hover:bg-pink-300 transition">
              Add item
            </button>
          </article>
        </section>

        <!-- Items -->
         <section class="flex flex-col gap-2 mt-4">
          <h2 class="font-semibold text-base">Items</h2>
          <article
            v-for="(item, idx) in displayedItems"
            :key="item._id"
            class="flex flex-row gap-4 items-center"
          >
            <svg @click="openDelModal(item._id)"xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 hover:cursor-pointer">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <article
              class="w-full border border-gray-300 px-4 py-3 rounded-xl hover:cursor-pointer flex flex-row justify-between items-center"
              @click="handleActionClick(item)"
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
              <article v-if="item.price !== null" class="flex gap-2 text-base">
                <span>${{ item.price }}</span>
                <span v-if="item.price !== item.origPrice" class="line-through">${{ item.origPrice }}</span>
              </article>
              <article v-if="item.price === null && item.fromRange !== null" class="flex gap-2 text-base">
                <span>${{ item.fromRange }} — ${{ item.toRange }}</span>
              </article>
              <article v-if="item.price === null && item.fromRange === null" class="flex gap-2 text-base">
                <span>Custom</span>
              </article>
            </article>
          </article>
          <article v-if="!displayedItems.length">
            No items. I think you searching wrongly.
          </article>
        </section>
      </div>

      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex text-black items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-xl w-2/5 flex flex-col gap-6">
          <article class="flex flex-row justify-between items-center">
            <span v-if="itemToAct.name" class="font-semibold text-lg">Edit item</span>
            <span v-if="!itemToAct.name" class="font-semibold text-lg">Add item</span>
            <svg @click="closeModal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </article>

          <article class="flex flex-col gap-2">
            <label>Type</label>
            <select class="select bg-white border border-gray-400 w-full rounded-xl" v-model="itemToAct.type">
              <option v-for="type in types" :key="type" :value="type.toLowerCase()" :disabled="itemToAct.state === 'new' ? false : true">
                {{ type }}
              </option>
            </select>

          </article>

          <article class="flex flex-col gap-2">
            <label>Name</label>
            <input type="text" v-model="itemToAct.name" class="input rounded-xl bg-white text-black border border-gray-400 w-full"/>
          </article>

          <article class="flex flex-col gap-2">
            <label>Category</label>
            <select
              class="select bg-white border rounded-xl border-gray-400 w-full"
              v-model="itemToAct.category"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </article>

          <section class="grid grid-cols-2 gap-6">
            <article class="flex flex-col gap-2">
              <label>Original Price</label>
              <input type="number" v-model="itemToAct.origPrice" class="input rounded-xl bg-white text-black border border-gray-400 w-full"/>
            </article>
            <article class="flex flex-col gap-2">
              <label>Sale Price</label>
              <input type="number" v-model="itemToAct.price" class="input rounded-xl bg-white text-black border border-gray-400 w-full"/>
            </article>
          </section>

          <section class="grid grid-cols-2 gap-6">
            <article class="flex flex-col gap-2">
              <label>Custom Price (From)</label>
              <input type="number" v-model="itemToAct.fromRange" class="input rounded-xl bg-white text-black border border-gray-400 w-full"/>
            </article>
            <article class="flex flex-col gap-2">
              <label>Custom Price (To)</label>
              <input type="number" v-model="itemToAct.toRange" class="input rounded-xl bg-white text-black border border-gray-400 w-full"/>
            </article>
          </section>

          <button @click="submit" class="w-full mt-4 text-sm bg-pink-200 text-black py-2 px-4 rounded-2xl hover:bg-pink-300 transition">
            <span v-if="itemToAct.state === 'new'">Create new item</span>
            <span v-if="itemToAct.state === 'edit'">Update item</span>
          </button>
        </div>
      </div>

      <div
        v-if="createLoading"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="flex flex-col items-center gap-4">
          <span class="loading loading-spinner text-pink-300"></span>
          <span class="text-sm text-white animate-pulse">Wait ah, I'm updating at the back keke... </span>
        </div>
      </div>

      <div v-if="toastVisible" class="toast toast-top z-100 toast-center">
        <div class="alert alert-info px-2 py-1 bg-pink-100 border-pink-100">
          <span class="text-xs">{{ toastMsg }}</span>
        </div>
      </div>

      <div
        v-if="showDelModal"
        class="fixed inset-0 bg-black/50 flex text-black items-center justify-center z-50"
      >
        <section class="bg-white p-6 rounded-xl w-1/4 flex flex-col gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-12">
            <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <article class="flex flex-col gap-3">
            <h3 class="font-semibold text-2xl">Delete item?</h3>
            <span>I can't undo this for you girlie.</span>
          </article>
          <article class="flex flex-row gap-2">
            <button @click="closeDelModal" class="w-full mt-4 text-sm bg-gray-300 text-black py-2 px-4 rounded-2xl hover:bg-pink-300 transition">
              Cancel
            </button>
            <button @click="deleteItem(idToDel)" class="w-full mt-4 text-sm bg-pink-200 text-black py-2 px-4 rounded-2xl hover:bg-pink-300 transition">
              Delete
            </button>
          </article>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const items = ref([]);
const error = ref('');
const loading = ref(true);
const filteredItems = ref([]);
const selectedType = ref(null);
const types = ref([]);
const searchQuery = ref(""); 
const categoryColorMap = ref({});
const showModal = ref(false);
const itemToAct = ref({});
const createLoading = ref(false);
const toastVisible = ref(false);
const toastMsg = ref('');
const showDelModal = ref(false);
const idToDel = ref('');

const colorMap = ['#FFE5E7', '#D5D1E9', '#D0E4EE', '#F3F5A9', '#F5CF9F', '#ADEBB3'];

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

function getCategoryColor(category) {
  if (!categoryColorMap.value[category]) {
    const index = Object.keys(categoryColorMap.value).length
    categoryColorMap.value[category] =
      colorMap[index % colorMap.length]
  }
  return categoryColorMap.value[category]
}

function selectType(type) {
  selectedType.value = type;

  // Update filteredItems & categories whenever a type is clicked
  filteredItems.value = items.value.filter(
    item => capitalize(item.type) === type
  );
}

const displayedItems = computed(() => {
  if (!searchQuery.value) return filteredItems.value;
  return filteredItems.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function handleActionClick(item) {
  if (item === null) {
    itemToAct.value = {
      state: "new",
      name: "",
      category: "",
      type: "",
      origPrice: null,
      price: null,
      fromRange: "",
      toRange: ""
    }
  } else {
    itemToAct.value = {
      ...item,
      state: "edit"
    }
  }

  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const categories = computed(() => {
  return [
      ...new Set(
        items.value
        .filter(item => item.type === itemToAct.value.type)
        .map(item => item.category)
      )
    ];
});

async function submit() {
  const item = {
    _id: itemToAct.value._id ? itemToAct.value._id : '',
    name: itemToAct.value.name,
    type: itemToAct.value.type,
    category: itemToAct.value.category,
    origPrice: itemToAct.value.origPrice ? itemToAct.value.origPrice : null,
    price: itemToAct.value.price ? itemToAct.value.price : null,
    fromRange: itemToAct.value.fromRange,
    toRange: itemToAct.value.toRange
  };

  try {
    let endpoint = '';
    if (itemToAct.value.state === 'edit') {
      endpoint = '/.netlify/functions/updateItem';
    } else if (itemToAct.value.state === 'new') {
      endpoint = '/.netlify/functions/addItem';
      delete item._id; // Remove _id for new items
    } else {
      throw new Error('Invalid item state');
    }

    createLoading.value = true;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Done")
    } else {
      console.error('Error:', data);
    }
  } catch (err) {
    console.error('Network or submit error:', err);
  } finally {
    showModal.value = false;
    fetchPrices();
    createLoading.value = false;
    toastVisible.value = true;
    toastMsg.value = "It's done successfully yay!";
    toastDisappear();
  }
}

function toastDisappear() {
  setTimeout(() => {
      toastVisible.value = false;
    }, 2000);
}

function openDelModal(id) {
  showDelModal.value = true;
  idToDel.value = id;
}

function closeDelModal() {
  idToDel.value = '';
  showDelModal.value = false
}

async function deleteItem(_id) {
  try {
    createLoading.value = true;
    const response = await fetch("/.netlify/functions/deleteItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Item deleted:", data);
    } else {
      console.error("Error deleting item:", data);
    }
  } catch (err) {
    console.error("Network error:", err);
  } finally {
    idToDel.value = '';
    closeDelModal();
    toastVisible.value = true;
    toastMsg.value = "We deleted her successfully yay!";
    toastDisappear();
    fetchPrices();
    createLoading.value = false;
  }
}
</script>