import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, CheckCircle } from 'lucide-react';
import { LogEntry, SWO_LIST, SWA_LIST, INTERN_LIST, ENTRY_TYPES, PHIC_STATUSES } from '../types';
import { calculateTimeframe } from '../utils/calculations';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: LogEntry) => void;
  initialData?: LogEntry | null;
}

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<LogEntry>>({
    patientName: '',
    memberName: '',
    dateOfAdmission: '',
    enrolledDate: '',
    swo: '',
    swa: '',
    intern: '',
    typeOfEntry: '',
    phicStatus: '',
    remarks: ''
  });

  const [timeframePreview, setTimeframePreview] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTimeframePreview(initialData.timeframe);
    } else {
      // Reset logic
      setFormData({
        patientName: '',
        memberName: '',
        dateOfAdmission: '',
        enrolledDate: '',
        swo: '',
        swa: '',
        intern: '',
        typeOfEntry: '',
        phicStatus: '',
        remarks: ''
      });
      setTimeframePreview('');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (formData.dateOfAdmission && formData.enrolledDate) {
      const calc = calculateTimeframe(formData.dateOfAdmission, formData.enrolledDate);
      setTimeframePreview(calc);
    } else {
      setTimeframePreview('');
    }
  }, [formData.dateOfAdmission, formData.enrolledDate]);

  const handleChange = (field: keyof LogEntry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dateOfAdmission || !formData.enrolledDate || !formData.typeOfEntry || !formData.phicStatus) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    const entry: LogEntry = {
      id: initialData?.id || crypto.randomUUID(),
      timestamp: initialData?.timestamp || new Date().toLocaleString(),
      patientName: formData.patientName || '',
      memberName: formData.memberName || '',
      dateOfAdmission: formData.dateOfAdmission || '',
      enrolledDate: formData.enrolledDate || '',
      swo: formData.swo || '',
      swa: formData.swa || '',
      intern: formData.intern || '',
      typeOfEntry: formData.typeOfEntry as any,
      phicStatus: formData.phicStatus as any,
      timeframe: timeframePreview as any,
      remarks: formData.remarks || ''
    };

    onSubmit(entry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="text-primary-600" />
              {initialData ? 'Edit Entry' : 'New Log Entry'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Region II Trauma & Medical Center - POS</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Dates & Validation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Admission <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.dateOfAdmission}
                  onChange={(e) => handleChange('dateOfAdmission', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Enrolled Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.enrolledDate}
                  onChange={(e) => handleChange('enrolledDate', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
             </div>
             <div className="md:col-span-2">
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Calculated Timeframe:</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                    timeframePreview === 'Within the Day' ? 'bg-green-100 text-green-700' :
                    timeframePreview === 'Within 72 Hours' ? 'bg-yellow-100 text-yellow-700' :
                    timeframePreview === 'Beyond 72 Hours' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {timeframePreview || 'Pending Dates'}
                  </span>
                </div>
             </div>
          </div>

          {/* Section 2: Personel Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.patientName}
                  onChange={(e) => handleChange('patientName', e.target.value)}
                  placeholder="Optional"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Member Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.memberName}
                  onChange={(e) => handleChange('memberName', e.target.value)}
                  placeholder="Optional"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Staff Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SWO</label>
                <select 
                  value={formData.swo} 
                  onChange={(e) => handleChange('swo', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                >
                  <option value="">Select SWO</option>
                  {SWO_LIST.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SWA</label>
                <select 
                  value={formData.swa} 
                  onChange={(e) => handleChange('swa', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                >
                  <option value="">Select SWA</option>
                  {SWA_LIST.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Intern</label>
                <select 
                  value={formData.intern} 
                  onChange={(e) => handleChange('intern', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                >
                  <option value="">Select Intern</option>
                  {INTERN_LIST.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>
          </div>

          {/* Section 4: Status and Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type of Entry <span className="text-red-500">*</span></label>
              <select 
                  value={formData.typeOfEntry} 
                  onChange={(e) => handleChange('typeOfEntry', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                >
                  <option value="">Select Type</option>
                  {ENTRY_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">PHIC Status <span className="text-red-500">*</span></label>
              <select 
                  value={formData.phicStatus} 
                  onChange={(e) => handleChange('phicStatus', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                >
                  <option value="">Select Status</option>
                  {PHIC_STATUSES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
            <textarea 
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Optional notes..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none"
            />
          </div>

        </form>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30 font-medium transition-all flex items-center gap-2">
            <CheckCircle size={18} />
            {initialData ? 'Update Entry' : 'Submit Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;