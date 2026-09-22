import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, Clock, CheckSquare, Square, Trash2, Lightbulb, Hourglass } from 'lucide-react';

export default function Brainstorming({ darkMode = true }) {
  // State untuk daftar tugas / ide brainstorming
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Desain UI Dashboard Waktura',
      time: '09:00–10:00',
      category: 'Sekali',
      deadline: '2026-09-25T23:59:00',
      completed: false,
    },
    {
      id: 2,
      title: 'Riset fitur AI Planner',
      time: '14:00–15:30',
      category: 'Harian',
      deadline: '2026-09-23T18:00:00',
      completed: false,
    },
  ]);

  // State untuk pembaruan detik pada countdown timer
  const [now, setNow] = useState(new Date());

  // Update timer setiap 1 menit untuk menghemat resource
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // State untuk kontrol Modal Pop-Up
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk Form Input
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('Sekali');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');

  // Toggle status selesai
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Hapus tugas
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Submit Form Tambah Tugas
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let fullDeadline = '';
    if (deadlineDate) {
      fullDeadline = `${deadlineDate}T${deadlineTime || '23:59'}:00`;
    }

    const newTask = {
      id: Date.now(),
      title,
      time: time || 'Sepanjang hari',
      category: category || 'Sekali',
      deadline: fullDeadline,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    
    // Reset Form & Tutup Modal
    setTitle('');
    setTime('');
    setCategory('Sekali');
    setDeadlineDate('');
    setDeadlineTime('23:59');
    setIsModalOpen(false);
  };

  // Fungsi Penghitung Mundur (Countdown Calculator)
  const getCountdown = (deadlineIso) => {
    if (!deadlineIso) return null;

    const target = new Date(deadlineIso);
    const diff = target - now;

    if (isNaN(diff)) return null;

    if (diff <= 0) {
      return { text: 'Tenggat Waktu Lewat!', status: 'expired' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    let text = '';
    if (days > 0) {
      text = `${days}hr ${hours}jam lagi`;
    } else if (hours > 0) {
      text = `${hours}jam ${minutes}m lagi`;
    } else {
      text = `${minutes} menit lagi`;
    }

    // Tentukan status urgensi
    let status = 'normal'; // > 2 hari
    if (days <= 0 && hours < 12) {
      status = 'urgent'; // < 12 jam
    } else if (days <= 2) {
      status = 'warning'; // 1-2 hari lagi
    }

    return { text, status };
  };

  // Format tanggal deadline
  const formatDeadlineText = (dateIso) => {
    if (!dateIso) return null;
    try {
      const date = new Date(dateIso);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto font-sans select-none">
      {/* Header Brainstorming */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-6">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Brainstorming
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Ide dan tugas yang perlu dikembangkan.
          </p>
        </div>

        {/* Tombol Tambah Pop-up (+) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
            darkMode 
              ? 'bg-[#0b1329]/90 border-gray-800 text-gray-200 hover:border-gray-700 hover:text-white' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Tambah Ide / Tugas Baru"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Daftar Tugas / Ide */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
            <Lightbulb className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Belum ada ide brainstorming.</p>
            <p className="text-xs text-gray-500 mt-1">Klik tombol + di atas untuk menambahkan.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const countdown = getCountdown(task.deadline);
            const dateFormatted = formatDeadlineText(task.deadline);

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`group p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  darkMode 
                    ? 'bg-[#0b1329]/80 border-gray-800/80 hover:border-gray-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="mt-0.5 text-blue-500 hover:text-blue-400 transition-colors focus:outline-none"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                    )}
                  </button>

                  {/* Deskripsi Ide & Detail */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className={`font-semibold text-base leading-snug transition-all ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 font-medium mt-1">
                      <span>{task.time} · {task.category}</span>

                      {/* Tanggal Deadline */}
                      {dateFormatted && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          {dateFormatted}
                        </span>
                      )}
                    </div>

                    {/* Countdown Badge */}
                    {countdown && !task.completed && (
                      <div className="mt-2 flex items-center">
                        <span 
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                            countdown.status === 'expired'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : countdown.status === 'urgent'
                              ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
                              : countdown.status === 'warning'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}
                        >
                          <Hourglass className="w-3 h-3" />
                          {countdown.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Hapus */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-500 hover:text-red-400 rounded-lg"
                  title="Hapus Tugas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* MODAL POP-UP TAMBAH TUGAS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`relative z-10 w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
                darkMode 
                  ? 'bg-[#0b1329] border-gray-800 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">Tambah Ide Brainstorming</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddTask} className="space-y-4">
                {/* Input Nama Ide */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Nama Ide / Tugas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Desain Wireframe Landing Page"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode 
                        ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white placeholder-gray-600' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                    }`}
                  />
                </div>

                {/* Grid Input Waktu & Kategori */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Waktu
                    </label>
                    <input
                      type="text"
                      placeholder="09:00–10:00"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        darkMode 
                          ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white placeholder-gray-600' 
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Frekuensi
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        darkMode 
                          ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white' 
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                      }`}
                    >
                      <option value="Sekali">Sekali</option>
                      <option value="Harian">Harian</option>
                      <option value="Mingguan">Mingguan</option>
                      <option value="Bulanan">Bulanan</option>
                    </select>
                  </div>
                </div>

                {/* Input Tanggal & Jam Deadline */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-7">
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Tanggal Deadline
                    </label>
                    <input
                      type="date"
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        darkMode 
                          ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white [color-scheme:dark]' 
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="col-span-5">
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Jam
                    </label>
                    <input
                      type="time"
                      value={deadlineTime}
                      onChange={(e) => setDeadlineTime(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        darkMode 
                          ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white [color-scheme:dark]' 
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 mt-6 border-t border-gray-800/80">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all"
                  >
                    Simpan Ide
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}