import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Navbar from './components/Navbar';
import Clock from './components/Clock';
import Brainstroming from './components/Brainstroming';
import Maintenance from './components/Maintenance';
import Weekly from './components/Weekly';

// Data bawaan awal jika localStorage masih kosong
const initialTasks = {
  brainstorming: [
    { id: 'b-1', title: 'Riset AI & Integration', completed: false },
    { id: 'b-2', title: 'Desain UI Dashboard Baru', completed: false },
  ],
  maintenance: [
    { id: 'm-1', title: 'Backup Database Utama', completed: false },
    { id: 'm-2', title: 'Update Dependency Library', completed: false },
  ],
  weekly: {
    Senin: [
      { id: 'w-1', title: 'Review Target Mingguan', startTime: '08:00', endTime: '09:00', completed: true },
    ],
    Selasa: [],
    Rabu: [],
    Kamis: [],
    Jumat: [],
    Sabtu: [],
    Minggu: [],
  },
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('main');

  // 1. Ambil data tersimpan dari localStorage saat aplikasi pertama kali dimuat
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('my_waktura_tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  // 2. Simpan otomatis ke localStorage setiap kali ada perubahan pada state 'tasks'
  useEffect(() => {
    localStorage.setItem('my_waktura_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handler Drag and Drop
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    let movedItem;
    const newTasks = JSON.parse(JSON.stringify(tasks)); // Deep clone agar aman

    // Potong item dari sumber
    if (source.droppableId === 'brainstorming') {
      [movedItem] = newTasks.brainstorming.splice(source.index, 1);
    } else if (source.droppableId === 'maintenance') {
      [movedItem] = newTasks.maintenance.splice(source.index, 1);
    } else if (source.droppableId.startsWith('weekly-')) {
      const day = source.droppableId.replace('weekly-', '');
      [movedItem] = newTasks.weekly[day].splice(source.index, 1);
    }

    if (!movedItem) return;

    // Masukkan item ke tujuan
    if (destination.droppableId === 'brainstorming') {
      newTasks.brainstorming.splice(destination.index, 0, movedItem);
    } else if (destination.droppableId === 'maintenance') {
      newTasks.maintenance.splice(destination.index, 0, movedItem);
    } else if (destination.droppableId.startsWith('weekly-')) {
      const day = destination.droppableId.replace('weekly-', '');
      const itemToInsert = {
        ...movedItem,
        startTime: movedItem.startTime || '09:00',
        endTime: movedItem.endTime || '10:00',
      };
      newTasks.weekly[day].splice(destination.index, 0, itemToInsert);
    }

    setTasks(newTasks);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className={`min-h-screen ${darkMode ? 'bg-[#080d1a] text-white' : 'bg-gray-50 text-gray-900'} p-4 sm:p-6 transition-colors duration-300`}>
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <main className="max-w-6xl mx-auto mt-8">
          {activeTab === 'main' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
                <Clock darkMode={darkMode} />
              </div>

              <div className="lg:col-span-7 space-y-8">
                <Brainstroming 
                  darkMode={darkMode} 
                  tasks={tasks.brainstorming} 
                  setTasks={(updater) => {
                    const next = typeof updater === 'function' ? updater(tasks.brainstorming) : updater;
                    setTasks({ ...tasks, brainstorming: next });
                  }} 
                />
                <Maintenance 
                  darkMode={darkMode} 
                  tasks={tasks.maintenance} 
                  setTasks={(updater) => {
                    const next = typeof updater === 'function' ? updater(tasks.maintenance) : updater;
                    setTasks({ ...tasks, maintenance: next });
                  }} 
                />
                <Weekly 
                  darkMode={darkMode} 
                  schedule={tasks.weekly} 
                  setSchedule={(updater) => {
                    const next = typeof updater === 'function' ? updater(tasks.weekly) : updater;
                    setTasks({ ...tasks, weekly: next });
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#0b1329]">
              <h2 className="text-xl font-bold mb-2">Riwayat & Kalender</h2>
            </div>
          )}
        </main>
      </div>
    </DragDropContext>
  );
}