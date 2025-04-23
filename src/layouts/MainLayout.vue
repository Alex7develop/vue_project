<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark">
    <!-- <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-toolbar-title>
          Syndicate Investing Mining
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.bg-dark {
  background: #1A1D2A;
}
</style>
