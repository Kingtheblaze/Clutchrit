// src/pages/admin/ManageMembers.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaDiscord, FaCamera, FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import api from '../../services/api';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', role: '', year: '1st Year', branch: '',
    bio: '', instagram: '', linkedin: '', discord: '',
    isExecutive: false, order: 99
  });
  const [selectedGames, setSelectedGames] = useState([]);
  const [customGame, setCustomGame] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fileInputRef = useRef(null);
  const availableGames = ['Valorant', 'BGMI', 'Minecraft', 'Free Fire', 'Chess'];

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members');
      let data = res.data;
      if (!Array.isArray(data)) data = [];
      data.sort((a, b) => (a.order || 99) - (b.order || 99));
      setMembers(data);
    } catch (err) {
      console.error(err);
      showToast('FAILED TO FETCH MEMBERS', 'fire');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const showToast = (msg, type = 'acid') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ━━━ FORM HANDLERS ━━━━━━━━━━━━━━━━━━━━━━━━━

  const resetForm = () => {
    setFormData({
      name: '', role: '', year: '1st Year', branch: '',
      bio: '', instagram: '', linkedin: '', discord: '',
      isExecutive: false, order: 99
    });
    setSelectedGames([]);
    setCustomGame('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormErrors({});
    setSelectedMember(null);
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setSelectedMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || '',
        year: member.year || '1st Year',
        branch: member.branch || '',
        bio: member.bio || '',
        instagram: member.socials?.instagram || '',
        linkedin: member.socials?.linkedin || '',
        discord: member.socials?.discord || '',
        isExecutive: member.isExecutive || false,
        order: member.order || 99
      });
      setSelectedGames(member.games || []);
      setPhotoPreview(member.photo || null);
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
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const toggleGame = (game) => {
    if (selectedGames.includes(game)) {
      setSelectedGames(selectedGames.filter(g => g !== game));
    } else {
      setSelectedGames([...selectedGames, game]);
    }
  };

  const addCustomGame = (e) => {
    if (e.key === 'Enter' && customGame.trim() !== '') {
      e.preventDefault();
      if (!selectedGames.includes(customGame.trim())) {
        setSelectedGames([...selectedGames, customGame.trim()]);
      }
      setCustomGame('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Req UIRED';
    if (!formData.role.trim()) errors.role = 'REQUIRED';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setFormLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('year', formData.year);
      data.append('branch', formData.branch);
      data.append('bio', formData.bio);
      data.append('isExecutive', formData.isExecutive);
      data.append('order', formData.order);
      data.append('games', JSON.stringify(selectedGames));
      data.append('socials', JSON.stringify({
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        discord: formData.discord
      }));
      
      if (photoFile) {
        data.append('photo', photoFile);
      }

      if (selectedMember) {
        await api.put(`/members/${selectedMember.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('MEMBER UPDATED ✓');
      } else {
        await api.post('/members', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('MEMBER ADDED ✓');
      }
      
      fetchMembers();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'ERROR SAVING MEMBER', 'fire');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    try {
      await api.delete(`/members/${selectedMember.id}`);
      showToast('MEMBER DELETED ✓', 'fire');
      fetchMembers();
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    } catch (err) {
      showToast('FAILED TO DELETE', 'fire');
    }
  };

  // ━━━ RENDER HELPERS ━━━━━━━━━━━━━━━━━━━━━━━

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-void">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '100%' }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: '100%' }}
            className={`fixed top-20 right-6 z-[9999] px-6 py-3 font-subheading uppercase tracking-widest text-sm border
              ${toastMessage.type === 'acid' ? 'bg-surface-2 border-acid text-acid' : 'bg-surface-2 border-fire text-fire'}
            `}
          >
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-5xl text-text-0 leading-none">MANAGE ROSTER</h1>
          <p className="font-subheading text-acid uppercase tracking-widest mt-2">
            {members.length} MEMBERS
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" size={14} />
            <input 
              type="text" 
              placeholder="Search roster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-1 border border-border text-text-0 pl-10 pr-4 py-2 font-mono text-xs w-64 focus:border-acid focus:outline-none placeholder-text-2"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-acid text-void font-subheading font-bold uppercase tracking-widest px-6 py-2 hover:shadow-acid-glow transition-shadow"
          >
            ADD MEMBER +
          </button>
        </div>
      </div>

      {/* Member List */}
      <div className="bg-surface-1 border border-border flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 text-center">
            <h3 className="font-heading text-4xl text-text-2 mb-2">NO MEMBERS YET</h3>
            <p className="font-body text-text-1 mb-6">Add your first member to start building the roster</p>
            <button 
              onClick={() => handleOpenModal()}
              className="border border-acid text-acid font-subheading uppercase tracking-widest px-6 py-2 hover:bg-acid-dim transition-colors"
            >
              ADD FIRST MEMBER +
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredMembers.map(member => (
              <div key={member.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border-b border-border hover:bg-surface-2 transition-colors">
                
                <div className="w-14 h-14 shrink-0 bg-surface-2 border border-border overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-heading text-acid text-xl">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-subheading font-bold text-text-0 uppercase truncate text-lg">{member.name}</h4>
                    <span className="bg-acid-dim text-acid font-mono text-[10px] px-2 py-0.5 leading-tight">{member.role}</span>
                    {member.isExecutive && (
                      <span className="text-fire font-subheading uppercase text-[10px] tracking-widest flex items-center gap-1">
                        ★ EXEC
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-body text-text-2 text-xs">
                    <span>{member.year}</span>
                    <span className="text-border-bright">•</span>
                    <span className="truncate">{member.branch}</span>
                  </div>
                </div>

                {/* Games */}
                <div className="hidden lg:flex gap-1 overflow-x-auto w-48 shrink-0 scrollbar-hide py-1 px-4 border-l border-border/50">
                  {(member.games || []).map((g, i) => (
                    <span key={i} className="text-xs bg-void border border-border px-1.5 py-0.5 whitespace-nowrap" title={g}>🎮 {g}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:border-l border-border/50 md:pl-4 mt-2 md:mt-0">
                  <button 
                    onClick={() => handleOpenModal(member)}
                    className="flex-1 md:flex-none text-center border border-acid text-acid hover:shadow-acid-glow font-subheading uppercase tracking-widest text-[10px] px-4 py-2 transition-all"
                  >
                    EDIT
                  </button>
                  <button 
                    onClick={() => { setSelectedMember(member); setIsDeleteModalOpen(true); }}
                    className="flex-1 md:flex-none text-center border border-fire text-fire hover:shadow-fire-glow font-subheading uppercase tracking-widest text-[10px] px-4 py-2 transition-all"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="p-12 text-center text-text-2 font-mono">No matches found.</div>
            )}
          </div>
        )}
      </div>

      {/* ━━━ ADD / EDIT MODAL ━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-surface-1 border border-border-bright flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface-2 shrink-0">
                <h2 className="font-heading text-3xl text-text-0 leading-none">
                  {selectedMember ? 'EDIT MEMBER' : 'ADD MEMBER'}
                </h2>
                <button onClick={handleCloseModal} className="text-text-1 hover:text-fire transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="w-full h-[1px] bg-acid opacity-30" />

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 font-body custom-scrollbar">
                <form id="member-form" onSubmit={handleSubmit} className="flex flex-col gap-8">
                  
                  {/* Photo Upload Zone */}
                  <div className="flex flex-col items-center">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-40 h-40 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group
                        ${photoPreview ? 'border-acid clear' : 'border-border-bright hover:border-acid'}
                      `}
                    >
                      {photoPreview ? (
                        <div className="relative w-full h-full">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all" />
                          <div className="absolute inset-0 bg-void/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-acid font-subheading text-xs tracking-widest">
                            CHANGE
                          </div>
                        </div>
                      ) : (
                        <>
                          <FaCamera className="text-acid text-3xl mb-2" />
                          <span className="font-subheading text-acid text-xs tracking-widest text-center">UPLOAD PHOTO</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">NAME *</label>
                      <input 
                        type="text" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className={`bg-surface-2 border text-text-0 p-3 font-mono text-sm focus:outline-none transition-colors ${formErrors.name ? 'border-fire' : 'border-border focus:border-acid'}`}
                      />
                      {formErrors.name && <span className="text-fire text-[10px] font-mono mt-1">{formErrors.name}</span>}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">ROLE *</label>
                      <input 
                        type="text" required
                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                        className={`bg-surface-2 border text-text-0 p-3 font-mono text-sm focus:outline-none transition-colors ${formErrors.role ? 'border-fire' : 'border-border focus:border-acid'}`}
                        placeholder="e.g. Valorant Core"
                      />
                      {formErrors.role && <span className="text-fire text-[10px] font-mono mt-1">{formErrors.role}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">YEAR</label>
                      <select 
                        value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}
                        className="bg-surface-2 border border-border text-text-0 p-3 font-mono text-sm focus:border-acid focus:outline-none cursor-pointer"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>Alumni</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">BRANCH</label>
                      <input 
                        type="text"
                        value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}
                        className="bg-surface-2 border border-border text-text-0 p-3 font-mono text-sm focus:border-acid focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Toggles & Numbers */}
                  <div className="p-4 border border-border bg-surface-2 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <span className="font-subheading text-text-1 text-xs uppercase tracking-widest">EXECUTIVE MEMBER</span>
                      {/* Custom Toggle */}
                      <div 
                        className={`w-12 h-6 flex items-center p-1 cursor-pointer transition-colors duration-300 ${formData.isExecutive ? 'bg-acid' : 'bg-surface-1 border border-border'}`}
                        onClick={() => setFormData({...formData, isExecutive: !formData.isExecutive})}
                      >
                        <motion.div 
                          className="w-4 h-4 bg-void"
                          animate={{ x: formData.isExecutive ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <label className="font-subheading text-text-1 text-xs uppercase tracking-widest">DISPLAY ORDER</label>
                      <input 
                        type="number" min="1" max="999"
                        value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})}
                        className="bg-surface-1 border border-border text-text-0 p-2 font-mono text-sm focus:border-acid focus:outline-none w-20 text-center"
                      />
                    </div>
                  </div>

                  {/* Games Select */}
                  <div className="flex flex-col gap-3">
                    <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">GAMES PLAYED</label>
                    <div className="flex flex-wrap gap-2">
                      {availableGames.map(game => (
                        <button
                          key={game} type="button"
                          onClick={() => toggleGame(game)}
                          className={`px-4 py-1.5 font-subheading uppercase text-xs tracking-widest transition-colors
                            ${selectedGames.includes(game) 
                              ? 'bg-acid text-void' 
                              : 'bg-transparent border border-border text-text-1 hover:border-text-1'}
                          `}
                        >
                          {game} {selectedGames.includes(game) && '✓'}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-subheading text-text-2 text-[10px] uppercase">OTHER:</span>
                      <input 
                        type="text" value={customGame}
                        onChange={e => setCustomGame(e.target.value)}
                        onKeyDown={addCustomGame}
                        placeholder="Type + Enter"
                        className="bg-surface-2 border border-border text-text-0 px-3 py-1 font-mono text-xs focus:border-acid focus:outline-none w-48"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedGames.filter(g => !availableGames.includes(g)).map(g => (
                         <div key={g} className="bg-surface-2 border border-border px-3 py-1 flex items-center gap-2">
                           <span className="font-mono text-xs text-text-0">{g}</span>
                           <button type="button" onClick={() => toggleGame(g)} className="text-fire hover:text-fire-dim"><FaTimes size={10} /></button>
                         </div>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-2">
                    <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">BIO</label>
                    <textarea 
                      rows={4}
                      value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                      maxLength={200}
                      className="bg-surface-2 border border-border text-text-0 p-3 font-body text-sm focus:border-acid focus:outline-none resize-none"
                      placeholder="Write a short bio about this member..."
                    />
                    <div className="text-right font-mono text-text-2 text-[10px] mt-1">
                      {formData.bio.length} / 200
                    </div>
                  </div>

                  {/* Socials */}
                  <div>
                    <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest mb-3 block">SOCIAL MEDIA (OPTIONAL)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex bg-surface-2 border border-border focus-within:border-acid transition-colors">
                        <div className="w-10 bg-acid-dim flex items-center justify-center text-acid border-r border-border"><FaInstagram size={16} /></div>
                        <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} placeholder="Username" className="bg-transparent text-text-0 p-2 text-xs font-mono w-full focus:outline-none" />
                      </div>
                      <div className="flex bg-surface-2 border border-border focus-within:border-acid transition-colors">
                        <div className="w-10 bg-acid-dim flex items-center justify-center text-acid border-r border-border"><FaLinkedin size={16} /></div>
                        <input type="text" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="Profile URL" className="bg-transparent text-text-0 p-2 text-xs font-mono w-full focus:outline-none" />
                      </div>
                      <div className="flex bg-surface-2 border border-border focus-within:border-acid transition-colors">
                        <div className="w-10 bg-acid-dim flex items-center justify-center text-acid border-r border-border"><FaDiscord size={16} /></div>
                        <input type="text" value={formData.discord} onChange={e => setFormData({...formData, discord: e.target.value})} placeholder="DiscordTag#1234" className="bg-transparent text-text-0 p-2 text-xs font-mono w-full focus:outline-none" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-surface-2 shrink-0 flex justify-end gap-4">
                <button 
                  type="button" onClick={handleCloseModal}
                  className="border border-border text-text-1 font-subheading uppercase tracking-widest px-8 py-3 hover:bg-surface-3 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" form="member-form" disabled={formLoading}
                  className="bg-acid text-void font-subheading font-bold uppercase tracking-widest px-8 py-3 hover:shadow-acid-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {formLoading ? (
                    <><div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" /> SAVING...</>
                  ) : 'SAVE MEMBER'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ━━━ DELETE CONFIRMATION MODAL ━━━━━━━━━━━━ */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-void/90 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface-1 border-t-4 border-fire p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <h3 className="font-heading text-3xl text-text-0 mb-2">DELETE {selectedMember?.name}?</h3>
              <p className="font-body text-text-1 text-sm mb-8">This action cannot be undone. Root clearance required.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 border border-border text-text-1 font-subheading py-3 hover:bg-surface-2 transition-colors">CANCEL</button>
                <button onClick={confirmDelete} className="flex-1 bg-fire text-void font-subheading hover:shadow-fire-glow py-3 transition-all">DELETE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageMembers;
