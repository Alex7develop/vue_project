// src/types/api.ts

// --- /api/statistic Response --- 

export interface StatisticModel {
  board: string;
  type: string;
}

export interface StatisticPowerRange {
  first_id: number;
  from: number;
  to: number;
  step: number;
}

export interface StatisticPowerCurrent {
  rate: string;
  profile: string;
  status: string;
  type: string;
}

export interface StatisticConf {
  ip: string;
  port: number;
  user: string;
  password?: string; // Пароль не всегда приходит?
  online: boolean;
}

export interface StatisticBlinkState {
  is_blinking: boolean;
  blinks_left: number | null;
}

export interface StatisticNetwork {
  address: string;
  macaddr: string;
  netmask: string;
}

export interface StatisticTemps {
  in: number;
  out: number;
  in_values: number[];
  out_values: number[];
}

export interface StatisticResponse {
  model: StatisticModel;
  is_overheat: boolean;
  power_ids: number[] | null; // Уточнено, может быть null
  power_range: StatisticPowerRange;
  power_current: StatisticPowerCurrent;
  conf: StatisticConf;
  blink_state: StatisticBlinkState;
  network: StatisticNetwork;
  uptime_bin: number;
  uptime_sys: number;
  fan: number[];
  bild: string;
  chain_num: number;
  real: number; // TFLOPS за 10 сек?
  avg: number; // TFLOPS за 24 часа?
  pwm: number;
  temps: StatisticTemps;
  miner_status: string;
  power: string; // Текущее потребление W
}

// --- /api/history Response --- 

export interface HistoryMetricValue {
  avg: number;
  min: number;
  max: number;
}

export interface HistoryMetric {
  unix_time: number;
  hashrate: HistoryMetricValue;
  inlet_temp_max: HistoryMetricValue;
  outlet_temp_max: HistoryMetricValue;
  power: HistoryMetricValue;
  fan: HistoryMetricValue;
  water_temp: HistoryMetricValue;
}

export interface HistoryResponse {
  uptime: string; // Это число в виде строки
  ts: string;     // Это число в виде строки
  timezone: string;
  metrics: HistoryMetric[];
}

// --- Error Response --- 
export interface ApiError {
  message: string;
  // другие поля ошибки, если есть
} 