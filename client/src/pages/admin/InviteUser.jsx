// src/pages/admin/InviteUser.jsx
import React, { useState } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const InviteUser = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await api.post('/invites/send', { email });
      setMessage(`SUCCESS: ACCESS CODE TRANSMITTED TO ${email.toUpperCase()}`);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'FAILED TO TRANSMIT ACCESS CODE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-text-0 mb-2">RECRUITMENT</h1>
        <p className="font-mono text-xs text-acid">GENERATE AND TRANSMIT ENCRYPTED ACCESS KEYS</p>
      </div>

      <div className="max-w-md bg-surface-1 border border-border p-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-acid" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-acid" />

        <form onSubmit={handleInvite} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">RECRUIT EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-2 border border-border text-text-0 p-[12px_16px] font-mono text-sm focus:border-acid focus:outline-none transition-colors"
              placeholder="recruit@service.node"
              required
            />
          </div>

          {message && (
            <div className="bg-acid/10 border border-acid/50 p-4 text-acid font-mono text-xs">
              {`> ${message}`}
            </div>
          )}

          {error && (
            <div className="bg-fire/10 border border-fire/50 p-4 text-fire font-mono text-xs">
              {`> ${error}`}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-acid text-void font-subheading font-bold uppercase tracking-widest py-4 hover:shadow-acid-glow transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'TRANSMITTING...' : 'SEND INVITATION →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border border-dashed text-text-2 font-mono text-[10px] uppercase">
          <p className="opacity-50">NOTICE: CODES ARE VALID FOR 24 HOURS. ONLY ONE NODE PER CODE.</p>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;
