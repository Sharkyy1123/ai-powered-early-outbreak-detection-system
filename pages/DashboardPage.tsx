
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Scatter
} from 'recharts';
import { 
  ArrowLeft, AlertTriangle, Info, TrendingUp, TrendingDown, Clock, 
  Target, BarChart3, BrainCircuit, RefreshCcw, Activity, ShieldAlert, Database, HelpCircle
} from 'lucide-react';
import { fetchCountryMonthData } from '../data/mockData';
import { analyzeOutbreak } from '../services/aiLogic';
import { generateSmartExplanation } from '../services/geminiService';
import { CountryData, AIAnalysis, RiskLevel } from '../types';
import RiskBadge from '../components/RiskBadge';
import GaugeChart from '../components/GaugeChart';

const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const countryCode = searchParams.get('country') || 'US';
  const month = searchParams.get('month') || 'January';
  const year = searchParams.get('year') || '2022';

  const [data, setData] = useState<CountryData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [smartExplanation, setSmartExplanation] = useState<string>('Analyzing epidemiological clusters...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const countryData = fetchCountryMonthData(countryCode, month, year);
      const results = analyzeOutbreak(countryData);
      
      setData(countryData);
      setAnalysis(results);
      
      // Load AI explanation
      const explanation = await generateSmartExplanation(results, countryData);
      setSmartExplanation(explanation);
      setLoading(false);
    };
    
    loadData();
  }, [countryCode, month, year]);

  if (loading || !data || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <RefreshCcw className="w-16 h-16 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          </div>
          <p className="text-slate-400 font-medium tracking-tight">Syncing with COVID-19 Global Intelligence...</p>
        </div>
      </div>
    );
  }

  const totalMonthlyCases = data.history.reduce((sum, d) => sum + d.cases, 0);
  const totalMonthlyDeaths = data.history.reduce((sum, d) => sum + d.deaths, 0);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> New Analysis
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h2 className="text-2xl font-bold text-white">{data.name}</h2>
            <p className="text-slate-500 text-sm font-medium">{month} {year} | COVID-19 Analysis</p>
          </div>
          <RiskBadge level={analysis.riskLevel} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" /> Daily Infection Trajectory
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> New Cases</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Anomaly</span>
              </div>
            </div>
            
            <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickFormatter={(val) => val.split('-')[2]}
                  />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#10b981', fontSize: '12px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="movingAverage" 
                    stroke="#64748b" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    dot={false}
                  />
                  <Scatter 
                    data={data.history.filter(p => p.isAnomaly)} 
                    fill="#ef4444" 
                    shape="circle"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><ShieldAlert className="w-6 h-6" /></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Total Monthly Cases</p>
                <p className="text-2xl font-bold text-white">{totalMonthlyCases.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400"><Activity className="w-6 h-6" /></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Reported Fatalities</p>
                <p className="text-2xl font-bold text-white">{totalMonthlyDeaths.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {analysis.riskLevel === RiskLevel.HIGH ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
              <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-500/40">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-red-400 font-bold text-lg">Epidemiological Alert: Critical Peak</h4>
                <p className="text-red-300/60 text-sm leading-relaxed">System identifies infection doubling rates exceeding safety thresholds. Pattern matches the Omicron-variant surge characteristics seen globally in late 2021.</p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex items-start gap-4">
              <div className="p-3 bg-emerald-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-emerald-400 font-bold text-lg">Post-Peak Stability Detected</h4>
                <p className="text-emerald-300/60 text-sm leading-relaxed">Regional infection data indicates a decline in daily transmission rates. Statistical clusters are dispersed.</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col items-center">
             <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Outbreak Severity Index</h3>
             <GaugeChart value={analysis.riskLevel === RiskLevel.HIGH ? 92 : analysis.riskLevel === RiskLevel.MODERATE ? 54 : 18} />
             <div className="mt-8 grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-800">
                <div className="text-center group relative cursor-help">
                  <div className="text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center justify-center gap-1">
                    AI Confidence <HelpCircle className="w-3 h-3" />
                  </div>
                  <div className="text-emerald-400 font-bold text-xl">{analysis.confidence}%</div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Calculated certainty based on data noise and pattern consistency.
                  </div>
                </div>
                <div className="text-center group relative cursor-help">
                  <div className="text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center justify-center gap-1">
                    Growth Velocity <HelpCircle className="w-3 h-3" />
                  </div>
                  <div className={`font-bold text-xl ${analysis.growthRate > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {analysis.growthRate}%
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    The percentage change in cases comparing current 7-day average to the previous 7-day average.
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" /> Smart Explanation
            </h3>
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed font-medium">
              {smartExplanation}
            </div>
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center px-4 py-3 bg-slate-900 rounded-xl">
                <span className="text-slate-400 text-xs flex items-center gap-2 font-medium"><Clock className="w-4 h-4" /> 7-Day Forecast</span>
                <span className={`flex items-center gap-1 font-bold text-xs ${analysis.next7DayTrend === 'rising' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {analysis.next7DayTrend.toUpperCase()}
                  {analysis.next7DayTrend === 'rising' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-3xl">
             <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase">
               <Database className="w-4 h-4" /> Data Transparency
             </div>
             <p className="text-slate-500 text-[10px] leading-relaxed">
               This intelligence report utilizes historical epidemiological time-series data sourced from the WHO and public repositories. Analysis is generated using unsupervised Isolation Forest algorithms.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
