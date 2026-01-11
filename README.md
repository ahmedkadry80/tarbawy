# Tarbawy - Learning Management System

A comprehensive video learning platform built with Node.js, Express, MySQL, and Bootstrap.

## Features

- User registration and authentication (Students/Teachers)
- Course creation and management
- Video upload and secure streaming
- Student enrollment and progress tracking
- Free and paid courses
- Responsive Bootstrap UI
- SEO optimized

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML, Bootstrap, JavaScript
- **Authentication**: JWT
- **File Upload**: Multer

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set up database:
   - Create MySQL database named 'tarbawy'
   - Run the schema.sql file to create tables
   - Update db.js with your database credentials

3. Environment variables (optional):
   - DB_HOST
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
   - JWT_SECRET

4. Start the server:
   ```bash
   node server.js
   ```

5. Access the platform at http://localhost:3000

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Courses
- GET /api/courses
- POST /api/courses/create
- GET /api/courses/teacher/:id
- GET /api/courses/student/:id
- POST /api/courses/:id/enroll

### Videos
- POST /api/courses/:courseId/videos/upload
- GET /api/courses/:courseId/videos
- GET /api/videos/stream/:videoId

## Database Schema

See schema.sql for the complete database structure.

## Performance Optimizations

- Gzip compression
- Helmet security headers
- Static file caching
- Video streaming with range requests

## SEO Features

- Meta tags
- Semantic HTML
- Fast loading times
- Mobile responsive