
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Calendar, ArrowRight, Activity, ShieldCheck, Zap, Database } from 'lucide-react';
import { getAvailableCountries, getAvailableMonths, getAvailableYears, fetchCountryMonthData } from '../data/mockData';
import { analyzeOutbreak } from '../services/aiLogic';
import { AIAnalysis, RiskLevel } from '../types';
import RiskBadge from '../components/RiskBadge';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const countries = getAvailableCountries();
  const months = getAvailableMonths();
  const years = getAvailableYears();

  const [selectedCountry, setSelectedCountry] = useState(countries[0].code);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const [previewAnalysis, setPreviewAnalysis] = useState<AIAnalysis | null>(null);

  useEffect(() => {
    const data = fetchCountryMonthData(selectedCountry, selectedMonth, selectedYear);
    const analysis = analyzeOutbreak(data);
    setPreviewAnalysis(analysis);
  }, [selectedCountry, selectedMonth, selectedYear]);

  const handleAnalyze = () => {
    navigate(`/dashboard?country=${selectedCountry}&month=${selectedMonth}&year=${selectedYear}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 animate-health-wave opacity-50"></div>
      
      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-500 mb-4">
            <Database className="w-3 h-3" /> CONNECTED TO COVID-19 GLOBAL DATASET
          </div>
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            EpiWatch <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-slate-400 text-xl font-light">
            Predicting outbreaks through historical global patterns.
          </p>
        </header>

        <main className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="col-span-full">
                <span className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Global Region
                </span>
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </label>

              <label>
                <span className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Month
                </span>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>

              <label>
                <span className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Year
                </span>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            </div>

            <button 
              onClick={handleAnalyze}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-95"
            >
              Analyze Outbreak Wave <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="md:col-span-2 bg-slate-900/30 backdrop-blur-md border border-slate-800/50 rounded-3xl p-8 space-y-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Historical Snapshot</h3>
            
            {previewAnalysis && (
              <div className="space-y-6 w-full">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full"></div>
                  <RiskBadge level={previewAnalysis.riskLevel} size="lg" />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Confidence</span>
                    <span className="text-emerald-400 font-bold">{previewAnalysis.confidence}%</span>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Growth Velocity</span>
                    <span className="text-white font-bold">{previewAnalysis.growthRate}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 w-full flex items-center justify-center gap-4 text-slate-600">
              <ShieldCheck className="w-4 h-4" />
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
