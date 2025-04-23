<template>
  <q-btn
    unelevated
    color="primary"
    label="Reboot"
    icon="restart_alt"
    @click="confirmReboot"
    :loading="isRebooting"
    :disable="!isOnline"
    class="reboot-button"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const isOnline = ref(true);
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
    handleReboot();
  });
};

const handleReboot = () => {
  isRebooting.value = true;
  console.log('Rebooting device...');
  setTimeout(() => {
    isRebooting.value = false;
    $q.notify({
        color: 'info',
        message: 'Device reboot initiated.',
        icon: 'info'
      })
  }, 2000);
};
</script>

<style scoped lang="scss">
.reboot-button {
  border-radius: 8px;
  padding: 10px 16px;
}
</style> 