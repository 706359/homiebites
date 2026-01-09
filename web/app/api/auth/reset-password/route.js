/**
 * Next.js API Route: Reset Password (Stub)
 * This endpoint is referenced in the frontend but not implemented in Express backend
 * Returns a not implemented response
 */
export async function POST(_request) {
  return Response.json(
    { success: false, error: 'Password reset not implemented' },
    { status: 501 }
  );
}
