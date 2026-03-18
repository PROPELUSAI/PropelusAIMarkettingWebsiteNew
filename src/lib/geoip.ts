export interface GeoIPResult {
  countryCode: string;
  countryName: string;
}

export async function detectCountry(): Promise<GeoIPResult | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.country_name && data.country_code) {
      return { countryCode: data.country_code, countryName: data.country_name };
    }
    return null;
  } catch {
    return null;
  }
}
