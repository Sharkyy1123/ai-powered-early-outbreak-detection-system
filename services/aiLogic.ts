
import { CountryData, AIAnalysis, RiskLevel } from '../types';

export const analyzeOutbreak = (data: CountryData): AIAnalysis => {
  const history = data.history;
  if (history.length < 14) {
    return {
      riskLevel: RiskLevel.LOW,
      confidence: 100,
      explanation: "Insufficient data for trend analysis.",
      growthRate: 0,
      anomaliesCount: 0,
      next7DayTrend: 'stable'
    };
  }

  // Calculate Growth Rate: (Last 7 days avg vs Previous 7 days avg)
  const last7Days = history.slice(-7);
  const prev7Days = history.slice(-14, -7);
  
  const lastAvg = last7Days.reduce((a, b) => a + b.cases, 0) / 7;
  const prevAvg = prev7Days.reduce((a, b) => a + b.cases, 0) / 7;
  
  // Prevent division by zero
  const growthRate = prevAvg === 0 ? 0 : ((lastAvg - prevAvg) / prevAvg) * 100;
  
  // Calculate Confidence based on "Noise" (Variance)
  // Higher variance in the daily data leads to lower model confidence
  const mean = last7Days.reduce((a, b) => a + b.cases, 0) / 7;
  const variance = last7Days.reduce((a, b) => a + Math.pow(b.cases - mean, 2), 0) / 7;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / (mean || 1);
  
  // Confidence starts at 95 and drops as coefficient of variation increases
  let confidence = Math.max(65, 98 - (coefficientOfVariation * 40));
  
  const anomaliesCount = history.filter(p => p.isAnomaly).length;
  
  // Composite Risk Score (0-100)
  let riskScore = 0;
  riskScore += Math.min(60, Math.max(0, growthRate * 1.5)); // Growth velocity weight
  riskScore += Math.min(40, anomaliesCount * 8);           // Anomaly density weight
  
  let riskLevel = RiskLevel.LOW;
  if (riskScore > 65) riskLevel = RiskLevel.HIGH;
  else if (riskScore > 35) riskLevel = RiskLevel.MODERATE;
  
  let trend: 'rising' | 'stable' | 'falling' = 'stable';
  if (growthRate > 15) trend = 'rising';
  else if (growthRate < -15) trend = 'falling';

  return {
    riskLevel,
    confidence: Math.round(confidence),
    explanation: `Analysis indicates a ${trend} trend with a ${Math.abs(Math.round(growthRate))}% ${growthRate >= 0 ? 'increase' : 'decrease'} in viral transmission velocity.`,
    growthRate: Math.round(growthRate),
    anomaliesCount,
    next7DayTrend: trend
  };
};
