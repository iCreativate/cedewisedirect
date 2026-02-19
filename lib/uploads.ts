// Upload stubs. Integrate Uploadthing or Vercel Blob later.
export async function uploadFileStub(_: File): Promise<{ url: string }> {
  // Return a placeholder URL
  return { url: "/placeholder-file.pdf" };
}

