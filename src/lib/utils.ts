/** Generate a random 8-char uppercase event code e.g. "PXLN-A3F7" */
export function generateEventCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'PX-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/** Get the public URL for an event's share link */
export function getEventUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://pixlane.site'
  return `${base.replace(/\/+$/, '')}/e/${code}`
}
