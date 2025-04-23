import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { DeviceStatistics, DeviceHistory, DeviceConfig } from '../types'
import type {
  StatisticResponse,
  HistoryResponse,
  ApiError as ApiErrorType,
} from '../types/api'

// TODO: Вынести базовый URL в переменные окружения (.env)
const API_BASE_URL = 'http://tstai.rasar.keenetic.link'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем интерцептор для логирования запросов
apiClient.interceptors.request.use(request => {
  console.log('Request:', {
    method: request.method,
    url: request.url,
    headers: request.headers
  });
  return request;
});

// Добавляем интерцептор для логирования ответов
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    const errorInfo = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    };
    console.error('API Error:', errorInfo);
    
    // Создаем новый объект Error с информацией об ошибке
    const enhancedError = new Error(
      `API Error: ${errorInfo.message}. Status: ${errorInfo.status}`
    );
    // Сохраняем оригинальную информацию об ошибке
    Object.assign(enhancedError, errorInfo);
    
    return Promise.reject(enhancedError);
  }
);

export interface MetricData {
  avg: number
  min: number
  max: number
}

export interface HistoryMetric {
  unix_time: number
  hashrate: MetricData
  inlet_temp_max: MetricData
  outlet_temp_max: MetricData
  power: MetricData
  fan: MetricData
  water_temp: MetricData
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export const getStatistics = async (): Promise<StatisticResponse> => {
  try {
    const response = await apiClient.get<StatisticResponse>('/api/statistic');
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Можно выбросить кастомную ошибку или вернуть дефолтное состояние
    throw error;
  }
}

export const getHistory = async (): Promise<HistoryResponse> => {
  try {
    const response = await apiClient.get<HistoryResponse>('/api/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}

export const startBlink = async (): Promise<void> => {
  try {
    await apiClient.post('/api/blink/start');
  } catch (error) {
    console.error('Error starting blink:', error);
    throw error;
  }
}

export const stopBlink = async (): Promise<void> => {
  try {
    await apiClient.post('/api/blink/stop');
  } catch (error) {
    console.error('Error stopping blink:', error);
    throw error;
  }
}

// Определяем точный тип для payload, включая password
// Omit<StatisticConf, 'online'>; // Старый вариант
interface ConfigUpdatePayload {
  ip: string; // Предполагаем string, а не number
  port: number;
  user: string;
  password: string;
}

export const updateConfig = async (config: ConfigUpdatePayload): Promise<void> => {
  try {
    await apiClient.post('/api/conf', config);
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
}

// TODO: Уточнить endpoint для перезагрузки
export const rebootDevice = async (): Promise<void> => {
  console.warn('rebootDevice API call is not implemented yet');
  try {
    // await apiClient.post('/api/reboot');
    await new Promise(resolve => setTimeout(resolve, 500)); // Эмуляция
  } catch (error) {
    console.error('Error rebooting device:', error);
    throw error;
  }
}

// TODO: Уточнить endpoint и payload для установки мощности
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const setPower = async (powerValue: number): Promise<void> => {
  console.warn('setPower API call is not implemented yet');
  try {
    // await apiClient.post('/api/power/set', { power: powerValue });
    await new Promise(resolve => setTimeout(resolve, 500)); // Эмуляция
  } catch (error) {
    console.error('Error setting power:', error);
    throw error;
  }
}

export type { DeviceStatistics, DeviceHistory, DeviceConfig }

export default apiClient 

// --- Утилита для обработки ошибок Axios ---
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorType>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return axiosError.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
} 