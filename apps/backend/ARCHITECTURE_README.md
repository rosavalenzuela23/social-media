# Social Media Backend Architecture

## Overview

This is a **Fastify-based backend API** for a social media platform, built with a **clean architecture pattern** that separates concerns into domain, application, and infrastructure layers. The project uses **TypeScript** and employs **dependency injection** through **tsyringe** to manage service dependencies.

The backend integrates with two databases:
- **MongoDB** for general application data (posts, comments, likes, sessions)
- **PostgreSQL** for profile-specific data

## Technology Stack

### Core Framework
- **Fastify** (v5.7.4) - A fast and low-overhead web framework
- **TypeScript** - For type safety and better development experience

### Databases
- **MongoDB** (via TypeORM) - NoSQL database for flexible document storage
- **PostgreSQL** (via TypeORM) - Relational database for structured profile data
- **TypeORM** (v0.3.20) - ORM for database abstraction

### Dependencies
- **@fastify/cors** - CORS support for cross-origin requests
- **@fastify/cookie** - Cookie management
- **@fastify/session** - Session management with MongoDB store
- **@fastify/multipart** - Multipart form data handling (file uploads)
- **@fastify/swagger** & **@fastify/swagger-ui** - API documentation
- **bcrypt** - Password hashing and verification
- **sharp** (v0.34.5) - Image processing for profile pictures
- **tsyringe** (v4.10.0) - Dependency injection container
- **uuid** - Unique identifier generation

## Architecture Pattern

The codebase follows a **Clean Architecture** pattern with three main layers:

### 1. **Domain Layer** (`/domain`)
Contains **pure business logic** and domain entities. This layer is independent of any external frameworks or libraries.

**Responsibilities:**
- Define domain entities (User, Post, Profile, Comment, Like)
- Implement business logic within entities
- No dependencies on external libraries (except reflect-metadata for decorators)

**Example:** `Post` class with `PostBuilder` pattern for entity construction

### 2. **Application Layer** (`/application`)
Contains **use cases and business rules** that orchestrate the domain layer.

**Responsibilities:**
- Service classes that use domain entities and repositories
- Business logic coordination
- Exception handling specific to the domain
- Port definitions (interfaces) for dependency injection

**Composition:** Uses dependency injection to receive repository and service dependencies

**Example:** `UserService`, `ProfileService`, `PostsService`

### 3. **Infrastructure Layer** (`/infrastructure` or `/infraestructure`)
Handles **external concerns**: HTTP handling, database persistence, file storage, and framework integration.

**Responsibilities:**
- **Handlers/Controllers** - HTTP request/response handling
- **Routes** - Endpoint definitions and HTTP method mapping
- **Persistence** - Repository implementations, entities, and mappers
- **Schemas** - Request/response validation schemas
- **External Services** - Third-party integrations
- **Utilities** - Framework-specific helpers

**Composition:** Depends on application layer services and domain entities

## Folder Structure and Organization

