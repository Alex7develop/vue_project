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
              v-model="networkSettings.ip"
              label="IP"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: string) => !!val || 'IP is required', (val: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(val) || 'Invalid IP format']"
              lazy-rules
            />
            <q-input
              dark
              outlined
              dense
              v-model="networkSettings.userName"
              label="UserName"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: string) => !!val || 'Username is required']"
              lazy-rules
            />
          </div>
          <!-- Правая колонка -->
          <div class="col-12 col-md-6 q-gutter-y-md">
            <q-input
              dark
              outlined
              dense
              v-model.number="networkSettings.port"
              label="Port"
              type="number"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: number) => !!val || 'Port is required', (val: number) => val > 0 && val <= 65535 || 'Port must be between 1 and 65535']"
              lazy-rules
            />
            <q-input
              dark
              outlined
              dense
              v-model="networkSettings.password"
              label="Password"
              type="password"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: string) => !!val || 'Password is required']"
              lazy-rules
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
            :disable="!isOnline"
            style="border-radius: 8px;"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// TODO: Получать начальные значения и статус isOnline извне
const isOnline = ref(true);
const isSavingNetwork = ref(false);

const networkSettings = reactive({
  ip: '',
  port: 1000, // Пример
  userName: '',
  password: '****', // Пример
});

const onSubmitNetwork = () => {
  isSavingNetwork.value = true;
  console.log('Submitting network settings:', networkSettings);
  // TODO: Вызвать API api/conf
  // Эмуляция задержки
  setTimeout(() => {
    isSavingNetwork.value = false;
  }, 1500);
};

// TODO: При статусе OFFLINE все поля и кнопка должны быть disabled
</script>

<style scoped lang="scss">
.settings-card {
  background-color: #1A1D2A; // Цвет фона как у верхней панели
  border-radius: 12px;
}

/* Удаляем стили рамок */
// :deep(.q-field--outlined .q-field__control) {
//   border-radius: 8px;
//   border-color: #6A7085;
// }

// :deep(.q-field--outlined.q-field--highlighted .q-field__control) {
//   border-color: $primary;
// }

/* Стилизация QInput в соответствии с референсом */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #6A7085; // Обновляем цвет рамки
}

:deep(.q-field--outlined.q-field--highlighted .q-field__control) {
  border-color: $primary;
}

:deep(.q-field__label) {
  // Стили для label, если нужно
}

.q-btn {
  padding: 6px 16px;
}

</style> 