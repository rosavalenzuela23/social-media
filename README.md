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

### 2. Generate SSL Certificates

Run the custom script to generate the self-signed certificate and key files required for the development server:

```bash
pnpm create:certs
```

> **Note:** The generated certificates are stored in the `ssl/` directory (as per `.gitignore`) and should not be committed to version control.

### 3. Start the Server

Once the certificates are in place, you can start the development server:

```bash
pnpm dev
```

#Prueba
