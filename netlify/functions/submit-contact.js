// Netlify Function: Submit Contact Form
// Submits contact form data to Supabase and sends email notifications

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper to send email
async function sendEmail(to, subject, html) {
  try {
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
    console.log(`Email would be sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
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
    if (!data.name || !data.phone || !data.email || !data.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Insert into Supabase
    const { data: inserted, error } = await supabase
      .from('contacts')
      .insert([{
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.subject || 'General Inquiry',
        message: data.message,
        status: 'new',
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save message' })
      };
    }

    // Send confirmation email to customer
    const customerEmail = `
      <h2>Thank you for reaching out, ${data.name}!</h2>
      <p>We received your message and will get back to you within 24 hours.</p>
      <hr>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Your Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #999; font-size: 12px;">Esha Interiors | hello@eshainteriors.com | +91 98765 43210</p>
    `;

    await sendEmail(
      data.email,
      'Message Received - Esha Interiors',
      customerEmail
    );

    // Send admin notification
    const adminEmail = `
      <h2>New Contact Message</h2>
      <p><strong>From:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <h3>Message:</h3>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `;

    await sendEmail(
      process.env.ADMIN_EMAIL || 'hello@eshainteriors.com',
      `New Contact: ${data.subject} - Esha Interiors`,
      adminEmail
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Message sent successfully',
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
