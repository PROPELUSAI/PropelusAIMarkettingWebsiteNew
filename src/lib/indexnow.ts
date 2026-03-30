/**
 * IndexNow integration for instant URL indexing on Bing, Yandex, Naver, Seznam.
 * Called after blog publish/update to notify search engines immediately.
 */

const INDEXNOW_KEY = 'c09be369a9077f97719d3844641d0630';
const SITE_URL = 'https://www.propelusai.com';

export async function submitToIndexNow(urls: string | string[]): Promise<boolean> {
  const urlList = Array.isArray(urls) ? urls : [urls];

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'www.propelusai.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urlList.map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u}`)),
      }),
    });
    return res.ok || res.status === 202;
  } catch {
    // Non-critical — don't break the blog publish flow
    return false;
  }
}
