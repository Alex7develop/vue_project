<template>
  <q-card flat class="settings-card text-white">
    <q-card-section>
      <q-form @submit.prevent="onSubmitPower">
        <div class="row items-center q-col-gutter-md no-wrap">
          <div class="col">
            <q-input
              dark
              outlined
              dense
              v-model="powerSetting"
              label="Power"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="[ (val: string) => !!val || 'Power value is required']"
              lazy-rules
            >
              <template v-slot:append>
                <span class="text-grey-6">W</span>
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn
              unelevated
              color="primary"
              label="Setting"
              type="submit"
              :loading="isSavingPower"
              :disable="!isOnline"
              style="border-radius: 8px;"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// TODO: Получать начальные значения и статус isOnline извне
const isOnline = ref(true);
const isSavingPower = ref(false);
const powerSetting = ref('3600'); // Пример

const onSubmitPower = () => {
  isSavingPower.value = true;
  console.log('Submitting power setting:', powerSetting.value);
  // TODO: Вызвать API для сохранения мощности (какое?)
  // Эмуляция задержки
  setTimeout(() => {
    isSavingPower.value = false;
  }, 1500);
};

// TODO: При статусе OFFLINE поле и кнопка должны быть disabled
</script>

<style scoped lang="scss">
.settings-card {
  background-color: #1A1D2A;
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

.q-btn {
  padding: 6px 16px;
}
</style> 