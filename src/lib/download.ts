import JSZip from 'jszip'

/**
 * Downloads a single photo directly to device storage without opening a new tab
 */
export async function downloadSinglePhoto(url: string, filename: string) {
  try {
    const response = await fetch(url, { mode: 'cors' })
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Failed to download image directly, falling back:', error)
    // Fallback if fetch fails
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * Downloads multiple photos as a compressed .ZIP file with progress feedback
 */
export async function downloadAllPhotosAsZip(
  photos: { file_url: string; uploader_name?: string; id?: string }[],
  eventName: string,
  onProgress?: (progressText: string, percentage: number) => void
) {
  if (!photos || photos.length === 0) return

  const zip = new JSZip()
  const sanitizedEventName = eventName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'pixlane_photos'
  const folder = zip.folder(sanitizedEventName) || zip

  const total = photos.length
  let completed = 0

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i]
    if (onProgress) {
      onProgress(`Downloading photo ${i + 1} of ${total}...`, Math.round(((i) / total) * 80))
    }

    try {
      const response = await fetch(photo.file_url)
      const blob = await response.blob()
      
      const ext = photo.file_url.split('.').pop()?.split('?')[0] || 'jpg'
      const uploader = (photo.uploader_name || 'guest').replace(/[^a-zA-Z0-9_-]/g, '')
      const fileName = `${i + 1}_${uploader}_${photo.id?.slice(0, 6) || Date.now()}.${ext}`

      folder.file(fileName, blob)
      completed++
    } catch (err) {
      console.warn(`Failed to bundle photo ${photo.id}:`, err)
    }
  }

  if (completed === 0) {
    throw new Error('No photos could be retrieved for download.')
  }

  if (onProgress) {
    onProgress('Packing into ZIP archive...', 85)
  }

  const content = await zip.generateAsync(
    { type: 'blob' },
    (metadata) => {
      if (onProgress) {
        onProgress(`Compressing: ${Math.round(metadata.percent)}%`, 85 + Math.round(metadata.percent * 0.15))
      }
    }
  )

  const zipUrl = window.URL.createObjectURL(content)
  const link = document.createElement('a')
  link.href = zipUrl
  link.download = `${sanitizedEventName}_Pixlane.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(zipUrl)
}
