export type MeasurementStat = {
  key: string
  label: string
  unit: string
  min: number
  p25: number
  median: number
  p75: number
  max: number
  avg: number
}

export type AirParameterStat = {
  label: string
  unit: string
  min: number
  p25: number
  median: number
  p75: number
  max: number
  avg: number
}

export type AirSeriesPoint = {
  date: string
  overall: number
  pm10: number
  pm25: number
  o3: number
}

export const bodyDataset = {
  rows: 2018,
  measurements: [
    { key: 'height', label: 'Height', unit: 'cm', min: 140.86, p25: 165.41, median: 172.4, p75: 179, max: 197.51, avg: 172.15 },
    { key: 'waist', label: 'Waist', unit: 'cm', min: 64.07, p25: 80.61, median: 88.27, p75: 97.27, max: 164.3, avg: 89.81 },
    { key: 'chest', label: 'Chest', unit: 'cm', min: 77.08, p25: 94.15, median: 101.16, p75: 108.14, max: 153.94, avg: 101.75 },
    { key: 'hip', label: 'Hip', unit: 'cm', min: 80.68, p25: 96.19, median: 101.25, p75: 106.71, max: 166.85, avg: 102.31 },
    { key: 'bicep', label: 'Bicep', unit: 'cm', min: 19.13, p25: 27.75, median: 30.26, p75: 32.69, max: 55.81, avg: 30.4 },
    { key: 'calf', label: 'Calf', unit: 'cm', min: 28.27, p25: 35.07, median: 37.1, p75: 39.24, max: 55.33, avg: 37.29 },
    { key: 'shoulder-breadth', label: 'Shoulder', unit: 'cm', min: 28.63, p25: 33.52, median: 36.27, p75: 37.91, max: 44.32, avg: 35.82 },
  ] satisfies MeasurementStat[],
}

export const airDataset = {
  rows: 4284,
  location: 'Del Norte-2178',
  parameters: {
    pm10: { label: 'PM10', unit: 'ug/m3', min: 2, p25: 9, median: 15, p75: 24, max: 106, avg: 19.49 },
    pm25: { label: 'PM2.5', unit: 'ug/m3', min: 0.8, p25: 2.8, median: 4.3, p75: 7.3, max: 39.9, avg: 5.74 },
    no2: { label: 'NO2', unit: 'ppm', min: 0, p25: 0.01, median: 0.02, p75: 0.04, max: 0.13, avg: 0.03 },
    co: { label: 'CO', unit: 'ppm', min: 0, p25: 0.1, median: 0.2, p75: 0.4, max: 1.1, avg: 0.26 },
    so2: { label: 'SO2', unit: 'ppm', min: 0, p25: 0, median: 0, p75: 0, max: 0, avg: 0 },
    o3: { label: 'O3', unit: 'ppm', min: 0, p25: 0.01, median: 0.02, p75: 0.03, max: 0.05, avg: 0.02 },
  } satisfies Record<string, AirParameterStat>,
  series: [
    { date: '2025-12-01', overall: 2.55, pm10: 10.74, pm25: 2.4, o3: 0.03 },
    { date: '2025-12-02', overall: 3.77, pm10: 13.54, pm25: 5.56, o3: 0.02 },
    { date: '2025-12-03', overall: 2.98, pm10: 13.21, pm25: 4.25, o3: 0.02 },
    { date: '2025-12-04', overall: 1.58, pm10: 6, pm25: 3.27, o3: 0.03 },
    { date: '2025-12-05', overall: 2.7, pm10: 11.38, pm25: 4.57, o3: 0.02 },
    { date: '2025-12-06', overall: 2.4, pm10: 9.79, pm25: 4.12, o3: 0.02 },
    { date: '2025-12-07', overall: 1.48, pm10: 5.96, pm25: 2.15, o3: 0.04 },
    { date: '2025-12-08', overall: 3.35, pm10: 14.88, pm25: 4.58, o3: 0.02 },
    { date: '2025-12-09', overall: 2.33, pm10: 11.32, pm25: 2.81, o3: 0.03 },
    { date: '2025-12-10', overall: 3.55, pm10: 16.75, pm25: 3.68, o3: 0.02 },
    { date: '2025-12-11', overall: 4.37, pm10: 21.96, pm25: 3.87, o3: 0.02 },
    { date: '2025-12-12', overall: 3.5, pm10: 16.5, pm25: 3.92, o3: 0.02 },
    { date: '2025-12-13', overall: 4.35, pm10: 18.92, pm25: 6.04, o3: 0.01 },
    { date: '2025-12-14', overall: 5.43, pm10: 21.96, pm25: 8.07, o3: 0.02 },
  ] satisfies AirSeriesPoint[],
}
