async function getMimeTypeFromUrl(src: string): Promise<string> {
  try {
    const response = await fetch(src, { method: 'HEAD' });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType) return contentType;
    }
  } catch (error) {
    console.error('Error fetching MIME type:', error);
  }

  return 'video/mp4'; // Fallback type
}

export function removeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export async function getMimeType(src: string): Promise<string> {
  return await getMimeTypeFromUrl(src);
}