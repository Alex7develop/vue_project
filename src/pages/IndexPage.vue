<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Статус и информация об устройстве -->
      <div class="col-12">
        <device-info />
      </div>

      <!-- Блок с метриками -->
      <div class="col-12 q-mb-md">
        <metrics-grid />
      </div>

      <!-- Блоки настроек и кнопка Reboot (как на втором скриншоте) -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <!-- Блок настроек сети -->
          <div class="col-12 col-md-6">
            <network-settings />
          </div>
          <!-- Блок настроек питания и кнопка Reboot -->
          <div class="col-12 col-md-6">
            <power-settings />
            <div class="q-mt-md text-right">
              <reboot-button />
            </div>
          </div>
        </div>
      </div>

      <!-- Графики -->
      <div class="col-12 q-mt-md">
        <charts-section />
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import DeviceInfo from 'components/dashboard/DeviceInfo.vue'
import MetricsGrid from 'components/dashboard/MetricsGrid.vue'
import RebootButton from 'components/dashboard/RebootButton.vue'
import ChartsSection from 'components/dashboard/ChartsSection.vue'
import NetworkSettings from 'components/dashboard/NetworkSettings.vue'
import PowerSettings from 'components/dashboard/PowerSettings.vue'
</script>

<style lang="scss">
.q-page {
  background: #1a1a1a;
  min-height: 100vh;
}
</style>
