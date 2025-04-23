<template>
  <q-btn
    unelevated
    color="primary"
    label="Reboot"
    icon="restart_alt"
    @click="confirmReboot"
    :loading="isRebooting"
    :disable="!isOnline || isRebooting"
    class="reboot-button"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDeviceData } from '../../composables/useDeviceData';
import { rebootDevice, getApiErrorMessage } from '../../services/api';

const $q = useQuasar();
const { isOnline } = useDeviceData();

const isRebooting = ref(false);

const confirmReboot = () => {
  if (!isOnline.value) return;

  $q.dialog({
    title: 'Confirm',
    message: 'Do you really want to restart the device?',
    persistent: true,
    ok: {
      label: 'Yes',
      color: 'primary',
      unelevated: true
    },
    cancel: {
      label: 'Cancel',
      color: 'grey',
      flat: true
    },
    class: 'bg-dark text-white',
  }).onOk(() => {
    void handleReboot();
  });
};

const handleReboot = async () => {
  isRebooting.value = true;
  console.log('Rebooting device...');
  try {
    await rebootDevice();
    $q.notify({
        color: 'positive',
        message: 'Device reboot command sent successfully (API is a stub).',
        icon: 'check_circle'
      });
  } catch (error) {
    $q.notify({
        color: 'negative',
        message: `Failed to send reboot command: ${getApiErrorMessage(error)} (API is a stub)`,
        icon: 'error'
      });
  } finally {
    setTimeout(() => {
       isRebooting.value = false;
    }, 500);
  }
};
</script>

<style scoped lang="scss">
.reboot-button {
  border-radius: 8px;
  padding: 10px 16px;
}
</style> 