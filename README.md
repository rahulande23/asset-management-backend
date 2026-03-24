# Asset Management Backend - MVC Architecture

This Node.js backend has been refactored from a single file to follow the MVC (Model-View-Controller) architecture pattern.

## Project Structure

```
├── app.js                 # Main application entry point
├── server.js.backup       # Original single-file backup
├── config/
│   ├── database.js        # Database connection configuration
│   └── config.js          # Application configuration
├── models/
│   ├── User.js           # User data model
│   └── Asset.js          # Asset data model
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── adminController.js # Admin functionality
│   └── userController.js  # User functionality
├── routes/
│   ├── authRoutes.js     # Authentication routes
│   ├── adminRoutes.js    # Admin routes
│   └── userRoutes.js     # User routes
└── middleware/
    └── auth.js           # JWT authentication middleware
```

## Features

- **Authentication**: Login, registration, Google OAuth
- **Admin Dashboard**: Asset management and statistics
- **User Management**: User profiles and data
- **Asset Management**: CRUD operations for assets
- **JWT Protection**: Secure API endpoints

## API Endpoints

### Authentication

- `POST /create-account` - Create new user account
- `POST /login` - User login
- `POST /auth/google` - Google OAuth login
- `GET /checking-token-on-app-start` - Validate JWT token

### Admin (Protected)

- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/assets` - Get all assets with details
- `GET /admin/assign` - Get assignment page data

### Users (Protected)

- `GET /users` - Get all users
- `POST /profile` - Get user profile

## Running the Application

```bash
npm start
# or
npm run dev
```

The server will start on port 8000.

## Environment Setup

Make sure your MySQL database is running with the following configuration:

- Host: localhost
- User: root
- Password: password
- Database: asset

## Benefits of MVC Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easier to modify and extend functionality
3. **Testability**: Components can be tested independently
4. **Reusability**: Models and controllers can be reused
5. **Scalability**: Easier to add new features and routes
