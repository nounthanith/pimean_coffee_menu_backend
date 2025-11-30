# Pimean Coffee Menu Backend API

Base URL: http://localhost:PORT

Authentication
- JWT Bearer in Authorization header
- Header: Authorization: Bearer <token>
- Env: set JWT_SECRET (and optional JWT_EXPIRES_IN)

Uploads
- Images are stored under `uploads/<filename>`
- Recommended: expose uploads as static files in app.js
  - app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

---

Auth Endpoints
- POST /api/auth/register
  - Body (JSON): { name, email, password }
  - Creates a user with role "user". Returns token and user info.
- POST /api/auth/login
  - Body (JSON): { email, password }
  - Admin login only. Returns token and user info.
- GET /api/auth/
  - Admin only (verifyToken + requireAdmin)
  - Returns all users (without passwords)

---

Category Endpoints
- GET /api/categories
  - Query: search, page, limit
  - Returns paginated categories
- GET /api/categories/:id
  - Returns a single category
- POST /api/categories
  - Protected (verifyToken)
  - Body (JSON): { name, description }
- PUT /api/categories/:id
  - Body (JSON): any updatable fields (name, description)
- DELETE /api/categories
  - Body or Query must include id
  - Note: current route uses DELETE '/'; send id via query (?id=) or body { id }

---

Product Endpoints
- GET /api/products
  - Query filters:
    - category: categoryId
    - isActive: true|false
    - search: string
    - page: number (default 1)
    - limit: number (default 12)
  - Returns paginated products and pagination info { page, limit, total, pages }
- GET /api/products/category/:categoryId
  - Same filters for page, limit, isActive, search apply via query
- GET /api/products/:id
  - Returns a single product (category populated)
- POST /api/products
  - Protected (verifyToken)
  - Content-Type: multipart/form-data
  - Fields (text): name, description, price, category, isActive (optional)
  - File (single): image
  - Stored image path: `uploads/<filename>`
- PUT /api/products/:id
  - Protected (verifyToken)
  - Content-Type: multipart/form-data (to update image) or JSON
  - Optional fields: name, description, price, category, isActive, image(file)
  - Notes: empty string for category is ignored; price is coerced to number
- DELETE /api/products/:id
  - Deletes a product by id

---

Response Shapes (examples)
- Success list (products/categories)
{
  "success": true,
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 12, "total": 34, "pages": 3 }
}

- Success single (product/category)
{
  "success": true,
  "data": { ... }
}

- Error
{
  "success": false,
  "message": "<reason>"
}

Notes
- Product `isActive` defaults to true when not provided on create.
- Product `category` must be a valid MongoDB ObjectId.
- For product image updates, sending a new file replaces the image and the stored path becomes `uploads/<filename>`.
