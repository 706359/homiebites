# Live Customer Review System ✅

## Overview
Implemented a complete live review system where customers can submit reviews online, and reviews are displayed dynamically on the website.

## Features

### ✅ Customer Features
1. **Submit Reviews**
   - Rating (1-5 stars)
   - Comment/Review text
   - Name, email, phone (optional for guests)
   - Location (optional)
   - Works for both logged-in users and guests

2. **View Live Reviews**
   - Reviews displayed in testimonials section
   - Real-time updates
   - Star ratings displayed
   - Featured reviews prioritized

### ✅ Admin Features
1. **Review Management**
   - View all reviews (pending, approved, rejected)
   - Approve/Reject reviews
   - Feature reviews
   - Delete reviews

2. **Review Moderation**
   - All reviews require admin approval
   - Status: pending → approved/rejected

## Implementation

### Backend

#### Review Model (`backend/Raavito/HomieBites/models/Review.js`)
```javascript
{
  userId: ObjectId (optional, if logged in),
  userName: String (required),
  userEmail: String (optional),
  userPhone: String (optional),
  userLocation: String (optional),
  rating: Number (1-5, required),
  comment: String (required),
  status: 'pending' | 'approved' | 'rejected',
  isFeatured: Boolean,
  orderId: ObjectId (optional),
  createdAt: Date
}
```

#### API Endpoints

**Public:**
- `GET /api/reviews` - Get all approved reviews
  - Query: `?featured=true&limit=50`
  
- `POST /api/reviews` - Submit a review
  - Body: `{ userName, userEmail, userPhone, userLocation, rating, comment, orderId }`
  - Auth: Optional (works for guests)

**Authenticated:**
- `GET /api/reviews/my-reviews` - Get user's own reviews
  - Auth: Required

**Admin:**
- `GET /api/reviews/admin/all` - Get all reviews (including pending)
  - Query: `?status=pending&limit=100`
  
- `PUT /api/reviews/admin/:id` - Update review status
  - Body: `{ status, isFeatured }`
  
- `DELETE /api/reviews/admin/:id` - Delete review

### Frontend

#### Components

1. **Testimonials.jsx** (Updated)
   - Fetches live reviews from API
   - Displays reviews with star ratings
   - "Write a Review" button
   - Fallback to default testimonials if no reviews

2. **ReviewForm.jsx** (New)
   - Review submission form
   - Star rating selector
   - Comment textarea
   - User info (pre-filled if logged in)
   - Modal overlay

#### Review Form Features
- Pre-fills user info if logged in
- Guest checkout option
- Star rating (1-5)
- Location field
- Validation
- Success/Error messages
- Auto-close after submission

## Usage

### For Customers

1. **Submit a Review:**
   - Go to Testimonials section
   - Click "Write a Review" button
   - Fill in the form
   - Submit (requires admin approval)

2. **View Reviews:**
   - Reviews automatically displayed in Testimonials section
   - Featured reviews shown first
   - Star ratings visible

### For Admin

1. **Manage Reviews:**
   - Access admin dashboard
   - Go to Reviews section (to be added)
   - Approve/Reject reviews
   - Feature important reviews

## Database

### Review Collection
- Collection: `HomieBites_Reviews`
- Indexes:
  - `status` (for filtering)
  - `isFeatured` (for featured reviews)
  - `createdAt` (for sorting)

## Security

1. **Review Submission:**
   - No authentication required (guests can review)
   - Admin approval required before publishing
   - Email/Phone optional for privacy

2. **Review Management:**
   - Admin-only access
   - JWT authentication required
   - Role-based access control

## Styling

### CSS Classes
- `.review-form-overlay` - Modal overlay
- `.review-form-wrapper` - Form container
- `.review-stars` - Star rating display
- `.author-avatar` - User avatar (initial)
- `.rating-input` - Rating selector
- `.rating-star` - Individual star button

## Future Enhancements

1. **Admin Dashboard Integration**
   - Add Reviews section to admin dashboard
   - Bulk approve/reject
   - Review analytics

2. **Review Features**
   - Photo uploads
   - Reply to reviews
   - Review helpfulness voting
   - Review sorting/filtering

3. **Notifications**
   - Email admin on new review
   - Notify customer when review approved

## Files Created/Modified

### Created:
- `backend/Raavito/HomieBites/models/Review.js`
- `backend/Raavito/HomieBites/routes/reviews.js`
- `web/components/ReviewForm.jsx`

### Modified:
- `backend/Raavito/HomieBites/server.js` (added review routes)
- `web/components/Testimonials.jsx` (live reviews)
- `web/styles/globals.css` (review form styles)

---

**Status**: ✅ Complete
**Last Updated**: 2024

