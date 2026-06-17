"use client";
import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Activity, Target, Brain, 
  Zap, AlertTriangle, Users, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, Line, ComposedChart
} from 'recharts';

type TabId = 'overview' | 'deals' | 'ai-model';

export default function PipelineForecastingDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const [pipelineData] = useState([
    { month: 'Jul', actual: 42000, forecast: 45000, bestCase: 55000, probability: 100 },
    { month: 'Aug', actual: 51000, forecast: 55000, bestCase: 65000, probability: 100 },
    { month: 'Sep', actual: 65000, forecast: 68000, bestCase: 80000, probability: 100 },
    { month: 'Oct', actual: 25000, forecast: 85000, bestCase: 100000, probability: 85 },
    { month: 'Nov', actual: 0, forecast: 110000, bestCase: 130000, probability: 65 },
    { month: 'Dec', actual: 0, forecast: 140000, bestCase: 170000, probability: 45 },
  ]);

  const topDeals = [
    { company: 'Acme Corp', amount: 45000, stage: 'Negotiation', aiScore: 92, owner: 'Sophia', sentiment: 'High Intent' },
    { company: 'Stark Industries', amount: 120000, stage: 'Proposal Sent', aiScore: 84, owner: 'Marcus', sentiment: 'Positive' },
    { company: 'Wayne Enterprises', amount: 85000, stage: 'Discovery', aiScore: 61, owner: 'Ethan', sentiment: 'Neutral' },
    { company: 'Cyberdyne Systems', amount: 210000, stage: 'Verbal Agreement', aiScore: 98, owner: 'Sophia', sentiment: 'Closing' },
    { company: 'Globex', amount: 18000, stage: 'Qualified', aiScore: 45, owner: 'Marcus', sentiment: 'At Risk' },
  ];

  return (
    <div className="space-y-6 animate-feed relative">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase font-mono font-bold tracking-wider flex items-center gap-1">
                <Brain className="w-3 h-3" /> ML PREDICTIVE ENGINE
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase font-mono font-bold tracking-wider">
                92.4% Accuracy
              </span>
            </div>
            <h1 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2.5">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              Pipeline Forecasting & AI Revenue Analytics
            </h1>
            <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
              Machine learning models analyze historical win rates, email sentiment, and CRM velocity to generate hyper-accurate revenue projections. No more guessing.
            </p>
          </div>
          
          <div className="flex gap-2 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'deals', label: 'Active Deals' },
              { id: 'ai-model', label: 'ML Insights' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-feed">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
              <div className="text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Total Pipeline (Open)
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">$845,000</div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-emerald-400 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +12.4%
                </span>
                <span className="text-[10px] text-gray-500 font-mono">vs last quarter</span>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
              <div className="text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" /> AI Forecast (Closed Won)
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">$335,000</div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-purple-400 flex items-center bg-purple-500/10 px-1.5 py-0.5 rounded font-mono">
                  Confidence: 87%
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Model: XGBoost</span>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
              <div className="text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Deal Velocity
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">18.4 Days</div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-emerald-400 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                  <ArrowDownRight className="w-3 h-3 mr-1" /> -2.1 days
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Faster sales cycle</span>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
              <div className="text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" /> Sentiment Win Rate
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">34.2%</div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-amber-400 flex items-center bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
                  High Engagement
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Based on email replies</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Revenue Trajectory Forecast</h3>
                <p className="text-xs text-gray-500 mt-1">Projecting end-of-year ARR based on current pipeline momentum.</p>
              </div>
              <div className="flex gap-4 text-[10px] font-mono font-bold uppercase">
                <span className="flex items-center gap-1.5 text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Actual</span>
                <span className="flex items-center gap-1.5 text-indigo-400"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> AI Forecast</span>
                <span className="flex items-center gap-1.5 text-purple-400"><div className="w-2 h-2 rounded-full bg-purple-400"></div> Best Case</span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace'}} tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                    />
                    <Area type="monotone" dataKey="actual" fill="url(#colorActual)" stroke="none" />
                    <Area type="monotone" dataKey="forecast" fill="url(#colorForecast)" stroke="none" />
                    <Line type="monotone" dataKey="actual" name="Actual Won" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="bestCase" name="Best Case" stroke="#a855f7" strokeWidth={2} strokeDasharray="2 2" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-slate-900/20 animate-pulse rounded-xl" />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl shadow-xl overflow-hidden animate-feed">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">High-Priority Active Deals</h3>
              <p className="text-xs text-gray-500 mt-1">AI has flagged these opportunities based on positive sentiment signals.</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-mono font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors shadow-lg shadow-indigo-500/20">
              Sync from CRM
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0b1120] text-xs uppercase font-mono text-gray-500 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Pipeline Stage</th>
                  <th className="px-5 py-3 font-semibold">AI Sentiment</th>
                  <th className="px-5 py-3 font-semibold">Propensity Score</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {topDeals.map((deal, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-4 font-medium text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        {deal.company.charAt(0)}
                      </div>
                      {deal.company}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                      ${deal.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-slate-800 text-gray-300 px-2 py-1 rounded-md border border-slate-700">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-md border font-medium ${
                        deal.sentiment === 'Closing' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        deal.sentiment === 'High Intent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        deal.sentiment === 'Positive' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        deal.sentiment === 'At Risk' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-slate-800 text-gray-400 border-slate-700'
                      }`}>
                        {deal.sentiment}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                          <div 
                            className={`h-full rounded-full ${deal.aiScore > 80 ? 'bg-emerald-400' : deal.aiScore > 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                            style={{ width: `${deal.aiScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-300">{deal.aiScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        {deal.owner}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Deal →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ai-model' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-feed">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> Model Feature Importance
              </h3>
              <p className="text-xs text-gray-400 mb-6">These are the primary variables the AI utilizes to determine if a deal will close won.</p>
              
              <div className="space-y-4">
                {[
                  { feature: 'Email Reply Sentiment', weight: 84, color: 'bg-emerald-400' },
                  { feature: 'Days in Current Stage', weight: 72, color: 'bg-indigo-400' },
                  { feature: 'Decision Maker Engagement', weight: 65, color: 'bg-purple-400' },
                  { feature: 'Pricing Page Visits', weight: 48, color: 'bg-blue-400' },
                  { feature: 'Historical Rep Win Rate', weight: 31, color: 'bg-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-300">{item.feature}</span>
                      <span className="text-gray-500 font-bold">{item.weight}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-xl">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">AI Recommendation</h4>
                  <p className="text-sm text-indigo-200 leading-relaxed">
                    Based on current pipeline velocity, we recommend initiating a targeted <strong>Q4 closing promotion</strong> specifically for deals in the &quot;Negotiation&quot; stage. This has a 78% probability of accelerating $240k in revenue into this quarter.
                  </p>
                  <button className="mt-3 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                    Generate Campaign Automation
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-4 border-b border-slate-800 pb-2">
                Data Sources Sync
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Salesforce API
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Synced 2m ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    HubSpot CRM
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Synced 5m ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Email Gateway
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 rounded font-mono">Live</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Risk Factors
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300">
                  <strong className="block font-bold text-rose-400 mb-0.5 font-mono">Stalled Deals</strong>
                  4 deals over $50k have been in &quot;Discovery&quot; for &gt;30 days.
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300">
                  <strong className="block font-bold text-amber-400 mb-0.5 font-mono">Champion Left</strong>
                  Key contact at Globex recently changed LinkedIn title to &quot;Looking for work&quot;.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
