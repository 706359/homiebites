/**
 * Next.js API Route: Verify OTP (Stub)
 * This endpoint is referenced in the frontend but not implemented in Express backend
 * Returns a not implemented response
 */
export async function POST(_request) {
  return Response.json(
    { success: false, error: 'OTP verification not implemented' },
    { status: 501 }
  );
}
