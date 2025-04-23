import { ref, onMounted, onUnmounted, readonly, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { StatisticResponse, HistoryResponse } from '../types/api'
import {
  getStatistics,
  getHistory,
  getApiErrorMessage
} from '../services/api'

// Интервал обновления в миллисекундах (10 минут)
const POLLING_INTERVAL = 10 * 60 * 1000

// Глобальное состояние, чтобы избежать множественных запросов
// (Можно заменить на Pinia или Vuex для больших приложений)
const statistics = ref<StatisticResponse | null>(null)
const history = ref<HistoryResponse | null>(null)
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const lastUpdated = ref<number | null>(null)

let intervalId: ReturnType<typeof setInterval> | null = null

export function useDeviceData() {
  const $q = useQuasar()

  const fetchData = async () => {
    isLoading.value = true
    error.value = null
    try {
      // Параллельное выполнение запросов
      const [statsData, historyData] = await Promise.all([
        getStatistics(),
        getHistory()
      ])
      statistics.value = statsData
      history.value = historyData
      lastUpdated.value = Date.now()
    } catch (err) {
      const message = getApiErrorMessage(err)
      error.value = message
      // Показываем уведомление об ошибке
      $q.notify({
        color: 'negative',
        message: `Failed to fetch device data: ${message}`,
        icon: 'report_problem'
      })
      // Возможно, стоит сбросить данные в null при ошибке?
      // statistics.value = null;
      // history.value = null;
    } finally {
      isLoading.value = false
    }
  }

  const startPolling = () => {
    // Предотвращаем запуск нескольких интервалов
    if (intervalId) return
    // Запускаем получение данных сразу, ошибки обрабатываются внутри fetchData
    void fetchData() // Используем void для подавления no-floating-promises
    // Устанавливаем интервал
    // Оборачиваем fetchData, чтобы setInterval не получал Promise
    intervalId = setInterval(() => {
      void fetchData() // Используем void и здесь
    }, POLLING_INTERVAL)
  }

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // Запуск поллинга при монтировании компонента, который использует composable
  onMounted(() => {
    startPolling()
  })

  // Остановка поллинга при размонтировании
  onUnmounted(() => {
    stopPolling()
  })

  const isOnline = computed(() => statistics.value?.conf?.online ?? false)

  return {
    // Предоставляем только для чтения, чтобы избежать изменений извне
    statistics: readonly(statistics),
    history: readonly(history),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastUpdated: readonly(lastUpdated),
    isOnline,
    // Функция для ручного обновления, если понадобится
    refreshData: fetchData,
  }
} 