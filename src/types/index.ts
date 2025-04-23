export interface DeviceStatistics {
  model: {
    board: string
    type: string
  }
  real: number
  avg: number
  uptime_sys: number
  fan: number[]
  temps: {
    in: number
    out: number
    in_values: number[]
    out_values: number[]
  }
  temperature: number
  humidity: number
  fans: {
    speed: number
    status: string
  }[]
  power: {
    status: string
    consumption: number
  }
  conf: {
    ip: string
    port: number
    user: string
    password: string
    online: boolean
  }
  network: {
    address: string
    macaddr: string
    netmask: string
  }
}

export interface HistoryMetric {
  unix_time: number
  hashrate: {
    avg: number
    min: number
    max: number
  }
  inlet_temp_max: {
    avg: number
    min: number
    max: number
  }
  outlet_temp_max: {
    avg: number
    min: number
    max: number
  }
  power: {
    avg: number
    min: number
    max: number
  }
  fan: {
    avg: number
    min: number
    max: number
  }
  water_temp: {
    avg: number
    min: number
    max: number
  }
}

export interface DeviceHistory {
  metrics: HistoryMetric[]
}

export interface DeviceConfig {
  ip: string
  port: number
  user: string
  password: string
} 