<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <q-card flat class="chart-card text-white">
        <q-card-section>
          <div class="text-h6">24 hours</div>
          <div class="text-subtitle2 text-grey-6">TFLOPS</div>

          <div class="q-mt-md">
            <div class="text-caption text-grey-6">Производительность</div>
            <Line v-if="chartData.labels && chartData.datasets" :data="chartData" :options="chartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDeviceData } from '../../composables/useDeviceData'
import { formatDate } from '../../utils/formatters'
import type { HistoryMetric } from '../../services/api'
import { Line } from 'vue-chartjs'
import {
  type ChartData, type ChartOptions
} from 'chart.js'

const { history } = useDeviceData()

const chartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: []
})

const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        color: 'white',
        usePointStyle: true,
        boxWidth: 8
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 35000,
      ticks: {
        stepSize: 7000,
        color: '#8C8C8C',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        // @ts-expect-error - Опция валидна, но типы могут быть неточными
        borderDash: [5, 5],
      }
    },
    x: {
      ticks: {
        color: '#8C8C8C',
      },
      grid: {
        display: false,
      }
    },
  },
})

const historyData = ref([
  { date: '01 Apr', value: 3000 },
  { date: '02 Apr', value: 13000 },
  { date: '03 Apr', value: 9000 },
  { date: '04 Apr', value: 21000 },
  { date: '05 Apr', value: 7000 },
  { date: '06 Apr', value: 7500 },
  { date: '07 Apr', value: 29000 },
  { date: '08 Apr', value: 15000 },
  { date: '09 Apr', value: 23000 },
  { date: '10 Apr', value: 6000 },
  { date: '11 Apr', value: 24000 },
  { date: '12 Apr', value: 20000 },
])

const createCharts = () => {
  if (!history.value?.metrics?.length) return

  const dates = history.value.metrics.map((m: HistoryMetric) => formatDate(m.unix_time * 1000))

  chartData.value.labels = dates
  chartData.value.datasets = [{
    label: 'Average TFLOPS',
    data: history.value.metrics.map((m: HistoryMetric) => m.hashrate.avg / 1000),
    borderColor: '#00FF85',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}

const destroyCharts = () => {
  chartData.value.labels = []
  chartData.value.datasets = []
}

onMounted(() => {
  createCharts()
})

watch(() => history.value, () => {
  destroyCharts()
  createCharts()
}, { deep: true })

onUnmounted(() => {
  destroyCharts()
})

chartData.value = {
  labels: historyData.value.map(item => item.date),
  datasets: [
    {
      label: 'Item',
      borderColor: '#00D182',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(0, 209, 130, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 209, 130, 0)');
        return gradient;
      },
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      data: historyData.value.map(item => item.value),
      fill: true,
      tension: 0.1
    },
  ],
}
</script>

<style lang="scss" scoped>
.chart-card {
  background: #1E2139;
  border-radius: 8px;
  
  .text-h6 {
    color: #FFFFFF;
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 20px;
  }
  
  canvas {
    min-height: 300px;
  }
}

.row {
  margin: 0 -8px;
  
  > div {
    padding: 8px;
  }
}
</style> 