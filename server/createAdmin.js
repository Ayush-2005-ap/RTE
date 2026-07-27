require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function createAdmin() {
  const email = 'admin@rte.in';
  const password = 'AdminPassword123!';
  const name = 'System Admin';

  console.log(`Creating admin user: ${email}...`);

  // 1. Create in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true // auto-verify
  });

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log('User already exists in Supabase. Attempting to promote to admin in Prisma...');
      const existingUsers = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.data.users.find(u => u.email === email);
      
      if (existingUser) {
        await upsertPrismaUser(existingUser.id, email, name);
      }
    } else {
      console.error('Error creating user in Supabase:', authError.message);
      process.exit(1);
    }
  } else {
    console.log('User created in Supabase Auth successfully.');
    await upsertPrismaUser(authData.user.id, email, name);
  }
}

async function upsertPrismaUser(id, email, name) {
  try {
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        role: 'admin',
        isVerified: true
      },
      create: {
        id: id,
        name: name,
        email: email,
        role: 'admin',
        isVerified: true,
        state: 'All India',
        userType: 'admin'
      }
    });
    console.log('Admin user created/updated in Prisma Database successfully!');
    console.log(`\n--- LOGIN DETAILS ---`);
    console.log(`Email:    admin@rte.in`);
    console.log(`Password: AdminPassword123!`);
    console.log(`---------------------\n`);
  } catch (err) {
    console.error('Error creating user in Prisma:', err);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
