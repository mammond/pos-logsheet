import React, { useState } from 'react';
import { LogEntry } from '../types';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { getTimeframeColor } from '../utils/calculations';

interface SubmissionTableProps {
  entries: LogEntry[];
  onEdit: (entry: LogEntry) => void;
  onDelete: (id: string) => void;
}

const SubmissionTable: React.FC<SubmissionTableProps> = ({ entries, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(entry => 
    entry.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.typeOfEntry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.swo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Submissions</h3>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 sticky top-0">
            <tr>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Admission</th>
              <th className="px-6 py-4">Enrolled</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Timeframe</th>
              <th className="px-6 py-4">PHIC</th>
              <th className="px-6 py-4">Staff</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredEntries.length === 0 ? (
                <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                        No entries found matching your search.
                    </td>
                </tr>
            ) : (
                filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {entry.timestamp.split(',')[0]}
                    <span className="block text-xs text-slate-400 font-normal">{entry.timestamp.split(',')[1]}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{entry.patientName || '-'}</td>
                    <td className="px-6 py-4">{entry.dateOfAdmission}</td>
                    <td className="px-6 py-4">{entry.enrolledDate}</td>
                    <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        entry.typeOfEntry === 'ER' ? 'bg-orange-100 text-orange-700' :
                        entry.typeOfEntry === 'IP' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                        {entry.typeOfEntry}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getTimeframeColor(entry.timeframe)}`}>
                        {entry.timeframe}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${entry.phicStatus === 'Enrolled' ? 'text-green-600' : 'text-blue-600'}`}>
                        {entry.phicStatus}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                        <div className="flex flex-col gap-1">
                            {entry.swo && <span className="bg-slate-100 dark:bg-slate-700 px-1 rounded">SWO: {entry.swo}</span>}
                            {entry.swa && <span className="bg-slate-100 dark:bg-slate-700 px-1 rounded">SWA: {entry.swa}</span>}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                        onClick={() => onEdit(entry)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        title="Edit"
                        >
                        <Edit2 size={16} />
                        </button>
                        <button 
                        onClick={() => onDelete(entry.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                        >
                        <Trash2 size={16} />
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTable;