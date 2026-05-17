# Esha Interiors — Production Deployment Guide

This guide walks you through deploying the Esha Interiors website to production with full backend integration, email notifications, and admin dashboard.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Email service account (Resend, SendGrid, or similar)
- [ ] Netlify account created
- [ ] Custom domain purchased (optional but recommended)
- [ ] Google Analytics account (optional)

---

## 🔧 Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Organization**: Create or select existing
   - **Project Name**: esha-interiors
   - **Database Password**: Generate secure password
   - **Region**: Choose nearest to your users (India - recommended)
4. Click "Create new project"
5. Wait for initialization (2-3 minutes)

### 1.2 Get Your Credentials

1. Go to **Settings > API**
2. Copy these values (save in `.env.local`):
   - **Project URL**: `https://[your-project].supabase.co`
   - **Anon Key**: Public key for frontend
   - **Service Role Key**: Private key for server-side (keep secret!)

### 1.3 Create Database Tables

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste this SQL and run:

```sql
-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT DEFAULT 'Not specified',
  budget TEXT DEFAULT 'Not specified',
  city TEXT DEFAULT 'Not specified',
  vision TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table (for portfolio management)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  price TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX consultations_status_idx ON consultations(status);
CREATE INDEX consultations_email_idx ON consultations(email);
CREATE INDEX contacts_status_idx ON contacts(status);
CREATE INDEX projects_category_idx ON projects(category);
CREATE INDEX projects_featured_idx ON projects(featured);

-- Enable Row Level Security (RLS)
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public insert, authenticated read)
CREATE POLICY "Allow public insert on consultations"
  ON consultations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert on contacts"
  ON contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read on projects"
  ON projects FOR SELECT
  WITH CHECK (true);
```

### 1.4 Set Up Storage (Optional - for admin image uploads)

1. Go to **Storage**
2. Click **New Bucket**
3. Create buckets:
   - `project-images` (public)
   - `client-uploads` (private)
4. Configure CORS:
   - Go to Bucket Settings
   - Add CORS origins: `*` (or your domain)

---

## 📧 Step 2: Set Up Email Service

### Option A: Resend (Recommended - Free Tier)

