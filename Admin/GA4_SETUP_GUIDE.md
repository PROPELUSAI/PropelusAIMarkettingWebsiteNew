# Complete GA4 Analytics Setup Guide

This guide will walk you through setting up Google Analytics 4 with Supabase Edge Functions.

## Prerequisites

- Supabase CLI installed: `npm install -g supabase`
- Google Analytics 4 property set up
- Google Cloud Platform account

---

## Step 1: Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

Login to Supabase:
```bash
supabase login
```

Link your project:
```bash
supabase link --project-ref evjzziffcrsgpnfejixc
```

---

## Step 2: Set Up Google Cloud Project

### 2.1 Create/Select a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project" or select an existing one
4. Name it (e.g., "GA4 Analytics API")

### 2.2 Enable Google Analytics Data API

1. In the Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Analytics Data API"**
3. Click on it and press **"Enable"**

---

## Step 3: Create Service Account

### 3.1 Create the Service Account

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "Service Account"**
3. Fill in:
   - **Name**: `ga4-analytics-reader`
   - **Description**: `Service account for reading GA4 analytics data`
4. Click **"Create and Continue"**
5. Skip granting roles (click "Continue")
6. Click **"Done"**

### 3.2 Create and Download JSON Key

1. Click on the service account you just created
2. Go to the **"Keys"** tab
3. Click **"Add Key" > "Create new key"**
4. Select **"JSON"** format
5. Click **"Create"**
6. A JSON file will download - **SAVE THIS FILE SECURELY**

The JSON file looks like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "ga4-analytics-reader@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

## Step 4: Add Service Account to GA4

### 4.1 Get Service Account Email

From the JSON file you downloaded, copy the `client_email` value.
Example: `ga4-analytics-reader@your-project.iam.gserviceaccount.com`

### 4.2 Add to GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Admin"** (gear icon in bottom left)
3. Under **"Property"** column, click **"Property Access Management"**
4. Click the **"+"** button (top right)
5. Click **"Add users"**
6. Enter the service account email
7. Select role: **"Viewer"**
8. Uncheck "Notify new users by email"
9. Click **"Add"**

**Note**: It may take a few minutes for permissions to propagate.

---

## Step 5: Get Your GA4 Property ID

### 5.1 Find the Numeric Property ID

1. In Google Analytics, click **"Admin"**
2. Under **"Property"** column, click **"Property Settings"**
3. You'll see **"Property ID"** - this is a **numeric ID** (e.g., `123456789`)

**Important**: 
- Use the **numeric Property ID** (e.g., `123456789`)
- NOT the Measurement ID (G-XXXXXXXXXX)

---

## Step 6: Set Supabase Secrets

### 6.1 Set GA4 Property ID

```bash
supabase secrets set GA4_PROPERTY_ID=123456789
```

Replace `123456789` with your actual numeric Property ID.

### 6.2 Set Service Account Key

You need to set the entire JSON content as a secret. The easiest way:

**Option A: Using a file**
```bash
supabase secrets set GA4_SERVICE_ACCOUNT_KEY="$(cat path/to/your-service-account-key.json)"
```

**Option B: Copy-paste the JSON**
```bash
supabase secrets set GA4_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**Important**: Make sure the JSON is properly escaped and on a single line.

### 6.3 Verify Secrets

```bash
supabase secrets list
```

You should see:
- `GA4_PROPERTY_ID`
- `GA4_SERVICE_ACCOUNT_KEY`

---

## Step 7: Deploy Edge Function

```bash
supabase functions deploy analytics
```

You should see output like:
```
Deploying function analytics...
Function analytics deployed successfully!
URL: https://evjzziffcrsgpnfejixc.supabase.co/functions/v1/analytics
```

---

## Step 8: Update Environment Variables

Update your `.env` file:

```env
# Google Analytics
VITE_GA4_PROPERTY_ID=123456789
VITE_GA4_API_ENDPOINT=https://evjzziffcrsgpnfejixc.supabase.co/functions/v1/analytics
```

Replace:
- `123456789` with your numeric Property ID
- `evjzziffcrsgpnfejixc` with your Supabase project reference

---

## Step 9: Test the Setup

### 9.1 Test Locally (Optional)

Start the function locally:
```bash
supabase functions serve analytics --env-file .env.local
```

Create `.env.local` with your secrets:
```
GA4_PROPERTY_ID=123456789
GA4_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

Test with curl:
```bash
curl -X POST http://localhost:54321/functions/v1/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "realtime"
  }'
```

### 9.2 Test in Your App

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Analytics page in your app

3. Check the browser console for any errors

---

## Troubleshooting

### Error: "GA4 credentials not configured"

**Solution**: Make sure both secrets are set:
```bash
supabase secrets list
```

If missing, set them again following Step 6.

---

### Error: "Permission denied" or "User does not have sufficient permissions"

**Solution**: 
1. Verify the service account email is added to GA4 with Viewer access
2. Wait 5-10 minutes for permissions to propagate
3. Try again

---

### Error: "Property not found"

**Solution**: 
1. Make sure you're using the **numeric Property ID**, not the Measurement ID
2. Find it in GA4: Admin > Property Settings > Property ID
3. It should be just numbers (e.g., `123456789`), not `G-XXXXXXXXXX`

---

### No data returned

**Possible causes**:
1. Your GA4 property doesn't have data yet - wait for some traffic
2. Date range is invalid - try "7daysAgo" to "today"
3. Service account permissions haven't propagated - wait 5-10 minutes

---

### CORS errors

**Solution**: The Edge Function already includes CORS headers. If you still see errors:
1. Make sure you're using the correct Supabase URL
2. Check that the function is deployed: `supabase functions list`

---

## Quick Reference

### Useful Commands

```bash
# Link project
supabase link --project-ref evjzziffcrsgpnfejixc

# Set secrets
supabase secrets set KEY=value

# List secrets
supabase secrets list

# Deploy function
supabase functions deploy analytics

# View function logs
supabase functions logs analytics

# Test locally
supabase functions serve analytics
```

### Important URLs

- Google Cloud Console: https://console.cloud.google.com/
- Google Analytics: https://analytics.google.com/
- Supabase Dashboard: https://app.supabase.com/
- Your Edge Function: https://evjzziffcrsgpnfejixc.supabase.co/functions/v1/analytics

---

## Next Steps

Once everything is working:

1. ✅ Analytics dashboard should display real-time data
2. ✅ All tabs (Traffic, Pages, Acquisition, etc.) should work
3. ✅ Date range filtering should work

If you need help, check the function logs:
```bash
supabase functions logs analytics --tail
```

---

## Security Notes

- ✅ Service account key is stored securely in Supabase secrets
- ✅ Never commit the JSON key file to git
- ✅ The key is never exposed to the browser
- ✅ All API calls go through your Edge Function
- ✅ CORS is properly configured

---

**You're all set!** 🎉

Your GA4 analytics should now be working with Supabase Edge Functions.
