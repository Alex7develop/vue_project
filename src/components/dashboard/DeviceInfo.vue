<template>
  <q-card flat class="bg-reference-card text-white q-mb-md">
    <q-card-section class="q-pa-sm">
      <div class="row items-center justify-between no-wrap">
        <!-- Левая часть: Лого, Статус и Название -->
        <div class="col-auto row items-center no-wrap q-gutter-sm">
          <!-- Логотип Syndicate -->
          <img src="../../assets/quasar-logo-vertical.svg" alt="Syndicate Logo" style="height: 30px;" class="q-mr-md">

          <div
            class="row items-center no-wrap status-container q-pa-xs q-mr-md"
          >
            <span class="status-dot-ref" :class="isOnline ? 'bg-green' : 'bg-red'"></span>
            <span class="text-body2 text-weight-bold q-ml-sm">{{ deviceStatusText }}</span>
          </div>

          <span class="text-body1 device-name">{{ deviceName }}</span>
        </div>

        <!-- Правая часть: IP, MAC, Locate -->
        <div class="col-auto row items-center no-wrap q-gutter-sm">
           <div class="ip-locate-wrapper row no-wrap items-stretch">
             <div class="ip-mac-block q-pa-sm text-left row items-center no-wrap">
               <span class="q-ml-sm"><span class="text-caption text-grey-7">IP:</span> <span class="text-body2">{{ ipAddress || '-' }}</span></span>
               <span class="q-ml-md"><span class="text-caption text-grey-7">MAC:</span> <span class="text-body2">{{ macAddress || '-' }}</span></span>
             </div>
             <q-btn
               unelevated
               color="primary"
               label="Locate"
               @click="onLocate"
               :loading="isLocating"
               :disable="!isOnline"
               class="locate-button"
             />
           </div>
           <!-- Кнопка Настройки убрана -->
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDeviceData } from '../../composables/useDeviceData';
import { startBlink, getApiErrorMessage } from '../../services/api';

const $q = useQuasar();
const { statistics, isOnline } = useDeviceData();

const isLocating = ref(false);

// Используем данные из composable
const deviceName = computed(() => {
  const model = statistics.value?.model;
  return model ? `${model.board} ${model.type}` : 'Loading...';
});
const ipAddress = computed(() => statistics.value?.network?.address);
const macAddress = computed(() => statistics.value?.network?.macaddr);
const deviceStatusText = computed(() => isOnline.value ? 'ONLINE' : 'OFFLINE');

const onLocate = async () => {
  if (!isOnline.value) return;
  isLocating.value = true;
  try {
    await startBlink();
    $q.notify({
      color: 'positive',
      message: 'Locate signal sent',
      icon: 'location_searching'
    });
    // TODO: Возможно, нужно вызывать stopBlink через некоторое время?
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: `Locate failed: ${getApiErrorMessage(error)}`,
      icon: 'error'
    });
  } finally {
    isLocating.value = false;
  }
};

</script>

<style scoped lang="scss">
.bg-reference-card {
  background-color: #1A1D2A;
  border-radius: 12px;
}

.status-container {
  border-radius: 20px;
  min-width: 90px;
  justify-content: center;
}

.status-dot-ref {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.device-name {
  white-space: nowrap;
}

.ip-mac-block {
  background-color: #0f111a;
}

.text-grey-7 {
  color: $grey-7;
}

.ip-locate-wrapper {
  border: 1px solid #303443;
  border-radius: 8px;
  overflow: hidden;
}

.locate-button {
  padding: 0 20px;
  align-self: stretch;
  border-radius: 0; /* Убираем скругление, т.к. оно в wrapper */
}

// .settings-button {
//   // Стили для круглой кнопки настроек
//   min-width: 40px; // Чтобы кнопка была квадратной до скругления
//   height: 40px;
// }
</style> 