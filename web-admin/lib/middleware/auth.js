// Authentication middleware for Next.js API routes
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "homiebites_secret";

// Authenticate user by verifying JWT token in Authorization header
export function authenticate(request) {
  return new Promise((resolve, reject) => {
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      reject({ status: 401, message: "No token provided" });
      return;
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        reject({ status: 403, message: "Invalid or expired token" });
        return;
      }
      resolve(user);
    });
  });
}

// Check if authenticated user is admin
export async function isAdmin(request) {
  try {
    const user = await authenticate(request);
    const userRole = user?.role?.toLowerCase();
    if (user && (userRole === "admin" || user.role === "Admin" || user.isAdmin)) {
      return user;
    }
    throw { status: 403, message: "Admin access required" };
  } catch (error) {
    throw error;
  }
}

// Helper to create error response
export function createErrorResponse(status, message) {
  return Response.json(
    { success: false, error: message },
    { status }
  );
}

