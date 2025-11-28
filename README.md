# Kiroku API

This is the backend API for Kiroku, an application for tracking and reviewing anime.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/kiroku.git
    cd kiroku
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/kiroku"
    JWT_SECRET="your-secret-key-here"
    PORT=3000
    ```
    Replace `user` and `password` with your PostgreSQL credentials, and set a secure `JWT_SECRET`.

4.  **Start the database:**
    ```bash
    docker-compose up -d
    ```

5.  **Run Prisma migrations:**
    ```bash
    npx prisma migrate dev
    ```

6.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```

### Running the Application

-   **Development:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000` and will automatically restart on file changes using nodemon.

-   **Production:**
    ```bash
    npm run build
    npm start
    ```

## API Routes

### User Routes

-   `POST /api/users/register`
    -   Register a new user.
    -   Request body: `{ "username": "string", "email": "string", "password": "string" }`

-   `POST /api/users/login`
    -   Login with existing credentials.
    -   Request body: `{ "email": "string", "password": "string" }`
    -   Returns: JWT token

-   `GET /api/users/profile`
    -   Get the authenticated user's profile.
    -   Requires: Bearer token in Authorization header

### Anime Routes

-   `GET /api/anime/search?q=:query`
    -   Searches for anime by name using Jikan API.
    -   Query parameters:
        -   `q` (string, required): The name of the anime to search for.

-   `GET /api/anime/:animeId`
    -   Retrieves an anime by its Jikan ID.
    -   URL parameters:
        -   `animeId` (integer, required): The Jikan ID of the anime.

-   `POST /api/anime/:animeId/review`
    -   Create a review for an anime.
    -   Requires: Bearer token in Authorization header
    -   URL parameters:
        -   `animeId` (integer, required): The Jikan ID of the anime.
    -   Request body: `{ "rating": "number", "comment": "string" }`

-   `GET /api/anime/:animeId/reviews`
    -   Get all reviews for a specific anime.
    -   URL parameters:
        -   `animeId` (integer, required): The Jikan ID of the anime.

## Database Schema

The application uses Prisma ORM with PostgreSQL. The main models are:

- **User**: User accounts with authentication
- **Anime**: Cached anime data from Jikan API
- **Review**: User reviews for anime

To view the database schema, check `prisma/schema.prisma`.

## Development

### Prisma Commands

- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes without migrations

### Project Structure

- `src/api/routes/` - API route definitions
- `src/api/controllers/` - Route handlers
- `src/api/services/` - Business logic
- `src/api/middlewares/` - Authentication and error handling
- `prisma/` - Database schema and migrations

## License

This project is licensed under the MIT License.
