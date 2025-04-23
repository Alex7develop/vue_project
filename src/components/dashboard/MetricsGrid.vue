<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="metric in metrics"
      :key="metric.title"
      class="col-12 col-sm-6 col-md-4 col-lg"
      style="flex-basis: 20%; min-width: 180px;"
    >
      <metric-card
        :title="metric.title"
        :value="metric.value"
        :unit="metric.unit"
        :description="metric.description"
        :icon="metric.icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MetricCard from './MetricCard.vue';
import { useDeviceData } from '../../composables/useDeviceData';
import { formatUptime } from '../../utils/formatters'; // Импортируем созданную утилиту

const { statistics } = useDeviceData();

// Формируем массив метрик на основе данных из statistics
const metrics = computed(() => {
  if (!statistics.value) {
    // Возвращаем заглушки, если данных нет
    // Можно сделать все значения '-' или null
    const placeholder = (title: string, icon: string, unit = '', description = '') => ({ title, value: '-', unit, description, icon });
    return [
      placeholder('10 sec', 'show_chart', 'TFLOPS', 'Выработка мощности за 10 сек.'),
      placeholder('24 hours', 'show_chart', 'TFLOPS', 'Выработка мощности за 24 часа'),
      placeholder('Power', 'bolt', 'Watts', 'Потребление электричества'),
      placeholder('Uptime', 'access_time', '', 'Время не прерывной работы устройства'),
      placeholder('Fan 1', 'wind_power', '', 'Скорость вращения вентилятора'),
      placeholder('Fan 2', 'wind_power', '', 'Скорость вращения вентилятора'),
      placeholder('Fan 3', 'wind_power', '', 'Скорость вращения вентилятора'),
      placeholder('Fan 4', 'wind_power', '', 'Скорость вращения вентилятора'),
      placeholder('Temp IN', 'thermostat', '°C', 'Температура'),
      placeholder('Temp OUT', 'thermostat', '°C', 'Температура'),
    ];
  }

  const s = statistics.value;
  const fans = s.fan || [];
  const temps = s.temps || { in: null, out: null };

  // Функция для форматирования TFLOPS (предполагаем, что значения в FLOPS)
  const formatTflops = (flops: number | null | undefined) => flops ? (flops / 1e12).toFixed(2) : '-';

  return [
    {
      title: '10 sec',
      value: formatTflops(s.real),
      unit: 'TFLOPS',
      description: 'Выработка мощности за 10 сек.',
      icon: 'show_chart',
    },
    {
      title: '24 hours',
      value: formatTflops(s.avg),
      unit: 'TFLOPS',
      description: 'Выработка мощности за 24 часа',
      icon: 'show_chart',
    },
    {
      title: 'Power',
      value: typeof s.power === 'string' ? parseInt(s.power, 10) : (typeof s.power === 'number' ? s.power : '-'),
      unit: 'Watts',
      description: 'Потребление электричества',
      icon: 'bolt',
    },
    {
      title: 'Uptime',
      value: formatUptime(s.uptime_sys),
      unit: '',
      description: 'Время не прерывной работы устройства',
      icon: 'access_time',
    },
    {
      title: 'Fan 1',
      value: fans[0] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'wind_power',
    },
    {
      title: 'Fan 2',
      value: fans[1] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'wind_power',
    },
    {
      title: 'Fan 3',
      value: fans[2] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'wind_power',
    },
    {
      title: 'Fan 4',
      value: fans[3] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'wind_power',
    },
    {
      title: 'Temp IN',
      value: temps.in ?? '-',
      unit: '°C',
      description: 'Температура',
      icon: 'thermostat',
    },
    {
      title: 'Temp OUT',
      value: temps.out ?? '-',
      unit: '°C',
      description: 'Температура',
      icon: 'thermostat',
    },
  ];
});

</script>

<style scoped lang="scss">
// Стили для самого грида, если нужны
</style> 