# Book Review Platform

A full-stack web application for book reviews and discussions, built with React and Node.js.

## Features

- 📚 Book listing with search and genre filtering
- ⭐ User ratings and reviews
- 👤 User authentication and profiles
- 📝 Add and manage books
- 🎨 Responsive modern UI

## Tech Stack

### Frontend

- React 19
- React Router v7
- Axios for API calls
- Context API for state management
- CSS3 with modern features

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v16 or higher)
- npm (Node Package Manager)
- MongoDB (local or Atlas connection)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Arun-kumar2206/Book-Review-Platform.git
   cd book-review-platform
   ```

2. **Set up environment variables**

   Create a `.env` file in the `book-review-server` directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

3. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd book-review-client
   npm install

   # Install backend dependencies
   cd ../book-review-server
   npm install
   ```

4. **Start the application**

   From the root directory:

   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately:
   npm run client  # Frontend only
   npm run server  # Backend only
   ```

   - Frontend runs on: `http://localhost:5173`
   - Backend runs on: `http://localhost:5000`

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Books

- GET `/api/books` - Get all books (with pagination)
- GET `/api/books/:id` - Get single book
- POST `/api/books` - Add new book (protected)
- PUT `/api/books/:id` - Update book (protected)
- DELETE `/api/books/:id` - Delete book (protected)

### Reviews

- GET `/api/reviews` - Get reviews for a book
- POST `/api/reviews` - Add new review (protected)
- PUT `/api/reviews/:id` - Update review (protected)
- DELETE `/api/reviews/:id` - Delete review (protected)

### Users

- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update user profile (protected)

## Project Structure

```
book-review-platform/
├── book-review-client/      # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── public/            # Static files
└── book-review-server/     # Node.js backend
    ├── config/            # Configuration files
    ├── middleware/        # Custom middleware
    ├── models/           # Mongoose models
    └── routes/           # API routes
```

## License

This project is licensed under the MIT License.
