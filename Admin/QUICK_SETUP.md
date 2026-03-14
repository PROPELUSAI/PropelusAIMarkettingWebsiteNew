# Quick GA4 Setup Commands

Copy and paste these commands in order:

## 1. Link Supabase Project
```bash
supabase login
supabase link --project-ref evjzziffcrsgpnfejixc
```

## 2. Set Secrets

Replace with your actual values:

```bash
# Set Property ID (numeric, e.g., 123456789)
supabase secrets set GA4_PROPERTY_ID=YOUR_NUMERIC_PROPERTY_ID

# Set Service Account Key (from downloaded JSON file)
supabase secrets set GA4_SERVICE_ACCOUNT_KEY="$(cat path/to/service-account-key.json)"
```

## 3. Deploy Function
```bash
supabase functions deploy analytics
```

## 4. Verify
```bash
supabase secrets list
supabase functions list
```

## 5. Test
```bash
curl -X POST https://evjzziffcrsgpnfejixc.supabase.co/functions/v1/analytics \
  -H "Content-Type: application/json" \
  -d '{"endpoint": "realtime"}'
```

---

## What You Need Before Running These Commands:

1. **GA4 Property ID** (numeric)
   - Find it: GA4 Admin > Property Settings > Property ID
   - Example: `123456789`

2. **Service Account JSON Key**
   - Create it: Google Cloud Console > APIs & Services > Credentials
   - Download the JSON file
   - Add the service account email to GA4 with Viewer access

---

## Your .env File Should Have:

```env
VITE_GA4_PROPERTY_ID=123456789
VITE_GA4_API_ENDPOINT=https://evjzziffcrsgpnfejixc.supabase.co/functions/v1/analytics
```

---

That's it! See `GA4_SETUP_GUIDE.md` for detailed instructions.
