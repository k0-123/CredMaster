# Deployment Checklist

## Vercel Setup Steps
1. Go to vercel.com → New Project → Import your GitHub repo
2. Framework: Next.js (auto-detected)
3. Add these environment variables in Vercel dashboard:
   - NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   - SUPABASE_URL = (from Supabase project settings)
   - SUPABASE_ANON_KEY = (from Supabase project settings)
   - SUPABASE_SERVICE_ROLE_KEY = (from Supabase project settings)
   - GEMINI_API_KEY = (from Google AI Studio)
   - RESEND_API_KEY = (from resend.com dashboard)
   - RESEND_FROM_EMAIL = audits@yourdomain.com
4. Click Deploy

## Supabase Setup Steps
1. Create account at supabase.com
2. New project → choose a region close to your users
3. Go to SQL Editor → paste contents of src/lib/supabase.sql → Run
4. Go to Project Settings → API → copy URL and keys

## Resend Setup Steps
1. Create account at resend.com (free tier: 3000 emails/month)
2. Add and verify your domain (or use the Resend sandbox for testing)
3. Create API key → copy to RESEND_API_KEY

## Post-Deploy Verification
- [ ] https://your-app.vercel.app loads
- [ ] Fill the form → results page shows correctly
- [ ] Lead capture form sends email
- [ ] Shareable URL works and shows correct OG preview
  Test at: https://cards-dev.twitter.com/validator
