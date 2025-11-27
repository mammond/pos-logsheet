import React from 'react';
import { LogEntry } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, FileCheck, Clock, Activity } from 'lucide-react';

interface DashboardProps {
  entries: LogEntry[];
}

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const totalEntries = entries.length;
  const enrolledCount = entries.filter(e => e.phicStatus === 'Enrolled').length;
  const reEnrolledCount = entries.filter(e => e.phicStatus === 'Re-enrolled').length;
  
  const ipCount = entries.filter(e => e.typeOfEntry === 'IP').length;
  const opCount = entries.filter(e => e.typeOfEntry === 'OP').length;
  const erCount = entries.filter(e => e.typeOfEntry === 'ER').length;

  const withinDay = entries.filter(e => e.timeframe === 'Within the Day').length;
  const within72 = entries.filter(e => e.timeframe === 'Within 72 Hours').length;
  const beyond72 = entries.filter(e => e.timeframe === 'Beyond 72 Hours').length;

  const entryTypeData = [
    { name: 'IP', value: ipCount },
    { name: 'OP', value: opCount },
    { name: 'ER', value: erCount },
  ];

  const timeframeData = [
    { name: 'Within Day', value: withinDay, color: '#22c55e' },
    { name: 'Within 72h', value: within72, color: '#eab308' },
    { name: '> 72h', value: beyond72, color: '#ef4444' },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#f97316'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Entries" value={totalEntries} icon={Users} color="text-blue-600 bg-blue-600" />
        <StatCard title="Enrolled (PHIC)" value={enrolledCount} icon={FileCheck} color="text-green-600 bg-green-600" />
        <StatCard title="Re-enrolled" value={reEnrolledCount} icon={Activity} color="text-purple-600 bg-purple-600" />
        <StatCard title="Beyond 72 Hrs" value={beyond72} icon={Clock} color="text-red-600 bg-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Entry Types Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={entryTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {entryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Timeframe Analytics</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeframeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {timeframeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
