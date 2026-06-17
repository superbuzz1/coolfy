"use client";
import React, { useState, useEffect } from 'react';
import { 
  Database, Link, RefreshCw, CheckCircle, AlertTriangle,
  ArrowRightLeft, Settings, ShieldCheck, Activity, Terminal
} from 'lucide-react';

export default function CRMIntegrationConsole() {
  const [integrations, setIntegrations] = useState<any[]>([
    { provider: 'salesforce', lastSyncAt: new Date().toISOString(), status: 'active', direction: 'bidirectional', records: 42801 },
    { provider: 'hubspot', lastSyncAt: new Date(Date.now() - 3600000).toISOString(), status: 'active', direction: 'inbound', records: 1240 }
  ]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const connect = async (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setIntegrations([...integrations, { 
        provider, 
        lastSyncAt: new Date().toISOString(), 
        status: 'active', 
        direction: 'bidirectional',
        records: 0
      }]);
      setLoading(false);
    }, 1500);
  };

  const disconnect = async (provider: string) => {
    setIntegrations(integrations.filter(i => i.provider !== provider));
  };

  const sync = async (provider: string) => {
    setSyncing(provider);
    setTimeout(() => {
      setIntegrations(integrations.map(i => 
        i.provider === provider ? { ...i, lastSyncAt: new Date().toISOString(), records: i.records + 15 } : i
      ));
      setSyncing(null);
    }, 2000);
  };

  const renderCard = (provider: string, name: string, description: string, color: string) => {
    const integration = integrations.find(i => i.provider === provider);
    const isConnected = !!integration;
    const isSyncing = syncing === provider;

    return (
      <div className={`bg-[#0f172a] border ${isConnected ? `border-${color}-500/30` : 'border-slate-800'} rounded-xl overflow-hidden relative group transition-all duration-300`}>
        {isConnected && (
          <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-500`} />
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${isConnected ? `bg-${color}-500/10 border-${color}-500/20` : 'bg-slate-900 border-slate-800'}`}>
                {provider === 'salesforce' && <Database className={`w-7 h-7 ${isConnected ? `text-${color}-400` : 'text-gray-500'}`} />}
                {provider === 'hubspot' && <Activity className={`w-7 h-7 ${isConnected ? `text-${color}-400` : 'text-gray-500'}`} />}
                {provider === 'pipedrive' && <Terminal className={`w-7 h-7 ${isConnected ? `text-${color}-400` : 'text-gray-500'}`} />}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{name}</h3>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
            {isConnected && (
              <span className={`flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-2 py-1 rounded-md border ${isSyncing ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : `bg-${color}-500/10 text-${color}-400 border-${color}-500/20`}`}>
                {isSyncing ? (
                  <><RefreshCw className="w-3 h-3 animate-spin" /> Syncing</>
                ) : (
                  <><CheckCircle className="w-3 h-3" /> Connected</>
                )}
              </span>
            )}
          </div>

          {isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Last Sync</span>
                  <strong className="text-xs text-gray-300">{new Date(integration.lastSyncAt).toLocaleString()}</strong>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Records Synced</span>
                  <strong className="text-xs text-white">{integration.records.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Sync Direction</span>
                    <strong className="text-xs text-emerald-400 flex items-center gap-1">
                      <ArrowRightLeft className="w-3 h-3" /> Bidirectional
                    </strong>
                  </div>
                  <button className="text-xs bg-slate-800 hover:bg-slate-700 text-gray-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                    <Settings className="w-3 h-3" /> Configure Mappings
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => sync(provider)} 
                  disabled={isSyncing}
                  className={`flex-1 bg-${color}-500 hover:bg-${color}-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> Force Sync
                </button>
                <button 
                  onClick={() => disconnect(provider)} 
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-semibold transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => connect(provider)} 
                disabled={loading} 
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Link className="w-4 h-4" /> OAuth Connect
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-feed relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase font-mono font-bold tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> SOC2 COMPLIANT PIPELINE
              </span>
            </div>
            <h1 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2.5">
              <ArrowRightLeft className="w-6 h-6 text-blue-400" />
              Bidirectional CRM Sync Engine
            </h1>
            <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
              Real-time, conflict-free synchronization between EffectiveBuzz RevOS and your System of Record. 
              Automatically push AI-enriched contacts and pull closed-won pipeline data.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Queue Latency</span>
              <strong className="text-emerald-400 font-mono text-sm">42ms</strong>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Sync Volume (24h)</span>
              <strong className="text-white font-mono text-sm">1.4M events</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderCard('salesforce', 'Salesforce Enterprise', 'Push accounts, opportunities, and sync RevOS AI lead scoring natively into SFDC.', 'blue')}
        {renderCard('hubspot', 'HubSpot CRM', 'Sync contacts, deals, and timeline engagement events bidirectionally.', 'orange')}
        {renderCard('pipedrive', 'Pipedrive', 'Map pipeline stages and sync active deals with custom field schemas.', 'emerald')}
      </div>
      
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-white mb-1">Conflict Resolution Strategy</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            By default, EffectiveBuzz treats your connected CRM as the <strong>Source of Truth</strong>. 
            If a contact's email or phone number is updated simultaneously in both systems, the CRM data will overwrite RevOS data during the next sync cycle. You can modify this per-field in the Configuration Mappings.
          </p>
        </div>
      </div>
    </div>
  );
}
