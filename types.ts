
export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH'
}

export interface DataPoint {
  date: string;
  cases: number;
  deaths: number;
  isAnomaly: boolean;
  movingAverage: number;
}

export interface CountryData {
  name: string;
  code: string;
  history: DataPoint[];
}

export interface AIAnalysis {
  riskLevel: RiskLevel;
  confidence: number;
  explanation: string;
  growthRate: number;
  anomaliesCount: number;
  next7DayTrend: 'rising' | 'stable' | 'falling';
}
