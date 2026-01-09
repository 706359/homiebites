/**
 * Next.js API Route: Forgot Password (Stub)
 * This endpoint is referenced in the frontend but not implemented in Express backend
 * Returns a not implemented response
 */
export async function POST(_request) {
  return Response.json(
    { success: false, error: 'Password recovery not implemented' },
    { status: 501 }
  );
}
