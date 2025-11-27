import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Table2, Plus, Moon, Sun, Undo2, ClipboardList, Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SubmissionTable from './components/SubmissionTable';
import EntryModal from './components/EntryModal';
import { LogEntry } from './types';

function App() {
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('pos_entries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [deletedEntry, setDeletedEntry] = useState<LogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Theme Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist Data
  useEffect(() => {
    localStorage.setItem('pos_entries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (entry: LogEntry) => {
    if (editingEntry) {
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
      setEditingEntry(null);
    } else {
      setEntries([entry, ...entries]);
    }
  };

  const handleEdit = (entry: LogEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const entryToDelete = entries.find(e => e.id === id);
    if (entryToDelete) {
      setDeletedEntry(entryToDelete);
      setEntries(entries.filter(e => e.id !== id));
      
      // Auto-clear undo after 5 seconds
      setTimeout(() => setDeletedEntry(null), 5000);
    }
  };

  const handleUndo = () => {
    if (deletedEntry) {
      setEntries([deletedEntry, ...entries]);
      setDeletedEntry(null);
    }
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col z-20`}>
        <div className="p-6 flex items-center gap-3 overflow-hidden border-b border-slate-100 dark:border-slate-700 h-20">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/30">
            <ClipboardList className="text-white w-6 h-6" />
          </div>
          {sidebarOpen && (
             <div className="animate-fade-in">
                <h1 className="font-bold text-slate-800 dark:text-white leading-tight">POS Logsheet</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Region II Trauma & Medical Center</p>
             </div>
          )}
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Summary Report</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'submissions' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            <Table2 size={20} />
            {sidebarOpen && <span>Submissions</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
           <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex justify-between items-center px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
               <Menu size={20} />
             </button>
             <div className="hidden md:block">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{activeTab === 'dashboard' ? 'Dashboard Overview' : 'Data Management'}</h2>
                <p className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            {deletedEntry && (
              <button 
                onClick={handleUndo}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full text-sm hover:bg-slate-700 transition-all animate-bounce"
              >
                <Undo2 size={14} /> Undo Delete
              </button>
            )}
            <button 
              onClick={() => {
                setEditingEntry(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-primary-600/30 transition-all transform hover:scale-105"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Entry</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' ? (
            <Dashboard entries={entries} />
          ) : (
            <SubmissionTable 
              entries={entries} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </main>

      <EntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddEntry}
        initialData={editingEntry}
      />
    </div>
  );
}

export default App;