1. Go to [resend.com](https://resend.com)
2. Sign up and create account
3. Add domain:
   - Go to **Domains**
   - Add your domain (e.g., noreply@eshainteriors.com)
   - Follow DNS verification steps
4. Get your API key:
   - Go to **API Keys**
   - Create new key
   - Save as `RESEND_API_KEY`

**Cost**: Free tier includes 100 emails/day

### Option B: SendGrid

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up and verify domain
3. Create API key:
   - Settings > API Keys
   - Create REST API Key
   - Save as `SENDGRID_API_KEY`
4. Update `netlify/functions/submit-consultation.js` and `submit-contact.js` to use SendGrid

**Cost**: Free tier includes 100 emails/day

---

## 🚀 Step 3: Deploy to Netlify

### 3.1 Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up (recommend GitHub)
3. Create new team/project

### 3.2 Deploy Your Site

**Option A: Connect GitHub (Recommended)**

```bash
# 1. Initialize Git
cd /path/to/esha
git init
git add .
git commit -m "Initial commit: Esha Interiors production ready"

# 2. Create GitHub repository
# Go to github.com/new
# Create "esha-interiors" repository
# Follow instructions to push:

git remote add origin https://github.com/YOUR_USERNAME/esha-interiors.git
git branch -M main
git push -u origin main
```

3. In Netlify:
   - Click "New site from Git"
   - Connect GitHub
   - Select `esha-interiors` repository
   - Build settings should auto-populate
   - Click "Deploy site"

**Option B: Drag & Drop**

1. Drag entire `esha` folder to Netlify
2. Site deploys immediately

### 3.3 Configure Environment Variables

1. In Netlify Site Settings:
   - Go to **Settings > Build & deploy > Environment**
   - Add these variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
RESEND_API_KEY=your-resend-api-key
ADMIN_EMAIL=hello@eshainteriors.com
ADMIN_PHONE=+91 98765 43210
```

### 3.4 Connect Custom Domain

1. Go to **Settings > Domain management**
2. Click "Add custom domain"
3. Enter: `eshainteriors.com`
4. Follow DNS configuration steps
5. Configure SSL certificate (auto-provisioned by Netlify)

---

## ⚙️ Step 4: Set Up Admin Dashboard (Strapi)

### 4.1 Install Strapi Locally

```bash
# Create admin folder in your project
mkdir admin
cd admin

# Create Strapi project
npx create-strapi-app@latest . --quickstart
```

### 4.2 Configure Database (Connect to Supabase)

1. Strapi opens http://localhost:1337/admin
2. Create your first admin user
3. Update `admin/.env`:

```
DATABASE_CLIENT=postgres
DATABASE_HOST=your-project.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password
DATABASE_SSL=true
```

### 4.3 Deploy Strapi

**Option A: Deploy to Render (Free)**

```bash
# Push admin folder to GitHub
cd admin
git init
git add .
git commit -m "Strapi admin dashboard"

# On Render.com:
# - New > Web Service
# - Connect your GitHub repo
# - Build Command: npm run build
# - Start Command: npm run start
# - Add environment variables
```

**Option B: Deploy to Railway**

Similar process, very straightforward.

---

## ✅ Step 5: Testing & Verification

### 5.1 Test Form Submissions

1. Fill out consultation form on homepage
2. Check Supabase:
   - Go to **consultations** table
   - Verify data appears
3. Check email:
   - Customer should receive confirmation
   - Admin should receive notification
4. Repeat for contact form

### 5.2 Test Images (if using)

1. Upload project image to admin dashboard
2. Verify it appears in portfolio
3. Check Supabase Storage

### 5.3 Performance Check

```bash
# Run Lighthouse audit
# Chrome DevTools > Lighthouse
# Target scores: 90+ across all categories
```

### 5.4 Link Verification

1. Test all internal links
2. Test all footer links
3. Test all CTA buttons
4. Test mobile menu

---

## 🔐 Step 6: Security & Production

### 6.1 Set Up HTTPS

✅ Netlify does this automatically with free SSL

### 6.2 Configure Security Headers

Already configured in `netlify.toml`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- CSP (Content Security Policy)

### 6.3 Update Environment Variables

Change placeholder values:
- Update contact email
- Update phone number
- Add real API keys (Resend, Analytics, etc.)

### 6.4 Set Up Monitoring

1. **Netlify Analytics**:
   - Settings > Analytics > Enable
2. **Google Analytics** (optional):
   - Create property at analytics.google.com
   - Get Tracking ID
   - Add to `index.html`
3. **Uptime Monitoring** (optional):
   - Use Pingdom or UptimeRobot
   - Monitor: eshainteriors.com

---

## 📊 Step 7: SEO & Marketing

### 7.1 Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: eshainteriors.com
3. Verify ownership (via DNS or file upload)
4. Submit sitemap.xml
5. Monitor search performance

### 7.2 Google Business Profile

1. Create profile at [business.google.com](https://business.google.com)
2. Add business info
3. Add photos
4. Enable reviews

### 7.3 Meta Tags & Open Graph

Already configured in `index.html`. Verify:
```html
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="...">
```

---

## 📱 Step 8: Configure Mobile

### 8.1 Add to Home Screen (PWA)

Create `manifest.json`:

```json
{
  "name": "Esha Interiors",
  "short_name": "Esha",
  "description": "Interior design studio in Hyderabad",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#b87040",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 8.2 WhatsApp Integration

WhatsApp links already work:
- `https://wa.me/919876543210` opens WhatsApp chat

---

## 🎯 Final Checklist

Before launching to public:

- [ ] All forms submitting correctly
- [ ] Emails being received
- [ ] Admin dashboard accessible
- [ ] Images loading properly
- [ ] Mobile site responsive
- [ ] All links working
- [ ] No console errors
- [ ] SEO tags present
- [ ] Analytics configured
- [ ] Backups set up
- [ ] Domain SSL certificate active
- [ ] Performance score > 90

---

## 🆘 Troubleshooting

### Forms not submitting?
- Check Supabase connection in Console
- Verify environment variables set
- Check netlify logs: `netlify logs`

### Emails not sending?
- Verify Resend API key
- Check Resend dashboard for failures
- Verify email address format
- Check spam folder

### Build failing?
- Check `netlify.toml` syntax
- Verify all dependencies in `package.json`
- Check function syntax in `netlify/functions/`

### Images not loading?
- Verify Supabase Storage configured
- Check CORS settings
- Verify image URLs in database

---

## 📞 Support

For issues:
1. Check Netlify Dashboard > Deploys > Logs
2. Check Supabase Dashboard > Logs
3. Check browser Console (F12)
4. Email: hello@eshainteriors.com

---

## 🎉 You're Live!

Congratulations! Your production website is ready.

**Next Steps:**
- Monitor analytics
- Respond to form submissions
- Add portfolio projects
- Build email subscriber list
- Plan marketing campaigns

**Useful Resources:**
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Strapi Docs](https://docs.strapi.io)

---

**Last Updated**: April 2024
**Status**: Production Ready ✅
