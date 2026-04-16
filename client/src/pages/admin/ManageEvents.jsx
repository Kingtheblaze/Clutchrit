// src/pages/admin/ManageEvents.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaCamera } from 'react-icons/fa';
import api from '../../services/api';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', game: '', type: 'TOURNAMENT',
    date: '', time: '', location: '', prizePool: '', 
    registrationLink: '', status: 'UPCOMING', tags: ''
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fileInputRef = useRef(null);

  const eventTypes = ['TOURNAMENT', 'CASUAL', 'WORKSHOP', 'COLLAB', 'OTHER'];
  const eventStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      showToast('FAILED TO FETCH EVENTS', 'fire');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (msg, type = 'acid') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', game: '', type: 'TOURNAMENT',
      date: '', time: '', location: '', prizePool: '', 
      registrationLink: '', status: 'UPCOMING', tags: ''
    });
    setBannerFile(null);
    setBannerPreview(null);
    setSelectedEvent(null);
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      const eventDate = event.date ? new Date(event.date) : new Date();
      setFormData({
        title: event.title || '',
        description: event.description || '',
        game: event.game || '',
        type: event.type || 'TOURNAMENT',
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().split(' ')[0].substring(0,5),
        location: event.location || '',
        prizePool: event.prizePool || '',
        registrationLink: event.registrationLink || '',
        status: event.status || 'UPCOMING',
        tags: (event.tags || []).join(', ')
      });
      setBannerPreview(event.banner_image || null);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.type || !formData.status) return;
    
    setFormLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
          data.append(key, JSON.stringify(tagsArray));
        } else if (key === 'date') {
          // Combine date and time
          const dateTimeStr = `${formData.date}T${formData.time || '00:00'}:00`;
          data.append('date', new Date(dateTimeStr).toISOString());
        } else if (key !== 'time') {
          data.append(key, formData[key]);
        }
      });
      
      if (bannerFile) {
        data.append('banner', bannerFile);
      }

      if (selectedEvent) {
        await api.put(`/events/${selectedEvent.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('EVENT UPDATED ✓');
      } else {
        await api.post('/events', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('EVENT POSTED ✓');
      }
      
      fetchEvents();
      handleCloseModal();
    } catch (err) {
      showToast('ERROR SAVING EVENT', 'fire');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      await api.delete(`/events/${selectedEvent.id}`);
      showToast('EVENT DELETED ✓', 'fire');
      fetchEvents();
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      showToast('FAILED TO DELETE', 'fire');
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.game && e.game.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-void">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '100%' }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: -20, x: '100%' }}
            className={`fixed top-20 right-6 z-[9999] px-6 py-3 font-subheading uppercase tracking-widest text-sm border ${toastMessage.type === 'acid' ? 'bg-surface-2 border-acid text-acid' : 'bg-surface-2 border-fire text-fire'}`}
          >
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-5xl text-text-0 leading-none">MANAGE EVENTS</h1>
          <p className="font-subheading text-acid uppercase tracking-widest mt-2">{events.length} EVENTS RECORDED</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" size={14} />
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-surface-1 border border-border text-text-0 pl-10 pr-4 py-2 font-mono text-xs w-64 focus:border-acid focus:outline-none placeholder-text-2" />
          </div>
          <button onClick={() => handleOpenModal()} className="bg-acid text-void font-subheading font-bold uppercase tracking-widest px-6 py-2 hover:shadow-acid-glow transition-shadow">POST EVENT +</button>
        </div>
      </div>

      <div className="bg-surface-1 border border-border flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 text-center">
            <h3 className="font-heading text-4xl text-text-2 mb-2">NO EVENTS YET</h3>
            <button onClick={() => handleOpenModal()} className="border border-acid text-acid font-subheading uppercase tracking-widest px-6 py-2 hover:bg-acid-dim mt-4">POST FIRST EVENT +</button>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredEvents.map(event => (
              <div key={event.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border-b border-border hover:bg-surface-2 transition-colors">
                
                <div className="w-20 h-12 shrink-0 bg-surface-2 border border-border overflow-hidden">
                  {event.banner_image ? (
                    <img src={event.banner_image} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-subheading text-text-2 text-xs">NO IMG</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-subheading font-bold text-text-0 uppercase truncate text-lg">{event.title}</h4>
                    <span className={`font-mono text-[10px] px-2 py-0.5 leading-tight
                      ${event.status === 'UPCOMING' ? 'bg-acid text-void' : event.status === 'ONGOING' ? 'bg-fire text-void' : 'bg-surface-2 border border-text-1 text-text-1'}`}
                    >
                      {event.status}
                    </span>
                    {event.game && <span className="bg-ice-dim text-ice font-mono text-[10px] px-2 py-0.5 border border-ice/20">{event.game}</span>}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-text-2 text-[10px]">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:border-l border-border/50 md:pl-4 mt-2 md:mt-0">
                  <button onClick={() => handleOpenModal(event)} className="flex-1 md:flex-none text-center border border-acid text-acid hover:shadow-acid-glow font-subheading uppercase text-[10px] px-4 py-2">EDIT</button>
                  <button onClick={() => { setSelectedEvent(event); setIsDeleteModalOpen(true); }} className="flex-1 md:flex-none text-center border border-fire text-fire hover:shadow-fire-glow font-subheading uppercase text-[10px] px-4 py-2">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ━━━ ADD / EDIT MODAL ━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-surface-1 border border-border-bright flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface-2 shrink-0">
                <h2 className="font-heading text-3xl text-text-0 leading-none">{selectedEvent ? 'EDIT EVENT' : 'POST EVENT'}</h2>
                <button onClick={handleCloseModal} className="text-text-1 hover:text-fire"><FaTimes size={20} /></button>
              </div>
              <div className="w-full h-[1px] bg-acid opacity-30" />

              <div className="p-6 overflow-y-auto flex-1 font-body custom-scrollbar">
                <form id="event-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Banner Upload Zone */}
                  <div className="flex flex-col items-center w-full">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <div onClick={() => fileInputRef.current?.click()} className={`w-full max-w-2xl aspect-video border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors group ${bannerPreview ? 'border-acid clear' : 'border-border-bright hover:border-acid'}`}>
                      {bannerPreview ? (
                        <div className="relative w-full h-full">
                          <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100" />
                          <div className="absolute inset-0 bg-void/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-acid font-subheading text-xs">CHANGE PHOTO</div>
                        </div>
                      ) : (
                        <><FaCamera className="text-acid text-3xl mb-2" /><span className="font-subheading text-acid text-xs">UPLOAD 16:9 BANNER</span></>
                      )}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase">TITLE *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase">DESCRIPTION *</label>
                    <textarea rows={5} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-surface-2 border border-border text-text-0 p-3 font-body focus:border-acid focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-subheading text-text-1 text-[10px] uppercase">GAME</label>
                      <input type="text" value={formData.game} onChange={e => setFormData({...formData, game: e.target.value})} placeholder="e.g. Valorant" className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-subheading text-text-1 text-[10px] uppercase">EVENT TYPE *</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {eventTypes.map(t => (
                          <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`px-3 py-1 font-subheading text-xs tracking-widest ${formData.type === t ? 'bg-acid text-void' : 'bg-surface-2 border border-border text-text-1 hover:border-text-1'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                       <label className="font-subheading text-text-1 text-[10px] uppercase">DATE *</label>
                       <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="font-subheading text-text-1 text-[10px] uppercase">TIME</label>
                       <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                       <label className="font-subheading text-text-1 text-[10px] uppercase">VENUE</label>
                       <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Offline/Online/Room 101" className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="font-subheading text-text-1 text-[10px] uppercase">PRIZE POOL</label>
                       <input type="text" value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} placeholder="e.g. ₹5000" className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase">REGISTRATION LINK</label>
                    <input type="url" value={formData.registrationLink} onChange={e => setFormData({...formData, registrationLink: e.target.value})} placeholder="https://forms.gle/..." className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase">TAGS (COMMA SEPARATED)</label>
                    <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="Esports, Internal, 5v5" className="bg-surface-2 border border-border text-text-0 p-3 font-mono focus:border-acid focus:outline-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase">STATUS *</label>
                    <div className="flex flex-wrap gap-2 pt-1 border border-border p-3 bg-surface-2">
                      {eventStatuses.map(s => (
                        <button key={s} type="button" onClick={() => setFormData({...formData, status: s})} 
                          className={`px-4 py-2 font-subheading text-xs tracking-widest transition-all ${
                            formData.status === s && s === 'UPCOMING' ? 'bg-acid text-void' : 
                            formData.status === s && s === 'ONGOING' ? 'bg-fire text-void' : 
                            formData.status === s && s === 'COMPLETED' ? 'bg-surface-1 border border-text-1 text-text-0' :
                            'bg-void border border-border text-text-1 hover:border-text-1'
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-border bg-surface-2 shrink-0 flex justify-end gap-4">
                <button type="button" onClick={handleCloseModal} className="border border-border text-text-1 font-subheading px-8 py-3 hover:bg-surface-3">CANCEL</button>
                <button type="submit" form="event-form" disabled={formLoading} className="bg-acid text-void font-subheading font-bold px-8 py-3 hover:shadow-acid-glow flex items-center gap-2">
                  {formLoading ? 'SAVING...' : 'SAVE EVENT'}
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
              <h3 className="font-heading text-3xl text-text-0 mb-2">DELETE EVENT?</h3>
              <p className="font-body text-text-1 text-sm mb-8">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 border border-border text-text-1 font-subheading py-3 hover:bg-surface-2">CANCEL</button>
                <button onClick={confirmDelete} className="flex-1 bg-fire text-void font-subheading hover:shadow-fire-glow py-3">DELETE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageEvents;
