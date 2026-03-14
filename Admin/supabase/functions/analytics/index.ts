import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate JWT for Google API authentication
async function getAccessToken(credentials: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  // Import the private key
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(credentials.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const jwt = await create(header, payload, privateKey);

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { endpoint, startDate, endDate, dimensions, metrics, filters } = await req.json();

    // Get GA4 credentials from environment variables
    const propertyId = Deno.env.get('GA4_PROPERTY_ID');
    const credentialsBase64 = Deno.env.get('GA4_SERVICE_ACCOUNT_KEY_BASE64');
    const credentialsString = Deno.env.get('GA4_SERVICE_ACCOUNT_KEY');
    
    let credentials;
    try {
      if (credentialsBase64) {
        // Decode from base64
        const decoded = atob(credentialsBase64);
        credentials = JSON.parse(decoded);
      } else if (credentialsString) {
        credentials = JSON.parse(credentialsString);
      } else {
        throw new Error('No credentials found');
      }
    } catch (parseError) {
      console.error('Failed to parse credentials:', parseError);
      throw new Error(`Invalid GA4 service account key format: ${parseError.message}`);
    }

    if (!propertyId || !credentials.client_email) {
      throw new Error('GA4 credentials not configured');
    }

    // Get access token
    const accessToken = await getAccessToken(credentials);

    let response;
    let apiUrl: string;
    let requestBody: any;

    switch (endpoint) {
      case 'realtime':
        apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`;
        requestBody = {
          dimensions: dimensions || [{ name: 'country' }],
          metrics: metrics || [{ name: 'activeUsers' }],
        };
        break;

      case 'traffic':
        apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
        requestBody = {
          dateRanges: [{ startDate, endDate }],
          dimensions: dimensions || [{ name: 'date' }],
          metrics: metrics || [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
        };
        break;

      case 'pages':
        apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
        requestBody = {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
          ],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 20,
        };
        break;

      case 'acquisition':
        apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
        requestBody = {
          dateRanges: [{ startDate, endDate }],
          dimensions: [
            { name: 'sessionSource' },
            { name: 'sessionMedium' },
            { name: 'sessionCampaignName' },
          ],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'newUsers' },
          ],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 20,
        };
        break;

      case 'events':
        apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
        requestBody = {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [
            { name: 'eventCount' },
            { name: 'totalUsers' },
          ],
          orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
          limit: 20,
        };
        break;

      case 'conversions':
        apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
        requestBody = {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [
            { name: 'conversions' },
            { name: 'totalUsers' },
          ],
          dimensionFilter: filters?.eventName ? {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                matchType: 'CONTAINS',
                value: filters.eventName,
              },
            },
          } : undefined,
          orderBys: [{ metric: { metricName: 'conversions' }, desc: true }],
          limit: 20,
        };
        break;

      case 'demographics':
        apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
        requestBody = {
          dateRanges: [{ startDate, endDate }],
          dimensions: dimensions || [{ name: 'country' }, { name: 'city' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
          ],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 20,
        };
        break;

      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    // Make the API request
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`GA4 API error: ${apiResponse.status} - ${errorText}`);
    }

    response = await apiResponse.json();

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
