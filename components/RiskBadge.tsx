
import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const colors = {
    [RiskLevel.LOW]: 'bg-green-500/10 text-green-400 border-green-500/50',
    [RiskLevel.MODERATE]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50',
    [RiskLevel.HIGH]: 'bg-red-500/10 text-red-400 border-red-500/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-lg font-bold',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${colors[level]} ${sizes[size]}`}>
      <span className={`mr-2 h-2 w-2 rounded-full animate-pulse ${level === RiskLevel.HIGH ? 'bg-red-500' : level === RiskLevel.MODERATE ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
      {level} RISK
    </span>
  );
};

export default RiskBadge;
