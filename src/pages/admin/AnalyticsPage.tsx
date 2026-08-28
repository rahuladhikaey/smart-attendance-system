import React from 'react';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, ShieldCheck, 
  MapPin, QrCode, Fingerprint, Sparkles, CheckCircle2 
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { reportService } from '../../services/reportService';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const summary = reportService.getSummaryMetrics();

  const funnelData = [
    { stage: 'App Open', count: 1248 },
    { stage: 'Location Verified', count: 1206 },
    { stage: 'Live QR Scanned', count: 1182 },
    { stage: 'Biometric Passed', count: 1154 },
    { stage: 'Duplicate Cleared', count: 1108 },
  ];

  const failureBreakdown = [
    { name: 'Location / Geofence', value: 42, color: '#FFFFFF' },
    { name: 'QR Nonce Expired', value: 24, color: '#888888' },
    { name: 'Biometric Anti-Spoof', value: 28, color: '#444444' },
    { name: 'Duplicate Attempts', value: 46, color: '#222222' },
  ];

  const weekdayPerformance = [
    { day: 'Monday', rate: 92.4, late: 4.2 },
    { day: 'Tuesday', rate: 89.1, late: 6.1 },
    { day: 'Wednesday', rate: 94.5, late: 3.0 },
    { day: 'Thursday', rate: 88.2, late: 5.4 },
    { day: 'Friday', rate: 91.8, late: 4.8 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#262626]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Verification Intelligence & Analytics
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Deep behavioral insights, verification funnels, and proxy prevention metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Average Attendance"
          value="91.4%"
          subtitle="Above 75% institutional quota"
          trend={{ value: "+3.4%", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Verification Success"
          value="96.4%"
          subtitle="0.2% false positive rate"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          title="Low Attendance Alert"
          value={summary.lowAttendanceCount}
          subtitle="Students below 75%"
          badge="ACTION"
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <StatCard
          title="Total Check-Ins Analyzed"
          value="14,892"
          subtitle="This academic semester"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
      </div>

      {/* Verification Funnel & Dropoff Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                PIPELINE DROP-OFF
              </span>
              <h3 className="text-base font-semibold text-white">Attendance Verification Funnel</h3>
            </div>
            <span className="text-xs font-mono text-neutral-400">1,248 Total Attempts</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="stage" stroke="#666666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666666" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
                <Bar dataKey="count" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failure Breakdown */}
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              AUDIT BREAKDOWN
            </span>
            <h3 className="text-base font-semibold text-white mt-0.5">Blocked Fraud Reasons</h3>

            <div className="mt-6 space-y-3 font-mono text-xs">
              {failureBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] border border-[#222222]">
                  <span className="text-neutral-300">{item.name}</span>
                  <span className="text-white font-bold">{item.value} blocked</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C1C1C] text-[11px] font-mono text-neutral-500">
            Automated neural anti-spoofing algorithm active.
          </div>
        </div>
      </div>

      {/* AI & Institutional Insights */}
      <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-white" />
          <h3 className="text-sm font-semibold text-white">System Insights & Observations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-neutral-300">
            <span className="text-white font-bold block mb-1">Weekly Growth</span>
            Campus-wide physical attendance increased by <strong className="text-white">3.4%</strong> following the launch of dynamic rolling QR codes in Hall Alpha.
          </div>

          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-neutral-300">
            <span className="text-white font-bold block mb-1">Proxy Elimination</span>
            <strong className="text-white">96.4%</strong> of verification attempts succeeded on the first scan, preventing 140 remote check-in attempts.
          </div>

          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-neutral-300">
            <span className="text-white font-bold block mb-1">Action Required</span>
            <strong className="text-white">{summary.lowAttendanceCount} students</strong> have fallen below the 75% minimum semester attendance quota.
          </div>
        </div>
      </div>
    </div>
  );
};
