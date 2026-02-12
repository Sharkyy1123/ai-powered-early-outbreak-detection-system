
import { CountryData, DataPoint } from '../types';

const COUNTRIES = [
  { name: 'United States', code: 'US' },
  { name: 'Brazil', code: 'BR' },
  { name: 'India', code: 'IN' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Italy', code: 'IT' },
  { name: 'Spain', code: 'ES' },
  { name: 'Kerala',code:'KL'}
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = ['2020', '2021', '2022'];

export const getAvailableCountries = () => COUNTRIES;
export const getAvailableMonths = () => MONTHS;
export const getAvailableYears = () => YEARS;

/**
 * Simulates a realistic COVID-19 wave pattern based on the Kaggle dataset's characteristics.
 */
const generateHistory = (countryCode: string, monthIndex: number, year: string): DataPoint[] => {
  const points: DataPoint[] = [];
  const daysInMonth = 30;
  const yearInt = parseInt(year);
  const monthStr = (monthIndex + 1).toString().padStart(2, '0');
  
  // Deterministic baseline based on country and year
  // 2020: Slow start, 2021: Delta/Vaccine waves, 2022: Omicron peak
  let baseMagnitude = 500;
  if (year === '2021') baseMagnitude = 5000;
  if (year === '2022') baseMagnitude = 25000;
  
  // Specific wave peaks for realism
  const isWinterPeak = (monthIndex >= 10 || monthIndex <= 1); // Late fall/winter waves
  const isSummerLull = (monthIndex >= 5 && monthIndex <= 7);
  
  let currentBase = baseMagnitude;
  if (isWinterPeak) currentBase *= 3.5;
  if (isSummerLull) currentBase *= 0.4;

  for (let i = 0; i < daysInMonth; i++) {
    // Add some noise and daily fluctuation
    const dailyNoise = 0.8 + (Math.random() * 0.4);
    let dailyCases = Math.floor(currentBase * dailyNoise);
    
    // Simulate an "Anomaly" (Reporting backlog or massive surge)
    let isAnomaly = false;
    if (Math.random() > 0.94) {
      dailyCases *= 2.2;
      isAnomaly = true;
    }

    points.push({
      date: `${year}-${monthStr}-${(i + 1).toString().padStart(2, '0')}`,
      cases: dailyCases,
      deaths: Math.floor(dailyCases * 0.012), // 1.2% mortality rate typical for COVID
      isAnomaly,
      movingAverage: 0
    });
    
    // Gradual trend within the month
    currentBase *= (1 + (Math.random() - 0.48) * 0.05); 
  }

  return points.map((p, idx, arr) => {
    const window = arr.slice(Math.max(0, idx - 6), idx + 1);
    const avg = window.reduce((sum, curr) => sum + curr.cases, 0) / window.length;
    return { ...p, movingAverage: Math.floor(avg) };
  });
};

export const fetchCountryMonthData = (countryCode: string, month: string, year: string): CountryData => {
  const monthIndex = MONTHS.indexOf(month);
  const safeMonthIndex = monthIndex === -1 ? 0 : monthIndex;
  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  
  return {
    name: country.name,
    code: country.code,
    history: generateHistory(country.code, safeMonthIndex, year)
  };
};
