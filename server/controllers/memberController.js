// server/controllers/memberController.js
const supabase = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getMembers = async (req, res) => {
  try {
    const { data: members, error } = await supabase
      .from('members')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    res.json(members);
  } catch (err) {
    console.error('GetMembers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
const getMemberById = async (req, res) => {
  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (err) {
    console.error('GetMemberById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add member
// @route   POST /api/members
// @access  Private/Admin
const createMember = async (req, res) => {
  try {
    const { name, role, year, branch, games, bio, instagram, linkedin, discord, isExecutive, order } = req.body;
    let photo = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'members');
      photo = result.secure_url;
    }

    const { data: member, error } = await supabase
      .from('members')
      .insert([
        {
          name,
          role,
          year,
          branch,
          games: games ? JSON.parse(games) : [],
          bio,
          socials: { instagram, linkedin, discord },
          is_executive: isExecutive === 'true',
          "order": parseInt(order) || 0,
          photo
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(member);
  } catch (err) {
    console.error('CreateMember error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = async (req, res) => {
  try {
    const { name, role, year, branch, games, bio, instagram, linkedin, discord, isExecutive, order } = req.body;

    const { data: existingMember, error: fetchError } = await supabase
      .from('members')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existingMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    let photo = existingMember.photo;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'members');
      photo = result.secure_url;
    }

    const { data: member, error } = await supabase
      .from('members')
      .update({
        name,
        role,
        year,
        branch,
        games: games ? JSON.parse(games) : existingMember.games,
        bio,
        socials: { instagram, linkedin, discord },
        is_executive: isExecutive === 'true',
        "order": parseInt(order) || 0,
        photo
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(member);
  } catch (err) {
    console.error('UpdateMember error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private/Admin
const deleteMember = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error('DeleteMember error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMembers, getMemberById, createMember, updateMember, deleteMember };
