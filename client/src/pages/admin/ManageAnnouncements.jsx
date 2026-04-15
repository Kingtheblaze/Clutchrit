// src/pages/admin/ManageAnnouncements.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', content: '', type: 'GENERAL', isPinned: false
  });
  const [formLoading, setFormLoading] = useState(false);

  const announcementTypes = ['GENERAL', 'URGENT', 'EVENT', 'RECRUITMENT'];

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      showToast('FAILED TO FETCH ANNOUNCEMENTS', 'fire');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const showToast = (msg, type = 'acid') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'GENERAL', isPinned: false });
    setSelectedAnnouncement(null);
  };

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        type: announcement.type || 'GENERAL',
        isPinned: announcement.isPinned || false
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.type) return;
    
    setFormLoading(true);
    try {
      if (selectedAnnouncement) {
        await api.put(`/announcements/${selectedAnnouncement.id}`, formData);
        showToast('ANNOUNCEMENT UPDATED ✓');
      } else {
        await api.post('/announcements', formData);
        showToast('ANNOUNCEMENT POSTED ✓');
      }
      fetchAnnouncements();
      handleCloseModal();
    } catch (err) {
      showToast('ERROR SAVING ANNOUNCEMENT', 'fire');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAnnouncement) return;
    try {
      await api.delete(`/announcements/${selectedAnnouncement.id}`);
      showToast('ANNOUNCEMENT DELETED ✓', 'fire');
      fetchAnnouncements();
    } catch (err) {
      showToast('FAILED TO DELETE', 'fire');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    }
  };

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-void">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, x: '100%' }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: -20, x: '100%' }}
            className={`fixed top-20 right-6 z-[9999] px-6 py-3 font-subheading uppercase tracking-widest text-sm border ${toastMessage.type === 'acid' ? 'bg-surface-2 border-acid text-acid' : 'bg-surface-2 border-fire text-fire'}`}
          >
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-5xl text-text-0 leading-none">ANNOUNCEMENTS</h1>
          <p className="font-subheading text-acid uppercase tracking-widest mt-2">{announcements.length} TOTAL DROPS</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" size={14} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-surface-1 border border-border text-text-0 pl-10 pr-4 py-2 font-mono text-xs w-64 focus:border-acid focus:outline-none" />
          </div>
          <button onClick={() => handleOpenModal()} className="bg-acid text-void font-subheading font-bold uppercase tracking-widest px-6 py-2 hover:shadow-acid-glow">NEW DROP +</button>
        </div>
      </div>

      <div className="bg-surface-1 border border-border flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin" /></div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 text-center">
            <h3 className="font-heading text-4xl text-text-2 mb-2">NO DROPS YET</h3>
            <button onClick={() => handleOpenModal()} className="border border-acid text-acid font-subheading uppercase tracking-widest px-6 py-2 hover:bg-acid-dim mt-4">POST FIRST ANNOUNCEMENT</button>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredAnnouncements.map(ann => (
              <div key={ann.id} className="flex flex-col md:flex-row md:items-center p-4 border-b border-border hover:bg-surface-2 transition-colors">
                
                <div className="w-24 shrink-0 flex items-center mb-2 md:mb-0">
                  <span className={`font-subheading text-[10px] px-2 py-1 tracking-widest border
                    ${ann.type === 'URGENT' ? 'border-fire text-fire bg-fire-dim' : 
                      ann.type === 'RECRUITMENT' ? 'border-ice text-ice bg-ice-dim' : 
                      ann.type === 'EVENT' ? 'border-acid text-acid bg-acid-dim' : 
                      'border-border text-text-1'}
                  `}>{ann.type}</span>
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3">
                    {ann.isPinned && <span className="text-fire font-subheading text-[10px] tracking-widest flex items-center">📌 PINNED</span>}
                    <h4 className="font-heading text-text-0 text-xl truncate">{ann.title}</h4>
                  </div>
                  <p className="font-mono text-text-2 text-[10px] mt-1">{new Date(ann.date).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2 md:border-l border-border/50 md:pl-4 mt-2 md:mt-0 shrink-0">
                  <button onClick={() => handleOpenModal(ann)} className="text-center border border-acid text-acid hover:shadow-acid-glow font-subheading uppercase text-[10px] px-4 py-2">EDIT</button>
                  <button onClick={() => { setSelectedAnnouncement(ann); setIsDeleteModalOpen(true); }} className="text-center border border-fire text-fire hover:shadow-fire-glow font-subheading uppercase text-[10px] px-4 py-2">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-surface-1 border border-border-bright flex flex-col shadow-2xl">
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface-2 shrink-0">
                <h2 className="font-heading text-3xl text-text-0 leading-none">{selectedAnnouncement ? 'EDIT DROP' : 'NEW DROP'}</h2>
                <button onClick={handleCloseModal} className="text-text-1 hover:text-fire"><FaTimes size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 font-body">
                <form id="ann-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">TITLE *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">CONTENT *</label>
                    <textarea rows={8} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="bg-surface-2 border border-border text-text-0 p-3 font-body focus:border-acid focus:outline-none" />
                    <p className="font-mono text-text-2 text-[10px]">Supports basic markdown: **bold**, *italic*, - lists</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">TYPE *</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none cursor-pointer">
                        {announcementTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="p-4 border border-border bg-surface-2 flex items-center justify-between gap-4 h-full">
                      <span className="font-subheading text-text-1 text-xs uppercase tracking-widest">PINNED DROP</span>
                      <div className={`w-12 h-6 flex items-center p-1 cursor-pointer transition-colors duration-300 ${formData.isPinned ? 'bg-fire' : 'bg-surface-1 border border-border'}`} onClick={() => setFormData({...formData, isPinned: !formData.isPinned})}>
                        <motion.div className="w-4 h-4 bg-void" animate={{ x: formData.isPinned ? 24 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                      </div>
                    </div>
                  </div>
                  {formData.isPinned && <p className="text-fire font-mono text-[10px] -mt-2">This will appear at top of announcements</p>}
                </form>
              </div>

              <div className="p-6 border-t border-border bg-surface-2 shrink-0 flex justify-end gap-4">
                <button type="button" onClick={handleCloseModal} className="border border-border text-text-1 font-subheading px-8 py-3 hover:bg-surface-3">CANCEL</button>
                <button type="submit" form="ann-form" disabled={formLoading} className="bg-acid text-void font-subheading font-bold px-8 py-3 hover:shadow-acid-glow flex items-center gap-2">
                  {formLoading ? 'SAVING...' : 'SAVE POST'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-void/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-surface-1 border-t-4 border-fire p-8 max-w-sm w-full text-center shadow-2xl">
              <h3 className="font-heading text-3xl text-text-0 mb-2">DELETE DROP?</h3>
              <p className="font-body text-text-1 text-sm mb-8">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 border border-border text-text-1 font-subheading py-3 hover:bg-surface-2">CANCEL</button>
                <button onClick={confirmDelete} className="flex-1 bg-fire text-void font-subheading py-3 ">DELETE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAnnouncements;
