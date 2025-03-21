// Script to update the seller_profiles table schema
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSchema() {
  try {
    console.log('Checking current seller_profiles table...');
    
    // First check if the table exists and what columns it has
    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('seller_profiles table does not exist. Creating it from scratch.');
        await createSellerProfilesTable();
      } else {
        console.error('Error checking table:', error);
      }
      return;
    }
    
    console.log('seller_profiles table exists. Trying to update it.');
    await updateSellerProfilesTable();
    
  } catch (err) {
    console.error('Unhandled error:', err);
  }
}

// Function to create the seller_profiles table from scratch
async function createSellerProfilesTable() {
  console.log('Creating seller_profiles table...');
  
  try {
    // Drop table if it exists (to ensure a clean slate)
    await supabase.rpc('execute_sql', {
      sql: 'DROP TABLE IF EXISTS seller_profiles'
    }).catch(err => console.log('SQL execution error (expected if function not available):', err.message));
    
    // Alternative direct table creation (won't work with standard anon key permissions)
    console.log('Direct table creation not available. Please run the SQL script in the Supabase SQL editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  store_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  contact_email TEXT,
  payment_details JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);

-- Create a test seller profile
INSERT INTO seller_profiles (
  user_id,
  store_name,
  description,
  contact_email,
  is_verified
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Record Shop',
  'A test seller account for marketplace testing',
  'test@example.com',
  TRUE
);`);
    
    console.log('\nPlease run the above SQL in the Supabase SQL editor, then continue with testing.');
    
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Function to update the seller_profiles table if it exists but is missing columns
async function updateSellerProfilesTable() {
  console.log('Updating seller_profiles table...');
  
  try {
    // SQL to add missing columns
    const alterTableSql = `
      ALTER TABLE seller_profiles 
      ADD COLUMN IF NOT EXISTS store_name TEXT,
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS logo_url TEXT,
      ADD COLUMN IF NOT EXISTS contact_email TEXT,
      ADD COLUMN IF NOT EXISTS payment_details JSONB,
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `;
    
    // Attempt to execute the SQL (might not work with standard anon key permissions)
    await supabase.rpc('execute_sql', {
      sql: alterTableSql
    }).catch(err => console.log('SQL execution error (expected if function not available):', err.message));
    
    console.log('Direct table update not available. Please run the SQL script in the Supabase SQL editor:');
    console.log(alterTableSql);
    
    console.log('\nPlease run the above SQL in the Supabase SQL editor, then continue with testing.');
    
  } catch (err) {
    console.error('Error updating table:', err);
  }
}

// Run the script
updateSchema().then(() => {
  console.log('\nSchema update check completed.');
}); 