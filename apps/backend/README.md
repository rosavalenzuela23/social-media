# SocialMedia

This project is built using **Bun** and **pnpm**.

## Security Note

To ensure a secure development lifecycle, this project is configured to use **SSL/TLS (HTTPS)** by default. You must generate the necessary local certificates before starting the application.

## Prerequisites

- [Bun](https://bun.sh)
- [pnpm](https://pnpm.io)

## Initialization

Follow these steps to set up the project locally:

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Open the newly created `.env` file and fill in the configuration options:

#### General Application Settings
- **`APP_PORT`**: The port number on which the Fastify backend server will listen (e.g., `3000`).
- **`WEB_HOST`**: The hostname or IP address the server will bind to (e.g., `127.0.0.1` or `0.0.0.0`).
- **`FASTIFY_SESSION_SECRET`**: A random, long, secure string used to sign session cookies.
- **`ENVIRONMENT`**: Set to `development` or `production`. In development mode, Swagger API documentation is exposed at `/api/docs`.
- **`ALLOWED_ORIGINS`**: A comma-separated list of permitted CORS origins (e.g., `http://localhost:5173,http://localhost:4200`).

#### Database Settings

##### PostgreSQL (Used for profile information)
- **`PROFILE_DB_PORT`**: Port of the PostgreSQL instance (defaults to `5432`).
- **`PROFILE_DB_HOST`**: Host address of the PostgreSQL database (e.g., `localhost` or Docker service name).
- **`PROFILE_DB_USER`**: Username to connect to PostgreSQL (e.g., `postgres`).
- **`PROFILE_DB_PASSWORD`**: Password to connect to PostgreSQL.

##### MongoDB (Used for session storage, users, and post data)
- **`MONGO_PORT`**: Port of the MongoDB instance (defaults to `27017`).
- **`MONGO_HOST`**: Host address of the MongoDB database (e.g., `localhost` or Docker service name).
- **`MONGO_URL`**: Full MongoDB connection URI, used by both TypeORM and the Fastify session store (e.g., `'mongodb://localhost:27017/social_media'`).

#### File Uploads
- **`UPLOAD_FOLDER`**: The absolute path to the directory where uploaded assets (e.g., post images) will be stored on your local disk.

#### SSL / HTTPS Settings
- **`OVER_HTTPS`**: Set to `true` to enable HTTPS, or `false` to use standard HTTP.
- **`SSL_CERT_PATH`**: Relative or absolute path to the SSL certificate file (e.g., `./ssl/test.crt`).
- **`SSL_KEY_PATH`**: Relative or absolute path to the SSL private key file (e.g., `./ssl/test.key`).

### 3. Generate SSL Certificates

Run the custom script to generate the self-signed certificate and key files required for the development server:

```bash
pnpm create:certs
```

> **Note:** The generated certificates are stored in the `ssl/` directory (as per `.gitignore`) and should not be committed to version control.

### 4. Start the Server

Once the certificates are in place, you can start the development server:

```bash
pnpm dev
```