```
src/
├── auth/
│   ├── application/
│   │   ├── ports/               # Interfaces for dependency injection
│   │   │   └── user.port.ts     # IUserRepository interface
│   │   ├── exceptions.ts        # Domain-specific exceptions
│   │   └── user.service.ts      # Business logic for user operations
│   ├── domain/
│   │   ├── user.ts              # User entity
│   │   └── role.ts              # Role entity
│   └── infraestructure/
│       ├── handlers/
│       │   └── user.handler.ts  # HTTP request handlers (controller)
│       ├── persistance/
│       │   └── entities/
│       │       └── user.entity.ts # TypeORM entity mapping
│       ├── schemas/
│       │   ├── create-user.schema.ts
│       │   └── login.schema.ts  # Fastify validation schemas
│       └── routes.ts            # Route definitions
│
├── profiles/
│   ├── application/
│   │   ├── ports/
│   │   │   ├── profile.repository.ts # IProfileRepository interface
│   │   │   └── file.manager.ts       # IFileManager interface
│   │   ├── exceptions.ts
│   │   └── profile.service.ts   # Profile business logic
│   ├── domain/
│   │   ├── user.ts              # Profile domain model
│   │   └── like.enum.ts         # Like text options enum
│   └── infraestructure/
│       ├── di.ts                # Dependency injection container setup
│       ├── handlers/
│       │   └── profile.handler.ts
│       ├── persistance/
│       │   ├── entities/
│       │   │   └── profile.entity.ts # PostgreSQL entity
│       │   ├── repositories/
│       │   │   └── postgres.repository.ts # IProfileRepository implementation
│       │   ├── mappers/
│       │   │   └── profile.mapper.ts # Entity ↔ Domain ↔ DTO mapping
│       │   └── postgres-connection.ts # PostgreSQL connection setup
│       ├── schemas/
│       │   ├── create-profile.schema.ts
│       │   ├── update-profile.schema.ts
│       │   └── ...
│       └── routes.ts
│
├── posts/
│   ├── application/
│   │   ├── ports/
│   │   └── posts.service.ts
│   ├── domain/
│   │   ├── post.ts
│   │   ├── comment.ts
│   │   ├── like.ts
│   │   └── image.ts
│   └── infrastructure/
│       ├── handlers/
│       │   └── post.handler.ts
│       ├── persistance/
│       │   ├── entities/
│       │   └── repositories/
│       ├── schemas/
│       └── routes.ts
│
├── shared/
│   ├── infrastructure/
│   │   ├── fastify/
│   │   │   ├── app.ts           # Fastify app initialization and setup
│   │   │   ├── auth-hook.ts     # Authentication middleware
│   │   │   └── ...
│   │   └── persistance/
│   │       ├── mongo-connection.ts # MongoDB setup (general app data)
│   │       └── ...
│   └── utils/
│       └── sharp.converter.ts   # Image processing utilities
│
├── types/
│   └── fastify.d.ts             # TypeScript type extensions for Fastify
│
├── main.ts                      # Application entry point
└── seed.ts                      # Database seeding script
```

## Why the Architecture is Divided This Way

### **Domain Layer Independence**
- **Business Logic Isolation**: Domain logic is framework-agnostic, making it easy to test and reuse
- **Reusability**: Domain entities and logic can be used in CLI apps, background jobs, or other services
- **Maintainability**: Changes to external tools don't affect core business logic

### **Application Layer Orchestration**
- **Use Case Encapsulation**: Each service handles a specific business capability
- **Dependency Injection Contracts**: Ports define clear contracts between layers
- **Exception Handling**: Domain-specific exceptions are defined here and propagated to the infrastructure layer

### **Infrastructure Layer Separation**
- **Framework Flexibility**: Swapping Fastify for Express or another framework requires only changing the infrastructure layer
- **Database Agnostic**: Repository implementations can change without affecting business logic
- **External Services**: Third-party integrations (file storage, email, etc.) are isolated here
- **Validation & Serialization**: Request validation (schemas) and response mapping (DTOs) happen here

## Data Flow

```
HTTP Request
    ↓
[Routes] → Validate with Schema
    ↓
[Handler/Controller] → Extract session/params/body
    ↓
[Service] → Fetch from Repository, Execute Business Logic
    ↓
[Repository] → Query Database via TypeORM Entity
    ↓
[Mapper] → Convert Entity ↔ Domain Model ↔ DTO
    ↓
[Response] → Return to Handler → HTTP Response
```

## Fastify Setup (`src/shared/infrastructure/fastify/app.ts`)

The main Fastify configuration handles:

### 1. **HTTPS Support**
```typescript
if (process.env.OVER_HTTPS === "true") {
  // Load SSL certificates
}
```

### 2. **Plugin Registration** (`registerModules`)
- **Multipart** - File upload handling with limits (10MB per file, max 5 files)
- **CORS** - Cross-origin requests with configurable origins
- **Cookies** - Cookie management
- **Session** - Server-side sessions stored in MongoDB with secure settings

### 3. **Route Registration** (`registerRoutes`)
- `/api/users` - User authentication and management (auth module)
- `/api/posts` - Post operations, comments, and likes (posts module)
- `/api/profiles` - Profile management and pictures (profiles module)

### 4. **Swagger Documentation** (`registerSwagger`)
- Disabled in production for security
- Available at `/api/docs`
- Provides interactive API exploration

## Database Connections

### **MongoDB** (`mongo-connection.ts`)
Stores general application data:
- Posts, Comments, Images, Likes
- User sessions
- Authentication data

**TypeORM Configuration:**
- Type: `mongodb`
- Default port: `27017`
- Entities: ProfileEntity, UserEntity, PostEntity, ImageEntity, CommentEntity, LikeEntity
- Auto-synchronize schema

