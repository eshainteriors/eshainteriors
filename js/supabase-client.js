// Supabase Configuration
const SUPABASE_URL = 'https://ftndifzxnqwlotblgnpq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bmRpZnp4bnF3bG90YmxnbnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODYxMzMsImV4cCI6MjA5MjE2MjEzM30.tVmk32SyIR7zul8SfZv_2DUtxLK0m8kbNEmjgKHp6io';

// Initialize Supabase (optional - used for direct client-side operations)
// For production, we recommend using Edge Functions for secure form submissions

const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
};

// Helper function to submit consultation form
async function submitConsultationToSupabase(formData) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        budget: formData.budget,
        city: formData.city,
        vision: formData.vision,
        status: 'new',
        created_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Supabase submission error:', error);
    throw error;
  }
}

// Helper function to submit contact form
async function submitContactToSupabase(formData) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'new',
        created_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Supabase submission error:', error);
    throw error;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    supabaseConfig,
    submitConsultationToSupabase,
    submitContactToSupabase
  };
}
