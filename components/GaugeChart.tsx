
import React from 'react';

interface GaugeChartProps {
  value: number; // 0 to 100
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v < 33) return '#22c55e';
    if (v < 66) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getColor(value)}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
        <span className="text-3xl font-bold">{value}%</span>
        <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Severity</span>
      </div>
    </div>
  );
};

export default GaugeChart;
