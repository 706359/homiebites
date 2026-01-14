


export async function POST(request) {
  return Response.json(
    { 
      success: false, 
      error: 'This endpoint is deprecated. Please use the token-based reset password flow.',
      hint: 'Use the reset link from your email: /admin/reset-password/:token'
    },
    { status: 400 }
  );
}
