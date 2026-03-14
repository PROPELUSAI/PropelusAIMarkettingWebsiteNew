# GA4 Analytics Edge Function

This Supabase Edge Function proxies requests to Google Analytics 4 Data API.

## Setup Instructions

### 1. Enable Google Analytics Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Analytics Data API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Analytics Data API"
   - Click "Enable"

### 2. Create Service Account

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - Name: `ga4-analytics-reader`
   - Description: `Service account for reading GA4 data`
4. Click "Create and Continue"
5. Grant role: **Viewer** (or no role needed)
6. Click "Done"

### 3. Create and Download Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create" - this will download a JSON file

### 4. Add Service Account to GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (gear icon)
3. Under "Property" column, click "Property Access Management"
4. Click the "+" button (Add users)
5. Enter the service account email (from the JSON file: `client_email`)
6. Select role: **Viewer**
7. Click "Add"

### 5. Get Your GA4 Property ID

1. In Google Analytics, click "Admin"
2. Under "Property" column, click "Data Streams"
3. Click on your web data stream
4. Copy the **Property ID** (numeric, like `123456789`)
   - NOT the Measurement ID (G-XXXXXXXXXX)

### 6. Set Supabase Secrets

Run these commands in your terminal:

```bash
# Set the GA4 Property ID (numeric ID, not G-XXXXXXXXXX)
supabase secrets set GA4_PROPERTY_ID=your_numeric_property_id

# Set the service account key (paste the entire JSON content)
supabase secrets set GA4_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

### 7. Deploy the Edge Function

```bash
supabase functions deploy analytics
```

### 8. Update Your .env File

```env
VITE_GA4_API_ENDPOINT=https://your-project-ref.supabase.co/functions/v1/analytics
```

Replace `your-project-ref` with your actual Supabase project reference.

## Testing

You can test the function locally:

```bash
supabase functions serve analytics
```

Then make a request:

```bash
curl -X POST http://localhost:54321/functions/v1/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "realtime",
    "startDate": "7daysAgo",
    "endDate": "today"
  }'
```

## API Endpoints

The function supports these endpoints:

- `realtime` - Real-time active users
- `traffic` - Traffic analytics (sessions, users, pageviews)
- `pages` - Page performance metrics
- `acquisition` - Traffic sources and campaigns
- `events` - Event tracking
- `conversions` - Conversion tracking
- `demographics` - User demographics (country, city)

## Troubleshooting

### Error: "GA4 credentials not configured"
- Make sure you've set both `GA4_PROPERTY_ID` and `GA4_SERVICE_ACCOUNT_KEY` secrets

### Error: "Permission denied"
- Verify the service account email is added to your GA4 property with Viewer access

### Error: "Property not found"
- Double-check you're using the numeric Property ID, not the Measurement ID (G-XXXXXXXXXX)
- Find it in GA4 Admin > Property Settings > Property ID

### No data returned
- Ensure your GA4 property has data
- Check the date range is valid
- Verify the service account has been added to GA4 (can take a few minutes to propagate)
