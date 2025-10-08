# Kiroku API

This is the backend API for Kiroku, an application for tracking and reviewing anime.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/)
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
    ```
    Replace `user` and `password` with your PostgreSQL credentials.

4.  **Start the database:**
    ```bash
    docker-compose up -d
    ```

5.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

### Running the Application

-   **Development:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000` and will automatically restart on file changes.

-   **Production:**
    ```bash
    npm run build
    npm start
    ```

## API Routes

### Anime

-   `GET /api/anime/search?q=:query`
    -   Searches for anime by name.
    -   Query parameters:
        -   `query` (string, required): The name of the anime to search for.

-   `GET /api/anime/:animeId`
    -   Retrieves an anime by its Jikan ID.
    -   URL parameters:
        -   `animeId` (integer, required): The Jikan ID of the anime.
