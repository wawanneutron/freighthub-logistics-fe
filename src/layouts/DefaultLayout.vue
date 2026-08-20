<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const mobileMenuOpen = ref(false);

const navigation = computed(() => [
  { name: 'Orders', href: '/orders', current: route.path === '/orders' },
  { name: 'Track Shipment', href: '/track', current: route.path === '/track' },
]);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-8">
            <router-link to="/" class="flex items-center shrink-0">
              <span class="text-slate-900 font-semibold text-lg tracking-tight">FreightHub</span>
            </router-link>

            <div class="hidden md:flex items-center gap-1">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                :class="[
                  item.current
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                  'rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150'
                ]"
                :aria-current="item.current ? 'page' : undefined"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <button
            @click="toggleMobileMenu"
            class="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <svg v-if="!mobileMenuOpen" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white">
          <div class="space-y-1 px-4 py-3">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              @click="mobileMenuOpen = false"
              :class="[
                item.current
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
              ]"
              :aria-current="item.current ? 'page' : undefined"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </Transition>
    </nav>

    <main>
      <div class="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>
