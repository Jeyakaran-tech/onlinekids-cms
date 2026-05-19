export async function revalidateFrontend(): Promise<void> {
  const url = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
    });
  } catch {
    // non-fatal — frontend will fall back to stale cache
  }
}