### **PostgreSQL** (`postgres-connection.ts`)
Dedicated to profile data:
- Profile information
- Friend lists
- Block lists
- Profile pictures metadata

**TypeORM Configuration:**
- Type: `postgres`
- Default port: `5432`
- Entities: ProfileEntity
- Auto-synchronize schema

## Dependency Injection with tsyringe

The project uses **tsyringe** for dependency injection, enabling loose coupling and easier testing.

### **Setup Example** (`profiles/infraestructure/di.ts`)
```typescript
container.register(IProfileRepository, {
  useValue: new PostgresRepository(),
});

container.register(IFileManager, {
  useValue: new SharpManager(profilePicturesFolder),
});
```

### **Usage in Services**
```typescript
@injectable()
export class ProfileService {
  constructor(
    @inject(IProfileRepository) private repository: IProfileRepository,
    @inject(IFileManager) private fileManager: IFileManager,
  ) {}
}
```

### **Usage in Controllers**
```typescript
const controller = container.resolve(ProfileController);
```

## Module Breakdown

### **Auth Module** (`/auth`)
**Responsibilities:** User authentication and authorization

**Key Files:**
- `user.service.ts` - Login, user creation, password validation
- `user.handler.ts` - HTTP handlers for auth endpoints
- `user.port.ts` - IUserRepository interface

**Endpoints:**
- `POST /api/users/login` - Authenticate user
- `GET /api/users/logout` - Clear session
- `POST /api/users` - Create new user
- `GET /api/users` - List all users (requires auth)

**Features:**
- Password hashing with bcrypt
- Session-based authentication
- Session storage in MongoDB

### **Profiles Module** (`/profiles`)
**Responsibilities:** User profile management and social features

**Key Files:**
- `profile.service.ts` - Profile CRUD, friend/block management
- `profile.handler.ts` - HTTP handlers
- `profile.repository.ts` - PostgreSQL repository
- `profile.mapper.ts` - Entity ↔ Domain mapping
- `di.ts` - Dependency injection setup

**Endpoints:**
- `POST /api/profiles/me` - Create profile
- `GET /api/profiles/me` - Get own profile
- `GET /api/profiles/:profileId` - Get another user's profile
- `PUT /api/profiles/me` - Update profile (bio, like text)
- `POST /api/profiles/me/picture` - Upload profile picture
- `GET /api/profiles/:profileId/picture` - Retrieve profile picture
- `GET /api/admin/profiles` - Admin: list all profiles

**Features:**
- Friend management (add/remove)
- Block users functionality
- Profile pictures upload with image compression (Sharp)
- Profile bio and customizable "like" text
- File storage with organized directory structure

### **Posts Module** (`/posts`)
**Responsibilities:** Post creation, comments, and likes

**Key Files:**
- `posts.service.ts` - Post operations
- `post.handler.ts` - HTTP handlers
- `post.ts` - Post entity with PostBuilder pattern
- `comment.ts` - Comment entity
- `like.ts` - Like entity

**Endpoints:**
- `POST /api/posts` - Create new post
- `GET /api/posts/feed` - Get paginated feed
- `GET /api/posts/me` - Get current user's posts
- `GET /api/posts/:postId` - Get single post
- `GET /api/posts/images/:uuid` - Get post image
- `PUT /api/posts/:postId/like` - Like/unlike post
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Add comment to post
- `POST /api/posts/:postId/comments/:commentId/like` - Like a comment

**Features:**
- Image attachments
- Comments with nested liking
- Social likes with configurable text
- Post exclusion lists (content filtering)
- Pagination support

## Authentication & Authorization

### **Session-Based Authentication**
- Uses `@fastify/session` with MongoDB store
- Session cookie is `httpOnly`, `secure`, and `sameSite: lax`
- Session stored in MongoDB with automatic TTL
- Default max age: 24 hours

### **Auth Middleware** (`auth-hook.ts`)
```typescript
requireAuth: async (request, reply) => {
  if (!request?.session?.user) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
```

### **Protected Routes**
- Most routes require authentication via `requireAuth` middleware
- Post routes have a global preHandler for auth
- User creation and login are public endpoints

## Error Handling

### **Domain Exceptions**
- `UserNotFoundException` - User not found in database
- `UserAlreadyExistsException` - User already exists
- Custom exceptions per module

