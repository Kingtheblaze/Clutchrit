// server/controllers/eventController.js
const supabase = require('../config/db');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  const { status, game } = req.query;

  try {
    let query = supabase.from('events').select('*').order('date', { ascending: true });

    if (status) query = query.eq('status', status);
    if (game) query = query.eq('game', game);

    const { data: events, error } = await query;

    if (error) throw error;

    res.json(events);
  } catch (err) {
    console.error('GetEvents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error('GetEventById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, game, eventType, date, time, venue, registrationLink, prizePool, tags } = req.body;
    let bannerImage = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'events');
      bannerImage = result.secure_url;
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          description,
          game,
          event_type: eventType,
          date,
          time,
          venue,
          registration_link: registrationLink,
          prize_pool: prizePool,
          tags: tags ? JSON.parse(tags) : [],
          banner_image: bannerImage,
          posted_by: req.user ? req.user.id : null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(event);
  } catch (err) {
    console.error('CreateEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const { title, description, game, eventType, date, time, venue, registrationLink, status, prizePool, tags } = req.body;
    
    // Get existing event
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let bannerImage = existingEvent.banner_image;

    if (req.file) {
      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer, 'events');
      bannerImage = result.secure_url;
      // Optional: Delete old image from Cloudinary if needed
    }

    const { data: event, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        game,
        event_type: eventType,
        date,
        time,
        venue,
        registration_link: registrationLink,
        status,
        prize_pool: prizePool,
        tags: tags ? JSON.parse(tags) : existingEvent.tags,
        banner_image: bannerImage
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(event);
  } catch (err) {
    console.error('UpdateEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Event removed' });
  } catch (err) {
    console.error('DeleteEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
