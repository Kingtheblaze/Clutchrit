// server/controllers/announcementController.js
const supabase = require('../config/db');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(announcements);
  } catch (err) {
    console.error('GetAnnouncements error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
const getAnnouncementById = async (req, res) => {
  try {
    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (err) {
    console.error('GetAnnouncementById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, isPinned } = req.body;

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert([
        {
          title,
          content,
          type,
          is_pinned: isPinned || false,
          posted_by: req.user ? req.user.id : null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(announcement);
  } catch (err) {
    console.error('CreateAnnouncement error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, type, isPinned } = req.body;

    const { data: announcement, error } = await supabase
      .from('announcements')
      .update({ title, content, type, is_pinned: isPinned })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(announcement);
  } catch (err) {
    console.error('UpdateAnnouncement error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Announcement removed' });
  } catch (err) {
    console.error('DeleteAnnouncement error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement };
