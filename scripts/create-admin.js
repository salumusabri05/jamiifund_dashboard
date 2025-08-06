//:\Users\Administrator\Desktop\JAMIIFUND DASHBOARD\dashboard\scripts\create-admin.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateSalt, hashPassword } = require('../src/lib/auth-utils');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Admin details
const admin = {
  email: 'salumusabri05@gmail.com',
  password: 'Jamiifund', // Change this to a secure password
  full_name: 'JAMIIFUND Admin',
  role: 'super_admin'
};

async function createAdmin() {
  try {
    // Generate salt and hash the password
    const salt = generateSalt();
    const passwordHash = hashPassword(admin.password, salt);
    
    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .eq('email', admin.email.toLowerCase())
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingAdmin) {
      console.log(`Admin with email ${admin.email} already exists.`);
      process.exit(0);
    }
    
    // Insert admin into the database
    const { data, error } = await supabase
      .from('admins')
      .insert({
        email: admin.email.toLowerCase(),
        password_hash: passwordHash,
        salt: salt,
        full_name: admin.full_name,
        role: admin.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log('Admin created successfully:');
    console.log(`ID: ${data.id}`);
    console.log(`Email: ${data.email}`);
    console.log(`Role: ${data.role}`);
    console.log('\nYou can now log in with:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${admin.password}`);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();