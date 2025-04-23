<template>
  <q-card flat class="settings-card text-white">
    <q-card-section>
      <q-form @submit.prevent="onSubmitNetwork">
        <div class="row q-col-gutter-md">
          <!-- Левая колонка -->
          <div class="col-12 col-md-6 q-gutter-y-md">
            <q-input
              dark
              outlined
              dense
              v-model="ipRef"
              label="IP"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: string) => !!val || 'IP is required', (val: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(val) || 'Invalid IP format']"
              lazy-rules
              :disable="!isOnline"
            />
            <q-input
              dark
              outlined
              dense
              v-model="userRef"
              label="UserName"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: string) => !!val || 'Username is required']"
              lazy-rules
              :disable="!isOnline"
            />
          </div>
          <!-- Правая колонка -->
          <div class="col-12 col-md-6 q-gutter-y-md">
            <q-input
              dark
              outlined
              dense
              v-model.number="portRef"
              label="Port"
              type="number"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: number | null) => !!val || 'Port is required', (val: number | null) => (val && val > 0 && val <= 65535) || 'Port must be between 1 and 65535']"
              lazy-rules
              :disable="!isOnline"
            />
            <q-input
              dark
              outlined
              dense
              v-model="passwordRef"
              label="Password"
              type="password"
              placeholder="Enter new password (if changing)"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: string) => !!val || 'Password is required to save settings']"
              lazy-rules
              :disable="!isOnline"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn
            unelevated
            color="primary"
            label="Setting"
            type="submit"
            :loading="isSavingNetwork"
            :disable="!isOnline || isSavingNetwork"
            style="border-radius: 8px;"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import { useDeviceData } from '../../composables/useDeviceData';
import { updateConfig, getApiErrorMessage } from '../../services/api';

const $q = useQuasar();
const { statistics, isOnline, refreshData } = useDeviceData();

const isSavingNetwork = ref(false);

// Используем локальные ref для полей формы
const ipRef = ref('');
const portRef = ref<number | null>(null);
const userRef = ref('');
const passwordRef = ref(''); // Пароль всегда пустой при загрузке

// Следим за изменениями в statistics и обновляем поля формы
watchEffect(() => {
  if (statistics.value?.conf) {
    ipRef.value = statistics.value.conf.ip || '';
    portRef.value = statistics.value.conf.port || null;
    userRef.value = statistics.value.conf.user || '';
    // passwordRef не инициализируем из statistics.value.conf.password для безопасности
  }
});

const onSubmitNetwork = async () => {
  // Дополнительная проверка, если правила q-form не сработали
  if (!ipRef.value || !portRef.value || !userRef.value || !passwordRef.value) {
    $q.notify({
      color: 'warning',
      message: 'Please fill in all required fields.',
      icon: 'warning'
    });
    return;
  }

  isSavingNetwork.value = true;
  try {
    await updateConfig({
      ip: ipRef.value,
      port: portRef.value,
      user: userRef.value,
      password: passwordRef.value,
    });
    $q.notify({
      color: 'positive',
      message: 'Network settings saved successfully.',
      icon: 'check_circle'
    });
    // Очищаем поле пароля после успешного сохранения
    passwordRef.value = '';
    // Можно обновить данные после сохранения
    await refreshData();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: `Failed to save network settings: ${getApiErrorMessage(error)}`,
      icon: 'error'
    });
  } finally {
    isSavingNetwork.value = false;
  }
};

</script>

<style scoped lang="scss">
.settings-card {
  background-color: #1A1D2A; // Цвет фона как у верхней панели
  border-radius: 12px;
}

/* Стилизация QInput */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #6A7085;
}

:deep(.q-field--outlined.q-field--highlighted .q-field__control) {
  border-color: $primary;
}

.q-btn {
  padding: 6px 16px;
}

</style> 