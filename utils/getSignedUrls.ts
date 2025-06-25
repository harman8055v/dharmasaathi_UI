import supabaseAdmin from "./supabaseAdmin"

export async function getSignedUrlsForPhotos(photoPaths: string[]): Promise<string[]> {
  const urls: string[] = []
  for (const path of photoPaths) {
    const { data, error } = await supabaseAdmin.storage
      .from("user-photos")
      .createSignedUrl(path, 60)

    if (error || !data?.signedUrl) {
      console.error("Failed to create signed URL for", path, error)
      continue
    }

    urls.push(data.signedUrl)
  }
  return urls
}
