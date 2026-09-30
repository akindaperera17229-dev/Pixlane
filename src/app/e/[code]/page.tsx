import GuestUploadPage from './GuestUploadPage'

export default async function EventPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <GuestUploadPage code={code} />
}
