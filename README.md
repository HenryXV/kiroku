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
    
-----

##  Base Configuration

**Base URL:**
`http://localhost:3000/api/v1`

**Authentication:**
This API uses **JWT (JSON Web Tokens)**.
Routes under `/anime` are **protected** and require a valid token in the request header.

* **Header Key:** `Authorization`
* **Header Value:** `Bearer <your_token_here>`

-----

## User Routes (Public)

These routes are public and used to authenticate users.

### 1\. Register User

Create a new user account.

* **Endpoint:** `/user/register`
* **Method:** `POST`
* **Access:**  Public

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | ✅ Yes | User's email address. |
| `username` | `string` | ✅ Yes | Unique username. |
| `password` | `string` | ✅ Yes | User's password. |

#### Example Request

```json
{
  "email": "henry@example.com",
  "username": "henry_san",
  "password": "securePassword123"
}
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "henry@example.com",
    "username": "henry_san",
    "createdAt": "2023-10-27T10:00:00.000Z"
  }
}
```

-----

### 2\. Login

Authenticate a user and receive a JWT token.

* **Endpoint:** `/user/login`
* **Method:** `POST`
* **Access:**  Public

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | ✅ Yes | Registered email. |
| `password` | `string` | ✅ Yes | User's password. |

#### Example Request

```json
{
  "email": "henry@example.com",
  "password": "securePassword123"
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

-----

## 🎬 Anime Routes


### 1\. Search Anime

Search for anime by name using the Jikan API (cached locally).

* **Endpoint:** `/anime/search`
* **Method:** `GET`
* **Access:** Public

#### Query Parameters

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `q` | `string` | ✅ Yes | The search term (min 3 characters). |

#### Example Usage

`GET http://localhost:3000/api/v1/anime/search?q=cowboy`

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "jikanId": 1,
      "title": "Cowboy Bebop",
      "imageUrl": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
      "score": 8.75,
      "status": "Finished Airing"
    },
    {
      "jikanId": 5,
      "title": "Cowboy Bebop: Tengoku no Tobira",
      "imageUrl": "...",
      "score": 8.38,
      "status": "Finished Airing"
    }
  ]
}
```

-----

### 2\. Get Anime by ID

Get detailed information about a specific anime.

* **Endpoint:** `/anime/:animeId`
* **Method:** `GET`
* **Access:** Public

#### URL Parameters

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `animeId` | `number` | ✅ Yes | The **Jikan ID** (MAL ID) of the anime. |

#### Example Usage

`GET http://localhost:3000/api/v1/anime/1`

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 10,
    "jikanId": 1,
    "title": "Cowboy Bebop",
    "synopsis": "In the year 2071, humanity has colonized several of the solar system's planets...",
    "imageUrl": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
    "episodes": 26,
    "score": 8.75,
    "status": "Finished Airing",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  }
}
```
-----

## ✍️ Reviews Routes

Base Endpoint: `/review`
(Full URL: `http://localhost:3000/api/v1/review`)

### 1\. Create a Review

Submit a new review for a specific anime.

* **Endpoint:** `/`
* **Method:** `POST`
* **Access:** Protected (Requires Token)

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `jikanId` | `number` | ✅ Yes | The MAL ID of the anime (from Jikan API). |
| `rating` | `number` | ✅ Yes | Integer score from **1 to 10**. |
| `reviewText` | `string` | ❌ No | The written content of the review. |

#### Example Request

```json
{
  "jikanId": 1,
  "rating": 10,
  "reviewText": "Absolute masterpiece."
}
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "rating": 10,
    "reviewText": "Absolute masterpiece.",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "user": { "username": "henry_san" },
    "anime": { "title": "Cowboy Bebop", ... }
  }
}
```

-----

### 2\. Get My Reviews

Retrieve all reviews created by the currently logged-in user.

* **Endpoint:** `/user`
* **Method:** `GET`
* **Access:** Protected (Requires Token)

#### Example Request

`GET http://localhost:3000/api/v1/review/user`

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rating": 10,
      "reviewText": "Absolute masterpiece.",
      "anime": { "jikanId": 1, "title": "Cowboy Bebop" }
    },
    {
      "id": 5,
      "rating": 8,
      "reviewText": "Good, but slow start.",
      "anime": { "jikanId": 20, "title": "Naruto" }
    }
  ]
}
```

-----

### 3\. Get Reviews for an Anime

Retrieve all reviews for a specific anime.

* **Endpoint:** `/:animeId`
* **Method:** `GET`
* **Access:** Public

#### URL Parameters

* `:animeId` -\> The **Jikan ID** of the anime.

#### Example Request

`GET http://localhost:3000/api/v1/review/1`

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "rating": 9,
      "reviewText": "Great show!",
      "user": { "username": "henry_san" },
      "createdAt": "2023-10-27T12:00:00.000Z"
    }
  ]
}
```

## Error Handling

All errors return a standard JSON format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

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
