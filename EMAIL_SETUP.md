# Email Notification Setup Guide

This guide will help you set up email notifications for form submissions.

## 📧 Email Service: Resend

We're using [Resend](https://resend.com) for sending emails. It's free for up to 3,000 emails/month.

---

## 🚀 Setup Steps

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up with your email (or GitHub)
3. Verify your email address

### Step 2: Get Your API Key

1. Log in to [Resend Dashboard](https://resend.com/home)
2. Click on **API Keys** in the sidebar
3. Click **Create API Key**
4. Name it: `Esha Interiors Production`
5. Copy the API key (starts with `re_`)
6. **Save it securely** - you won't see it again!

### Step 3: Set Up Domain (Optional but Recommended)

**Option A: Use Your Own Domain** (Recommended)
1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain: `eshainteriors.com`
4. Add the DNS records they provide to your domain registrar
5. Wait for verification (usually 5-10 minutes)
6. Emails will be sent from: `notifications@eshainteriors.com`

**Option B: Use Resend's Test Domain** (Quick Start)
- Emails will be sent from: `onboarding@resend.dev`
- Limited to 100 emails/day
- May end up in spam folder

### Step 4: Configure Netlify Environment Variables

1. Go to your [Netlify Dashboard](https://app.netlify.com)
2. Select your site (eshainteriors)
3. Go to **Site Configuration** → **Environment Variables**
4. Add the following variables:

```
SUPABASE_URL = https://ftndifzxnqwlotblgnpq.supabase.co
SUPABASE_SERVICE_KEY = [Get from Supabase Dashboard → Settings → API]
RESEND_API_KEY = [Your Resend API key from Step 2]
ADMIN_EMAIL = eshainteriors1@gmail.com
```

### Step 5: Get Supabase Service Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ftndifzxnqwlotblgnpq`
3. Go to **Settings** → **API**
4. Copy the **service_role** key (NOT the anon key)
5. Add it to Netlify environment variables

### Step 6: Deploy to Netlify

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add email notifications"
   git push
   ```

2. Netlify will automatically deploy
3. Or manually deploy via Netlify dashboard

---

## ✅ Testing

After deployment:

1. Visit your live site
2. Fill out a consultation or contact form
3. Check `eshainteriors1@gmail.com` for the notification email
4. Check spam folder if not in inbox

---

## 📧 Email Templates

### Consultation Request Email

You'll receive emails like this:

**Subject:** New Consultation Request - Full Home Design

**Body:**
```
New Consultation Request
Name: Priya Sharma
Phone: +91 98765 43210
Email: priya@example.com
Service: Full Home Design
Budget: ₹3L – ₹5L
City: Hyderabad
Vision: Looking to redesign my 3BHK apartment with modern interiors

Received: 5 Sep 2026, 8:30 PM IST
```

### Contact Message Email

**Subject:** New Contact Message - General Inquiry

**Body:**
```
New Contact Message
Name: Rajesh Kumar
Phone: +91 99999 88888
Email: rajesh@example.com
Subject: General Inquiry
Message: I would like to know more about your kitchen design packages...

Received: 5 Sep 2026, 8:45 PM IST
```

---

## 🔧 Troubleshooting

### Emails not arriving?

1. **Check Spam Folder** - Resend emails may initially go to spam
2. **Verify API Key** - Make sure it's correctly added to Netlify
3. **Check Netlify Logs** - Functions → [function name] → Logs
4. **Verify Domain** - If using custom domain, ensure DNS is verified
5. **Check Resend Dashboard** - See if emails were sent successfully

### Form submissions not working?

1. Check browser console for errors
2. Verify Supabase database tables exist
3. Check Netlify function logs for errors
4. Make sure environment variables are set

---

## 💰 Cost

- **Resend Free Tier**: 3,000 emails/month, 100 emails/day
- **Estimated Usage**: ~100-200 emails/month (3-7 leads/day)
- **Cost**: **FREE** ✅

---

## 🔐 Security Notes

- Never commit `.env` files to Git
- Use environment variables for all secrets
- Service role key has admin access - keep it secure
- Resend API key can send emails on your behalf - protect it

---

## 📞 Support

If you need help:
- Resend Support: [resend.com/support](https://resend.com/support)
- Netlify Support: [netlify.com/support](https://netlify.com/support)
- Supabase Support: [supabase.com/support](https://supabase.com/support)
