import { redirect } from 'next/navigation'

export default async function GalleryRoute({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  redirect(`/e/${code}`)
}
