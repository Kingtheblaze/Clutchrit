// server/scripts/seedAdmin.js
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const seedAdmin = async () => {
  const username = 'clutchrit_admin';
  const password = 'ChangeMe@123';
  const role = 'superadmin';

  try {
    // Check if admin already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (existingUser) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          password: hashedPassword,
          role
        }
      ])
      .select();

    if (error) throw error;

    console.log('Admin user seeded successfully!');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
