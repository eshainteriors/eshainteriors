// Netlify Function: Submit Consultation Form
// Submits consultation form data to Supabase and sends email notifications

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper to send email (using Resend.dev or SendGrid)
async function sendEmail(to, subject, html) {
  try {
    // Option 1: Using Resend (recommended, free tier available)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'noreply@eshainteriors.com',
          to: to,
          subject: subject,
          html: html
        })
      });
      return response.ok;
    }

    // Option 2: Using SendGrid
    // if (process.env.SENDGRID_API_KEY) {
    //   // Implement SendGrid logic
    // }

    console.log(`Email would be sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK'
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.name || !data.phone || !data.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Insert into Supabase
    const { data: inserted, error } = await supabase
      .from('consultations')
      .insert([{
        name: data.name,
        phone: data.phone,
        email: data.email,
        service: data.service || 'Not specified',
        budget: data.budget || 'Not specified',
        city: data.city || 'Not specified',
        vision: data.vision || '',
        status: 'new',
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save consultation' })
      };
    }

    // Send confirmation email to customer
    const customerEmail = `
      <h2>Thank you for your interest, ${data.name}!</h2>
      <p>We received your consultation request for <strong>${data.service}</strong>.</p>
      <p>Our team will review your details and contact you within 24 hours.</p>
      <hr>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Budget Range:</strong> ${data.budget}</p>
      <p><strong>Location:</strong> ${data.city}</p>
      <p style="color: #999; font-size: 12px;">Esha Interiors | hello@eshainteriors.com | +91 98765 43210</p>
    `;

    await sendEmail(
      data.email,
      'Consultation Request Received - Esha Interiors',
      customerEmail
    );

    // Send admin notification
    const adminEmail = `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>City:</strong> ${data.city}</p>
      <p><strong>Vision:</strong> ${data.vision}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p><a href="https://your-supabase-url.com/consultations">View in Dashboard</a></p>
    `;

    await sendEmail(
      process.env.ADMIN_EMAIL || 'hello@eshainteriors.com',
      'New Consultation Request - Esha Interiors',
      adminEmail
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Consultation request submitted successfully',
        id: inserted?.[0]?.id
      })
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
