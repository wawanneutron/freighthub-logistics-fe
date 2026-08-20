<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue'
import GlobalSnackbar from './components/common/GlobalSnackbar.vue'
</script>

<template>
  <GlobalSnackbar />
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>
