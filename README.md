# Busola Server

A comprehensive learning management system (LMS) backend API built with Fastify, providing course management, authentication, quizzes, and content synchronization with Contentful CMS.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)
- [Scripts](#scripts)
- [Future Features](#future-features)

## 🎯 Overview

Busola Server is a robust backend system for managing online learning platforms. It handles user authentication, course content delivery, lesson tracking, quiz management, and integrates with Contentful CMS for content management. The system features a comprehensive quiz system with multiple question types and progress tracking.

## 🛠 Technology Stack

- **Runtime & Framework**: Node.js with Fastify (v5)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM (v6)
- **Authentication**: JWT tokens with cookie-based sessions
- **CMS Integration**: Contentful
- **Email Service**: Resend
- **API Documentation**: Swagger/OpenAPI
- **Security**: bcrypt for password hashing, CORS, cookie security

### Key Dependencies

- `fastify` - Fast and low overhead web framework
- `@prisma/client` - Type-safe database access
- `@fastify/jwt` - JWT authentication
- `@fastify/swagger` - API documentation
- `contentful` - Headless CMS integration
- `resend` - Email notifications
- `bcrypt` - Password hashing
- `zod` - Schema validation

## ✨ Features

### Authentication & User Management

- User sign-in/sign-out with JWT tokens
- Initial password reset flow
- Password recovery with verification codes
- Token refresh mechanism
- Cookie-based session management

### Course Management

- Course creation and management
- Lesson organization with ordering
- Progress tracking per user
- Course access control
- Lesson completion status

### Quiz System

- Multiple question types (single choice, multiple choice, open-ended)
- Random question selection from question pool
- Quiz attempt tracking with scoring
- Historical performance records
- Detailed answer tracking

### Lesson Features

- Video content support
- Task files and videos
- Rich text content (JSON format)
- User notes per lesson
- Sequential lesson navigation

### Content Synchronization

- Webhook integration with Contentful CMS
- Automatic content updates from CMS
- Support for courses, lessons, quizzes, questions, and answers
- Shop integration webhook

### Email Notifications

- Welcome emails for new users
- Password reset emails with verification codes
- HTML email templates

## 🏗 Architecture

The following diagram illustrates the overall system architecture and how different components interact:

```mermaid
graph TD

subgraph "Data Layer"
    DB[(Primary Database)]
end

subgraph "Backend Layer"
    BE[External Backend API]
end

subgraph "Frontend Layer"
    FE[Frontend App]
end

subgraph "Content Layer"
    CMS[CMS Contentful]
end

subgraph "Payment Layer"
    SHOP[External online shop]
end

subgraph "External chat"
    CHAT[Slack]
end

BE <--> DB
SHOP --"Webhook on content publish (POST /webhook/shop)"--> BE
CHAT --> |"Slack Events API (teacher answers in threat) (POST /webhook/chat)"| BE
BE -->|"Slack API (student sends a message to teacher)" | CHAT
FE -->|App data | BE
CMS -- "Webhook on content publish (POST /webhook/cms)" --> BE
FE -. "Direct media fetch on demand (URL or Asset ID)" .-> CMS

classDef svc fill:#eef,stroke:#88a,stroke-width:1px;
class BE,FE,CMS svc
```

### Architecture Components

- **Frontend App**: User-facing application that communicates with the backend API and fetches media directly from Contentful
- **Backend API (Busola Server)**: Core application handling authentication, business logic, and data management
- **Primary Database**: PostgreSQL database storing all application data
- **CMS Contentful**: Headless CMS managing course content, lessons, quizzes, and media assets
- **External Online Shop**: Third-party e-commerce platform that triggers user creation via webhooks
- **Slack**: External communication platform for student-teacher interactions

## 📁 Project Structure

```
busola-server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── fastify/         # Fastify and Swagger setup
│   │   ├── contentful.ts    # Contentful CMS client
│   │   ├── prisma.ts        # Database client
│   │   └── resend.ts        # Email service client
│   ├── controllers/         # Request handlers
│   │   ├── auth/           # Authentication endpoints
│   │   ├── dashboard/      # User dashboard endpoints
│   │   └── webhook/        # Webhook handlers
│   ├── routes/             # Route definitions
│   │   ├── auth.route.ts
│   │   ├── dashboard.route.ts
│   │   └── webhook.route.ts
│   ├── services/           # Business logic
│   │   ├── database/       # Database operations
│   │   └── emailNotifications/  # Email services
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── validators/         # Input validation
│   ├── errors/             # Custom error classes
│   └── index.ts            # Application entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
└── package.json
```

## 🚀 Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Contentful account (for CMS integration)
- Resend account (for email notifications)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd busola-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section)

4. **Set up the database**

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on the port specified in your `.env` file (default: 3050).

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3050
NODE_ENV=development  # or 'prod' for production
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/busola
DIRECT_URL=postgresql://user:password@localhost:5432/busola

# JWT Authentication
JWT_SECRET=your-cookie-secret
JWT_SECRET_KEY=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret

# Contentful CMS
CONTENTFUL_SPACE_ID=your-contentful-space-id
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_API_KEY=your-contentful-api-key

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Webhooks
WEBHOOK_SECRET=your-webhook-secret
```

## 📚 API Documentation

The API documentation is automatically generated using Swagger and is available at:

```
http://localhost:3050/docs
```

### Main Endpoints

#### Authentication (`/auth`)

- `POST /auth/sign-in` - User login
- `POST /auth/sign-out` - User logout
- `POST /auth/reset-initial-password` - Reset initial password
- `POST /auth/reset-password-request` - Request password reset
- `POST /auth/verify-code` - Verify reset code
- `POST /auth/reset-password` - Complete password reset
- `POST /auth/refresh-token` - Refresh access token

#### Dashboard (`/dashboard`)

All dashboard endpoints require authentication (cookie-based).

- `GET /dashboard/current-user` - Get current user with enrolled courses
- `GET /dashboard/course/:courseId` - Get course details with lessons
- `GET /dashboard/course/:courseId/lesson/:lessonId` - Get lesson details
- `POST /dashboard/course/:courseId/lesson/:lessonId/notes` - Save lesson notes
- `POST /dashboard/course/:courseId/lesson/:lessonId/complete` - Mark lesson complete
- `GET /dashboard/course/:courseId/lesson/:lessonId/quiz/:quizId` - Get quiz
- `POST /dashboard/course/:courseId/lesson/:lessonId/quiz/:quizId` - Submit quiz answers

#### Webhooks (`/webhook`)

Protected by webhook secret in Authorization header.

- `POST /webhook/cms` - Contentful webhook for content updates
- `POST /webhook/shop` - Online shop integration webhook

### Authentication

The API uses cookie-based JWT authentication. Protected endpoints require an `access_token` cookie. Tokens expire after 1 hour, with refresh tokens valid for 7 days.

## 🗄 Database Schema

### Core Models

- **User** - User accounts with authentication details
- **Course** - Course information with CMS sync
- **Lesson** - Individual lessons with content and videos
- **Quiz** - Quiz definitions with question pool
- **Question** - Quiz questions (single/multiple/open-ended)
- **Answer** - Answer options for questions
- **UserToCourse** - User-course enrollment relationship
- **UserToLesson** - Lesson progress and notes
- **QuizAttempt** - Quiz submission records
- **QuestionResponse** - User's answers to questions
- **AnswerSelection** - Selected answers for multiple choice

### Key Relationships

- Users enroll in multiple Courses
- Courses contain multiple Lessons (ordered)
- Lessons can have one Quiz
- Quizzes contain multiple Questions
- Questions have multiple Answers
- Users track progress per Lesson
- Quiz Attempts record user performance

### CMS Integration

All content models (Course, Lesson, Quiz, Question, Answer) have a `cmsId` field for synchronization with Contentful CMS via webhooks.

## 💻 Development

### Running the Development Server

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

### Running Tests

```bash
npm test           # Run once
npm run test:watch # Watch mode
```

### Database Operations

```bash
# Generate Prisma client
npm run prisma:generate

# Create a migration
npm run prisma:migrate

# Format schema file
npm run prisma:format

# Pull schema from database
npm run prisma:pull

# Full schema workflow (format + migrate + generate)
npm run prisma:schema
```

### Building for Production

```bash
npm run build
npm start
```

## 📜 Scripts

| Script                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start development server with hot reload |
| `npm start`               | Start production server                  |
| `npm run build`           | Build for production                     |
| `npm run typecheck`       | Type check without emitting              |
| `npm run lint`            | Lint TypeScript files                    |
| `npm run format`          | Check code formatting                    |
| `npm test`                | Run tests                                |
| `npm run prisma:generate` | Generate Prisma client                   |
| `npm run prisma:migrate`  | Run database migrations                  |

## 🔒 Security Features

- **Password Security**: Passwords hashed using bcrypt
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS**: Configured for specific frontend origin
- **Webhook Security**: Authorization header validation
- **Environment Variables**: Sensitive data in environment

## 🏗 Architecture Notes

### Fastify Configuration

The Fastify instance is configured at `src/config/fastify/fastify.ts` with:

- Cookie parsing with secure options
- JWT authentication
- CORS configuration
- Global authentication hook for protected routes

### Schema Validation

The project uses Swagger/OpenAPI schemas for request validation. Schemas are defined in `src/config/fastify/swagger.ts` and registered using `fastify.addSchema()` to enable `$ref` resolution in route handlers.

### Error Handling

Custom error classes in `src/errors/`:

- `ForbiddenError` - Access denied
- `InvalidPayloadError` - Bad request data
- `NotFoundError` - Resource not found

### Content Sync

The CMS webhook handler processes Contentful events and updates the database accordingly. Content is managed in Contentful and automatically synchronized to the database.

## 🚀 Future Features

The following features are planned for implementation in the near future:

### E-commerce Integration

- **Online Shop Webhook Integration**: Automatic user account creation when a product is purchased through the external online shop
- Enhanced user onboarding flow for purchased courses
- Course access provisioning based on product purchases

### Communication Platform

- **Slack Integration**: Native integration with Slack for seamless student-teacher communication
- Webhook endpoint for Slack Events API to receive teacher responses (`POST /webhook/chat`)
- Slack API integration to allow students to send messages to teachers
- Thread-based conversations for organized Q&A
- Notification system for new messages

### Testing & Quality Assurance

- **Unit Tests**: Comprehensive unit tests for business logic and utilities
- **Integration Tests**: End-to-end testing for API endpoints
- Test coverage reporting
- Automated testing in CI/CD pipeline

These features will enhance the platform's capabilities by providing seamless e-commerce integration, built-in communication tools, and improved code quality through comprehensive testing.

---

**Note**: This is a private project. Ensure all environment variables are properly configured before running.
