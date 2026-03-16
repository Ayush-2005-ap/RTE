const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// 1. Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    // 2. Connect to DB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // 3. Define admin details
    const adminEmail = 'admin@righttoeducation.in';
    const adminPassword = 'AdminPassword123!'; // User should change this later

    // 4. Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin with email ${adminEmail} already exists.`);
      
      // Optionally update role to admin if it wasn't
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user role to admin.');
      }
    } else {
      // 5. Create new admin
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      
      const admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        userType: 'other',
        isVerified: true,
        state: 'All India'
      });

      console.log('--- ADMIN CREATED ---');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log('---------------------');
      console.log('IMPORTANT: Please change this password after your first login.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
