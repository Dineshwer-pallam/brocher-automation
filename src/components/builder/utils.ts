export function getPlaceholderDataURL(width: number, height: number, text: string): string {
  const safeText = text || 'Image Placeholder';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#cccccc" stroke="#999999" stroke-width="2" stroke-dasharray="8 8"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#666666">${safeText}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
