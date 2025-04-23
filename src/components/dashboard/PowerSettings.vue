<template>
  <q-card flat class="settings-card text-white">
    <q-card-section>
      <q-form @submit.prevent="onSubmitPower">
        <div class="row items-start q-col-gutter-md no-wrap">
          <div class="col">
            <q-input
              dark
              outlined
              dense
              v-model.number="powerLimitRef"
              label="Power Limit"
              type="number"
              label-color="grey-6"
              :input-style="{ color: 'white' }"
              :rules="powerRules"
              lazy-rules
              :disable="!isOnline"
            >
              <template v-slot:append>
                <span class="text-grey-6">W</span>
              </template>
            </q-input>
            <div v-if="powerRangeInfo" class="text-caption text-grey-6 q-mt-xs">
              {{ powerRangeInfo }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              unelevated
              color="primary"
              label="Setting"
              type="submit"
              :loading="isSavingPower"
              :disable="!isOnline || isSavingPower"
              style="border-radius: 8px;"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useDeviceData } from '../../composables/useDeviceData';
import { setPower, getApiErrorMessage } from '../../services/api';
import type { ValidationRule } from 'quasar';

const $q = useQuasar();
const { statistics, isOnline } = useDeviceData();

const isSavingPower = ref(false);
const powerLimitRef = ref<number | null>(null);

const powerRange = computed(() => statistics.value?.power_range);

const powerRangeInfo = computed(() => {
  if (!powerRange.value) return '';
  return `Allowed range: ${powerRange.value.from} - ${powerRange.value.to} W, step: ${powerRange.value.step} W`;
});

const powerRules = computed<ValidationRule<number>[]>(() => {
  const rules: ValidationRule<number>[] = [
    (val: number | null) => val !== null && val !== undefined || 'Power limit is required'
  ];
  if (powerRange.value) {
    const { from, to, step } = powerRange.value;
    rules.push((val: number) => (val >= from && val <= to) || `Value must be between ${from} and ${to}`);
    rules.push((val: number) => ((val - from) % step === 0) || `Value must be a multiple of ${step} starting from ${from}`);
  }
  return rules;
});

const onSubmitPower = async () => {
  if (powerLimitRef.value === null) {
     $q.notify({
        color: 'warning',
        message: 'Please enter a power limit value.',
        icon: 'warning'
      });
    return;
  }
  isSavingPower.value = true;
  console.log('Submitting power setting:', powerLimitRef.value);

  try {
    await setPower(powerLimitRef.value);
    $q.notify({
      color: 'positive',
      message: 'Power limit setting request sent (API is a stub).',
      icon: 'check_circle'
    });
  } catch (error) {
     $q.notify({
      color: 'negative',
      message: `Failed to set power limit: ${getApiErrorMessage(error)} (API is a stub)`,
      icon: 'error'
    });
  } finally {
    isSavingPower.value = false;
  }
};

</script>

<style scoped lang="scss">
.settings-card {
  background-color: #1A1D2A;
  border-radius: 12px;
}

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