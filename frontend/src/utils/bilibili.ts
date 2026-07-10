export function extractBvid(url: string): string | null {
  const bvidPattern = /BV[a-zA-Z0-9]{10}/;
  const match = url.match(bvidPattern);
  return match ? match[0] : null;
}

export function isValidBilibiliUrl(url: string): boolean {
  return url.includes("bilibili.com") || url.includes("b23.tv");
}
