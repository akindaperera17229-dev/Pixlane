import GalleryPage from './GalleryPage'

export default async function GalleryRoute({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <GalleryPage code={code} />
}
