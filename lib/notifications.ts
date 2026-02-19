// Notification stubs. Integrate Pusher or Supabase Realtime later.
export async function sendInAppNotification(userId: string, message: string) {
  // no-op stub for MVP
  console.log("Notify", userId, message);
}

export async function sendEmailStub(email: string, subject: string, body: string) {
  // no-op stub for MVP
  console.log("Email", email, subject);
}

