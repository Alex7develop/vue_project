<template>
  <div class="row q-col-gutter-md">
    <!-- График Hashrate -->
    <div class="col-12 col-md-4">
      <q-card flat class="chart-card text-white">
        <q-card-section>
          <div class="text-subtitle1">Performance</div>
          <div class="text-caption text-grey-6">Average TFLOPS (24h)</div>
          <Line
            v-if="hashrateChartData.labels?.length"
            :data="hashrateChartData"
            :options="hashrateChartOptions"
            class="chart-canvas"
          />
          <div v-else class="chart-placeholder text-center q-pa-md">Loading chart data...</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- График Температуры -->
    <div class="col-12 col-md-4">
      <q-card flat class="chart-card text-white">
        <q-card-section>
          <div class="text-subtitle1">Temperature</div>
          <div class="text-caption text-grey-6">Average Max °C (24h)</div>
          <Line
            v-if="tempChartData.labels?.length"
            :data="tempChartData"
            :options="tempChartOptions"
            class="chart-canvas"
           />
           <div v-else class="chart-placeholder text-center q-pa-md">Loading chart data...</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- График Мощности -->
    <div class="col-12 col-md-4">
      <q-card flat class="chart-card text-white">
        <q-card-section>
          <div class="text-subtitle1">Power Consumption</div>
          <div class="text-caption text-grey-6">Average Watts (24h)</div>
          <Line
            v-if="powerChartData.labels?.length"
            :data="powerChartData"
            :options="powerChartOptions"
            class="chart-canvas"
          />
          <div v-else class="chart-placeholder text-center q-pa-md">Loading chart data...</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useDeviceData } from '../../composables/useDeviceData';
import { formatDate } from '../../utils/formatters';
import type { HistoryMetric } from '../../services/api';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  type ChartData,
  type ChartOptions
} from 'chart.js';

// Регистрация компонентов Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

const { history } = useDeviceData();

// --- Общие функции и опции --- 

const baseChartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
      intersect: false,
      mode: 'index',
  },
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      labels: {
        color: 'white',
        usePointStyle: true,
        boxWidth: 8,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false, // Начинаем не всегда с нуля
      ticks: {
        color: '#8C8C8C',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false,
      }
    },
    x: {
      ticks: {
        color: '#8C8C8C',
        maxRotation: 0, // Предотвращаем поворот меток
        autoSkip: true, // Автопропуск меток для читаемости
        maxTicksLimit: 6 // Ограничиваем кол-во меток по X
      },
      grid: {
        display: false, // Убираем сетку по X
      }
    },
  },
  elements: {
      point: {
          radius: 0, // Убираем точки
          hoverRadius: 5 // Показываем при наведении
      },
      line: {
        tension: 0.3 // Сглаживание линии
      }
  }
}));

// --- Данные и опции для каждого графика --- 

const hashrateChartData = ref<ChartData<'line'>>({ labels: [], datasets: [] });
const tempChartData = ref<ChartData<'line'>>({ labels: [], datasets: [] });
const powerChartData = ref<ChartData<'line'>>({ labels: [], datasets: [] });

// Специфичные опции, наследующие базовые
const hashrateChartOptions = computed<ChartOptions<'line'>>(() => ({ ...baseChartOptions.value }));
const tempChartOptions = computed<ChartOptions<'line'>>(() => ({ ...baseChartOptions.value }));
const powerChartOptions = computed<ChartOptions<'line'>>(() => ({ ...baseChartOptions.value }));

// --- Функция обновления графиков --- 

const updateCharts = () => {
  const metrics = history.value?.metrics;
  if (!metrics?.length) {
    // Очищаем данные, если их нет
    hashrateChartData.value = { labels: [], datasets: [] };
    tempChartData.value = { labels: [], datasets: [] };
    powerChartData.value = { labels: [], datasets: [] };
    return;
  }

  const labels = metrics.map((m: HistoryMetric) => formatDate(m.unix_time * 1000));

  // Hashrate Chart
  hashrateChartData.value = {
    labels,
    datasets: [{
      label: 'TFLOPS',
      data: metrics.map((m: HistoryMetric) => m.hashrate.avg / 1e12), // Конвертируем в TFLOPS
      borderColor: '#00D182',
      backgroundColor: 'rgba(0, 209, 130, 0.1)',
      fill: true,
    }]
  };

  // Temperature Chart
  tempChartData.value = {
    labels,
    datasets: [
      {
        label: 'Temp IN',
        data: metrics.map((m: HistoryMetric) => m.inlet_temp_max.avg),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false, // Не заливаем для второго графика
      },
      {
        label: 'Temp OUT',
        data: metrics.map((m: HistoryMetric) => m.outlet_temp_max.avg),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: false,
      }
    ]
  };

  // Power Chart
  powerChartData.value = {
    labels,
    datasets: [{
      label: 'Watts',
      data: metrics.map((m: HistoryMetric) => m.power.avg),
      borderColor: '#FFCE56',
      backgroundColor: 'rgba(255, 206, 86, 0.1)',
      fill: true,
    }]
  };
};

// --- Наблюдатель и жизненный цикл --- 

// Обновляем графики при изменении данных истории
watch(() => history.value, () => {
  updateCharts();
}, { deep: true, immediate: true }); // immediate: true для первоначальной отрисовки

</script>

<style lang="scss" scoped>
.chart-card {
  background: #1E2139;
  border-radius: 8px;
  height: 100%; // Занимаем всю высоту колонки
  display: flex;
  flex-direction: column;

  .q-card-section {
    flex-grow: 1; // Растягиваем секцию
    display: flex;
    flex-direction: column;
  }

  .text-subtitle1 {
    font-weight: 500;
  }

  .chart-canvas {
     min-height: 250px; // Задаем минимальную высоту
     flex-grow: 1; // Позволяем графику расти
  }

  .chart-placeholder {
      color: #8C8C8C;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 250px; // Такая же минимальная высота, как у графика
      flex-grow: 1;
  }
}
</style> 