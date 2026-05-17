# Supabase Integration Setup Guide

## Project Credentials
- **Supabase URL:** https://ftndifzxnqwlotblgnpq.supabase.co
- **Anon Key:** Configured in `js/supabase-client.js` and `.env.local`

## Step 1: Create Database Tables

Go to [Supabase Dashboard](https://app.supabase.com) and navigate to SQL Editor. Run the following SQL commands:

### Create Consultations Table

```sql
-- Create consultations table
CREATE TABLE consultations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  budget TEXT,
  city TEXT,
  vision TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_consultations_email ON consultations(email);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);
```

### Create Contacts Table

```sql
-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
```

## Step 2: Enable Row Level Security (RLS)

### For Consultations Table

```sql
-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submissions)
CREATE POLICY "allow_insert_consultations"
ON consultations
FOR INSERT
WITH CHECK (TRUE);

-- Allow authenticated users to view all
CREATE POLICY "allow_select_consultations"
ON consultations
FOR SELECT
USING (auth.role() = 'authenticated');

-- Prevent direct delete/update from client
CREATE POLICY "allow_update_consultations"
ON consultations
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

### For Contacts Table

```sql
-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submissions)
CREATE POLICY "allow_insert_contacts"
ON contacts
FOR INSERT
WITH CHECK (TRUE);

-- Allow authenticated users to view all
CREATE POLICY "allow_select_contacts"
ON contacts
FOR SELECT
USING (auth.role() = 'authenticated');

-- Prevent direct delete/update from client
CREATE POLICY "allow_update_contacts"
ON contacts
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

## Step 3: Verify Integration

1. **Local Testing:**
   - Visit http://127.0.0.1:8080
   - Fill out the "Book Consultation" form
   - Submit the form
   - Check Supabase dashboard > consultations table for new entry

2. **Check Supabase Dashboard:**
   - Go to https://app.supabase.com
   - Select your project
   - Navigate to "Tables" in the left sidebar
   - You should see `consultations` and `contacts` tables
   - Click on the table to view submitted data

## Step 4: Configure Netlify Environment Variables

When deploying to Netlify, add these environment variables:

1. Go to Netlify Dashboard > Your Site > Site Settings > Build & Deploy > Environment
2. Add:
   - **VITE_SUPABASE_URL:** `https://ftndifzxnqwlotblgnpq.supabase.co`
   - **VITE_SUPABASE_ANON_KEY:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bmRpZnp4bnF3bG90YmxnbnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODYxMzMsImV4cCI6MjA5MjE2MjEzM30.tVmk32SyIR7zul8SfZv_2DUtxLK0m8kbNEmjgKHp6io`

## Step 5: View Your Data

- **Consultations:** https://app.supabase.com > Your Project > Tables > consultations
- **Contact Form Submissions:** https://app.supabase.com > Your Project > Tables > contacts

## Troubleshooting

### "401 Unauthorized" Error
- Check that your Anon Key is correct
- Verify RLS policies are set to allow inserts

### "Table does not exist" Error
- Ensure you've created the tables using the SQL scripts above
- Verify the table names match exactly (lowercase)

### Forms Not Submitting
- Open browser DevTools (F12) > Console
- Check for error messages
- Verify Supabase credentials are correct in `supabase-client.js`

## API Endpoints Being Used

The website uses Supabase REST API:
- **Consultations:** `POST https://ftndifzxnqwlotblgnpq.supabase.co/rest/v1/consultations`
- **Contacts:** `POST https://ftndifzxnqwlotblgnpq.supabase.co/rest/v1/contacts`

Both require:
- `Content-Type: application/json`
- `apikey` header with your Anon Key
- `Authorization` header with Bearer token
