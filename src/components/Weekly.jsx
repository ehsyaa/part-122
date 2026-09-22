import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, CheckSquare, Square, Trash2, Calendar, Pencil } from 'lucide-react';

export default function Weekly({ darkMode = true }) {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Mendapatkan nama hari saat ini (dalam bahasa Indonesia)
  const todayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());

  // Preset data jadwal mingguan
  const [schedule, setSchedule] = useState({
    Senin: [
      { id: 1, title: 'Review Target Mingguan & Kopi Pagi', startTime: '08:00', endTime: '09:00', completed: true },
      { id: 2, title: 'Sprint Meeting & Pembagian Tugas', startTime: '09:30', endTime: '11:00', completed: false },
      { id: 3, title: 'Pengembangan Fitur Dashboard', startTime: '13:00', endTime: '16:00', completed: false },
    ],
    Selasa: [
      { id: 4, title: 'Riset AI & Integrasi Library', startTime: '09:00', endTime: '12:00', completed: false },
      { id: 5, title: 'Sesi Code Review', startTime: '14:00', endTime: '16:00', completed: false },
    ],
    Rabu: [
      { id: 6, title: 'Maintenance Server & Database', startTime: '08:30', endTime: '11:30', completed: false },
      { id: 7, title: 'Evaluasi Progres Pertengahan Pekan', startTime: '14:00', endTime: '15:30', completed: false },
    ],
    Kamis: [
      { id: 8, title: 'Pengerjaan Desain UI/UX', startTime: '09:00', endTime: '12:00', completed: false },
      { id: 9, title: 'Testing & Quality Assurance', startTime: '13:30', endTime: '16:30', completed: false },
    ],
    Jumat: [
      { id: 10, title: 'Refactoring Kode & Dokumentasi', startTime: '09:00', endTime: '11:30', completed: false },
      { id: 11, title: 'Evaluasi Mingguan & Demo Fitur', startTime: '14:00', endTime: '16:00', completed: false },
    ],
    Sabtu: [
      { id: 12, title: 'Belajar Skill Baru & Membaca Buku', startTime: '10:00', endTime: '12:00', completed: false },
      { id: 13, title: 'Olahraga Sore & Hangout', startTime: '16:00', endTime: '18:00', completed: false },
    ],
    Minggu: [
      { id: 14, title: 'Istirahat Total & Pemulihan', startTime: '08:00', endTime: '12:00', completed: true },
      { id: 15, title: 'Persiapan Rencana Pekan Depan', startTime: '19:00', endTime: '20:30', completed: false },
    ],
  });

  // State Modal Pop-up
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDay, setTargetDay] = useState('Senin');
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');

  // Toggle Checkbox
  const toggleComplete = (day, id) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  // Hapus tugas
  const deleteTask = (day, id) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].filter((task) => task.id !== id),
    });
  };

  // Buka Modal Tambah Agenda
  const handleOpenAddModal = (day) => {
    setTargetDay(day);
    setEditingId(null);
    setTitle('');
    setStartTime('08:00');
    setEndTime('09:00');
    setIsModalOpen(true);
  };

  // Buka Modal Edit Agenda
  const handleOpenEditModal = (day, task) => {
    setTargetDay(day);
    setEditingId(task.id);
    setTitle(task.title);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setIsModalOpen(true);
  };

  // Simpan Data (Tambah / Edit)
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      setSchedule({
        ...schedule,
        [targetDay]: schedule[targetDay].map((task) =>
          task.id === editingId
            ? { ...task, title, startTime: startTime || '00:00', endTime: endTime || '00:00' }
            : task
        ),
      });
    } else {
      const newTask = {
        id: Date.now(),
        title,
        startTime: startTime || '00:00',
        endTime: endTime || '00:00',
        completed: false,
      };
      setSchedule({
        ...schedule,
        [targetDay]: [...schedule[targetDay], newTask],
      });
    }

    setTitle('');
    setStartTime('08:00');
    setEndTime('09:00');
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full font-sans select-none space-y-6">
      {/* Header Utama */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800/80">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Weekly Schedule
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Jadwal kegiatan harian dari Senin sampai Minggu.
          </p>
        </div>
      </div>

      {/* Container Kotak Hari (Senin sampai Minggu) */}
      <div className="space-y-6">
        {days.map((day) => {
          const tasks = schedule[day] || [];
          const isToday = day.toLowerCase() === todayName.toLowerCase();

          return (
            <div
              key={day}
              className={`p-5 rounded-2xl border transition-all ${
                isToday
                  ? darkMode
                    ? 'bg-[#0e1a38] border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                    : 'bg-blue-50/70 border-blue-400 shadow-md ring-1 ring-blue-300'
                  : darkMode
                  ? 'bg-[#0b1329]/80 border-gray-800/80'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              {/* Header Nama Hari & Tombol Tambah */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm tracking-wide uppercase ${
                      isToday
                        ? 'font-black text-blue-400 text-base'
                        : 'font-bold text-gray-400'
                    }`}
                  >
                    {day}
                  </span>

                  {/* Badge Hari Ini */}
                  {isToday && (
                    <span className="text-[10px] bg-blue-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Today
                    </span>
                  )}

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isToday
                        ? 'bg-blue-500/20 text-blue-300'
                        : darkMode
                        ? 'bg-gray-800 text-gray-400'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tasks.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAddModal(day)}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 border transition-colors ${
                    isToday
                      ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500'
                      : darkMode
                      ? 'bg-[#080d1a] border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                  title={`Tambah Agenda ${day}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              {/* Daftar Task */}
              {tasks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">Belum ada agenda untuk hari {day}.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isToday
                          ? darkMode
                            ? 'bg-[#080d1a]/90 border-blue-900/60 hover:border-blue-700'
                            : 'bg-white border-blue-200 hover:border-blue-300'
                          : darkMode
                          ? 'bg-[#080d1a]/60 border-gray-800/60 hover:border-gray-700'
                          : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Sisi Kiri: Checkbox & Nama Agenda */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => toggleComplete(day, task.id)}
                          className="text-blue-500 hover:text-blue-400 transition-colors focus:outline-none shrink-0"
                        >
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                          )}
                        </button>

                        <span
                          className={`text-xs sm:text-sm truncate ${
                            isToday ? 'font-bold' : 'font-semibold'
                          } ${
                            task.completed
                              ? 'line-through text-gray-500'
                              : darkMode
                              ? 'text-white'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      {/* Sisi Kanan: Jam & Tombol Aksi */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div
                          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${
                            isToday
                              ? 'bg-blue-500/20 text-blue-300 font-bold'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>
                            {task.startTime} - {task.endTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(day, task)}
                            className="p-1 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
                            title="Edit Agenda"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(day, task.id)}
                            className="p-1 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Hapus Agenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pop-Up Modal Tambah / Edit */}
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
                darkMode ? 'bg-[#0b1329] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {editingId ? `Edit Agenda (${targetDay})` : `Tambah Agenda (${targetDay})`}
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
                    Hari
                  </label>
                  <select
                    value={targetDay}
                    onChange={(e) => setTargetDay(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-[#080d1a] border-gray-800 focus:border-blue-500 text-white'
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900'
                    }`}
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Nama Agenda *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Meeting Proyek A"
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
                    {editingId ? 'Simpan Perubahan' : 'Simpan Agenda'}
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