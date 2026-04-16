// server/controllers/inviteController.js
const supabase = require('../config/db');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// @desc    Generate and send invite code
// @route   POST /api/invites/send
// @access  Private/Admin
const sendInvite = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // 1. Generate a random 8-character code
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // 2. Set expiration (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 3. Store in Supabase
    const { data, error } = await supabase
      .from('invites')
      .insert([
        {
          email,
          code: inviteCode,
          expires_at: expiresAt,
          is_used: false
        }
      ])
      .select()
      .single();

    if (error) {
           // Handle unique constraint violation (email already invited)
           if (error.code === '23505') {
             // Update existing invite with new code
             const { error: updateError } = await supabase
               .from('invites')
               .update({ code: inviteCode, expires_at: expiresAt, is_used: false })
               .eq('email', email);
             
             if (updateError) throw updateError;
           } else {
             throw error;
           }
    }

    // 4. Send Email
    const message = `You have been invited to join the ClutchRIT Admin Terminal.\n\nYour Invite Code: ${inviteCode}\n\nThis code expires in 24 hours. Register at: https://clutchrit.vercel.app/register`;
    
    const html = `
      <div style="font-family: monospace; background-color: #0a0a0a; color: #00ff00; padding: 20px; border: 1px solid #00ff00;">
        <h2 style="color: #00ff00; border-bottom: 1px solid #00ff00; padding-bottom: 10px;">CLUTCHRIT // ACCESS GRANTED</h2>
        <p>You have been recruited as a new admin node.</p>
        <p style="font-size: 24px; font-weight: bold; background-color: #1a1a1a; padding: 10px; display: inline-block;">
          INVITE CODE: ${inviteCode}
        </p>
        <p>This code will expire in 24 hours.</p>
        <p>Navigate to the terminal recruitment link to initialize your node:</p>
        <a href="https://clutchrit.vercel.app/register" style="color: #00ff00; text-decoration: underline;">INITIALIZE NODE -></a>
      </div>
    `;

    await sendEmail({
      email,
      subject: 'CLUTCHRIT // Admin Recruitment Invitation',
      message,
      html
    });

    res.status(200).json({ success: true, message: 'Invite sent successfully' });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ message: 'Failed to send invite' });
  }
};

module.exports = { sendInvite };
