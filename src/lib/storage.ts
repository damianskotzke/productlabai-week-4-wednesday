import { FILES_BUCKET, supabase } from "./supabase"

export const MAX_FILE_SIZE = 5 * 1024 * 1024

export type UploadedFile = { url: string; name: string }

/**
 * Upload a file to the `board-files` storage bucket and get its public URL.
 * In mock mode the file becomes a data URL and stays in this browser.
 */
export async function uploadFile(file: File): Promise<UploadedFile> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("The file is too large. The limit is 5 MB.")
  }
  if (!supabase) {
    return { url: await readAsDataUrl(file), name: file.name }
  }
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin"
  const path = `${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from(FILES_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from(FILES_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, name: file.name }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Could not read the file."))
    reader.readAsDataURL(file)
  })
}
