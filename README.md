# Blog API 📝

A training REST API project built with **Node.js**, **Express.js**, and **MongoDB Atlas**.

This project is a backend blog system that supports:

- Posts management (CRUD)
- Comments system (CRUD)
- Pagination
- Full-text search with relevance sorting
- Filtering by tags and author
- Secure authorization with JWT
- Transaction-safe deletions (cascade delete)

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas + Mongoose**
- **JWT Authentication**
- **REST API Architecture**

---

## ✨ Features

### Posts
- Create a post
- Get all posts (paginated)
- Get single post
- Edit post (author only)
- Delete post (author only) + automatically delete related comments (transaction)

### Comments
- Add comment to a post
- Get post comments (paginated)
- Edit comment (owner only)
- Delete comment (owner only)

### Search & Filter
- Full-text search on post title/content
- Sort results by relevance score
- Filter posts by:
  - Author
  - Tags (must include all tags)

### Security
- Request body whitelisting (no unwanted field injection)
- Authorization checks (only owners can edit/delete)
- Proper error handling (CastError → 400 / duplicated key → 11000 / ValidationError → 400)

---

## 📌 API Endpoints

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/posts` | Create a new post |
| GET    | `/posts?page=1` | Get all posts (paginated) |
| GET    | `/posts/:id` | Get a single post |
| PATCH  | `/posts/:id` | Edit a post (author only) |
| DELETE | `/posts/:id` | Delete a post + its comments (author only) |

---

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/posts/:id/comments` | Add comment to post |
| GET    | `/posts/:id/comments?page=1` | Get post comments |
| PATCH  | `/comments/:id` | Edit comment (owner only) |
| DELETE | `/comments/:id` | Delete comment (owner only) |

---

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts/search?q=node&sort=relevance&page=1` | Search posts by text |

Supported query params:

- `q` (required)
- `author` (optional)
- `tags` (optional)
- `sort=newest|relevance`

Example:

```
GET /posts/search?q=express&tags=node,api&sort=relevance
```

---

### Filter

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts/filter?tags=node,mongodb&author=...` | Filter posts |

Tags filtering uses `$all`, meaning the post must contain **all provided tags**.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

You can copy the example:

```bash
cp .env.example .env
```

Required variables:

```env
PORT=5000
DB_URI=
JWT_SECRET=
EXPIRES_IN=7d
```

---

## 🛠️ Installation & Run Locally

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

---

## 📌 Notes

- This is a training project focused on backend development best practices.
- The API is designed to be extended with more features such as likes, roles, images upload, or admin moderation.

---

## 🌍 Live Demo

API is deployed on Render:

https://blog-api-joua.onrender.com

---

## 👤 Author

Built as a training project by **Elias**.
