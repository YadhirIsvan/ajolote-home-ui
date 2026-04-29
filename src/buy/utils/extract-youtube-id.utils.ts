const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
];

export const extractYouTubeId = (input: string | undefined): string | null => {
  if (!input) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

  for (const pattern of YOUTUBE_PATTERNS) {
    const match = input.match(pattern);
    if (match?.[1]) return match[1];
  }

  try {
    const url = new URL(input);
    const videoId = url.searchParams.get("v");
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) return videoId;
  } catch {
    // Not a valid URL — fall through
  }

  return input;
};