### **Error Propagation**
```
Handler → Service → throws Exception
                      ↓
                  Handler catches → HTTP 400/404 response
```

## Mappers Pattern

Mappers handle transformations between layers:

```typescript
// Entity → Domain Model
ProfileMapper.toDomain(profileEntity): Profile

// Domain Model → DTO (for response)
ProfileMapper.toDto(profile): { username, uuid, ... }

// Domain Model → Entity (for persistence)
ProfileMapper.toEntity(profile): ProfileEntity
```

This separation ensures:
- Database schema can change without affecting API responses
- Business logic operates on domain models only
- DTOs expose only necessary fields to clients

## Request Validation

Fastify uses **Ajv** (JSON Schema validator) with schemas:

**Example Schema:**
```typescript
// posts/infrastructure/schemas/post.schema.ts
{
  body: {
    type: "object",
    required: ["message"],
    properties: {
      message: { type: "string" },
      images: { type: "array" }
    }
  }
}
```

- Validation happens before reaching handlers
- Invalid requests return `400 Bad Request`
- Schemas are type-safe with TypeScript interfaces

## Image Processing & Storage

**Components:**
- **Sharp** - Image compression and format conversion
- **SharpManager** (utils) - Wrapper for image operations
- **FileManager Port** - Interface for file storage operations

**Features:**
- Profile picture upload and retrieval
- Automatic image compression
- WebP format support
- Organized storage by user UUID

## Running the Application

### **Development**
```bash
npm run dev
```
Runs with watch mode and pretty-printed logs (pino-pretty)

### **Build**
```bash
npm run build
```
Compiles TypeScript and minifies with esbuild

### **Debug**
```bash
npm run debug
```
Node inspector for debugging

### **Database Seeding**
```bash
npm run db:seed
```
Populates databases with initial data

## Configuration

All configuration via environment variables:

### **Server**
- `APP_PORT` - Server port (default: 3000)
- `WEB_HOST` - Server host (default: localhost)
- `ENVIRONMENT` - production/development (controls Swagger)
- `OVER_HTTPS` - Enable HTTPS (true/false)
- `SSL_KEY_PATH`, `SSL_CERT_PATH` - SSL certificate paths

### **CORS**
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

### **Session**
- `FASTIFY_SESSION_SECRET` - Secret for session encryption
- `MONGO_URL` - MongoDB connection string (for session store)

### **MongoDB**
- `MONGO_HOST` - MongoDB host (default: localhost)
- `MONGO_PORT` - MongoDB port (default: 27017)

### **PostgreSQL (Profiles)**
- `PROFILE_DB_HOST` - PostgreSQL host
- `PROFILE_DB_PORT` - PostgreSQL port (default: 5432)
- `PROFILE_DB_USER` - PostgreSQL username
- `PROFILE_DB_PASSWORD` - PostgreSQL password

### **File Storage**
- `PROFILE_PICTURES_FOLDER` - Directory for storing profile pictures

## Testing

The project uses **Vitest** for testing:
```bash
npm run test
```

Test files are located near the code they test.

## Key Design Decisions

1. **Dual Database Strategy**
   - MongoDB for flexible document data (posts, comments)
   - PostgreSQL for structured profile data
   - Allows optimal schema design per data type

2. **Builder Pattern for Complex Entities**
   - `PostBuilder` enables fluent API for constructing complex posts
   - Ensures immutability and validation during construction

3. **Mapper Pattern**
   - Clear separation between data layers
   - Enables database schema evolution without API changes
   - Supports DTOs for response filtering

4. **Port-Based Dependency Injection**
   - Services depend on interfaces, not implementations
   - Easy to swap implementations (e.g., PostgreSQL → MongoDB)
   - Facilitates testing with mock implementations

5. **Session-Based Auth**
   - Simpler than JWT for monolithic backends
   - Server-side state allows immediate logout
   - MongoDB persistence enables scalability

## Summary

This architecture provides:
- ✅ **Clear separation of concerns** - Domain, Application, Infrastructure
- ✅ **Framework agnostic** - Business logic independent of Fastify
- ✅ **Testability** - Mock dependencies easily via tsyringe
- ✅ **Scalability** - Async handlers, session persistence in MongoDB
- ✅ **Type safety** - Full TypeScript throughout
- ✅ **Maintainability** - Well-organized folder structure
- ✅ **Flexibility** - Easy to add new modules following the pattern
