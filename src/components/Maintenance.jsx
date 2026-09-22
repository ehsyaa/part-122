import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, CheckSquare, Square, Trash2, Activity, Pencil } from 'lucide-react';

export default function Maintenance({ darkMode = true }) {
  // Preset jadwal harian dari jam 02:00 sampai 23:00
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Tidur & Istirahat Pemulihan',
      startTime: '02:00',
      endTime: '05:00',
      frequency: 'Harian',
      completed: true,
    },
    {
      id: 2,
      title: 'Ibadah Subuh & Meditasi Pagi',
      startTime: '05:00',
      endTime: '06:00',
      frequency: 'Harian',
      completed: true,
    },
    {
      id: 3,
      title: 'Olahraga & Aktivitas Fisik',
      startTime: '06:00',
      endTime: '07:30',
      frequency: 'Harian',
      completed: false,
    },
    {
      id: 4,
      title: 'Sesi Fokus Pemrograman & Pembelajaran',
      startTime: '08:30',
      endTime: '12:00',
      frequency: 'Harian',
      completed: false,
    },
    {
      id: 5,
      title: 'Makan Siang & Istirahat Sejenak',
      startTime: '12:00',
      endTime: '13:30',
      frequency: 'Harian',
      completed: false,
    },
    {
      id: 6,
      title: 'Pengerjaan Proyek & Evaluasi Rutin',
      startTime: '13:30',
      endTime: '17:30',
      frequency: 'Harian',
      completed: false,
    },
    {
      id: 7,
      title: 'Makan Malam & Refleksi Harian',
      startTime: '18:30',
      endTime: '20:00',
      frequency: 'Harian',
      completed: false,
    },
    {
      id: 8,
      title: 'Persiapan Tidur & Digital Detox',
      startTime: '21:00',
      endTime: '23:00',
      frequency: 'Harian',
      completed: false,
    },
  ]);

  // State Modal Pop-up
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Menandai jika sedang dalam mode edit

  // Form State
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [frequency, setFrequency] = useState('Harian');

  // Toggle Checkbox
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Hapus Kegiatan
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Buka Modal Tambah Kegiatan
  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('');
    setStartTime('08:00');
    setEndTime('09:00');
    setFrequency('Harian');
    setIsModalOpen(true);
  };

  // Buka Modal Edit Kegiatan
  const handleOpenEditModal = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setFrequency(task.frequency);
    setIsModalOpen(true);
  };

  // Simpan Kegiatan (Tambah / Edit)
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      // Perbarui kegiatan yang ada
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title,
                startTime: startTime || '00:00',
                endTime: endTime || '00:00',
                frequency: frequency || 'Harian',
              }
            : task
        )
      );
    } else {
      // Tambah kegiatan baru
      const newTask = {
        id: Date.now(),
        title,
        startTime: startTime || '00:00',
        endTime: endTime || '00:00',
        frequency: frequency || 'Harian',
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    // Reset Form & Tutup Modal
    setTitle('');
    setStartTime('08:00');
    setEndTime('09:00');
    setFrequency('Harian');
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-6">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Maintenance Active
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Jadwal kegiatan rutin harian.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAddModal}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
            darkMode 
              ? 'bg-[#0b1329]/90 border-gray-800 text-gray-200 hover:border-gray-700 hover:text-white' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Tambah Kegiatan"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Daftar Aktivitas Format 2 Kolom (Kolom Jam | Kolom Detail Kegiatan) */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
            <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Belum ada kegiatan pemeliharaan.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`group rounded-2xl border transition-all flex items-center overflow-hidden ${
                darkMode 
                  ? 'bg-[#0b1329]/80 border-gray-800/80 hover:border-gray-700' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              {/* KOLOM 1: Jam / Waktu */}
              <div 
                className={`w-36 sm:w-44 px-4 py-4 border-r flex flex-col justify-center shrink-0 ${
                  darkMode 
                    ? 'bg-[#080d1a]/60 border-gray-800/80 text-blue-400' 
                    : 'bg-gray-50 border-gray-200 text-blue-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm tracking-wide">
                  <Clock className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span>{task.startTime} - {task.endTime}</span>
                </div>
              </div>

              {/* KOLOM 2: Maintenance Activity & Action Buttons */}
              <div className="flex-1 px-4 py-3 flex items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="text-blue-500 hover:text-blue-400 transition-colors focus:outline-none shrink-0"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                    )}
                  </button>

                  {/* Judul Aktivitas & Frekuensi */}
                  <div className="min-w-0 flex-1">
                    <h3 
                      className={`font-semibold text-sm sm:text-base leading-snug truncate ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {task.frequency}
                    </p>
                  </div>
                </div>

                {/* Tombol Aksi: Edit & Hapus */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
                    title="Edit Kegiatan"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Hapus Kegiatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pop-Up Modal Tambah / Edit Kegiatan */}
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
              <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {editingId ? 'Edit Jadwal Pemeliharaan' : 'Tambah Jadwal Pemeliharaan'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Nama Kegiatan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Olahraga Pagi & Peregangan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode 
                        ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white placeholder-gray-600' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        darkMode 
                          ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white [color-scheme:dark]' 
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        darkMode 
                          ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white [color-scheme:dark]' 
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Frekuensi
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode 
                        ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                    }`}
                  >
                    <option value="Harian">Harian</option>
                    <option value="Mingguan">Mingguan</option>
                    <option value="Sekali">Sekali</option>
                  </select>
                </div>

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
                    {editingId ? 'Simpan Perubahan' : 'Simpan Kegiatan'}
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