# My Cloud

English | [Русская версия](README.ru.md)

## Cloud Storage Web Application

- user registration and authentication based on Django sessions and CSRF cookies
- administrative user management interface
- personal file storage with upload, preview, download, rename, comments, and share-link enable/disable flows

## Stack

- Backend: Django + PostgreSQL
- Frontend: React (Vite) + Redux + React Router
- Deploy: Docker Compose + Nginx as a single entrypoint

## Deployment Architecture

The application is served under a single URL such as `http://<SERVER_IP>/`:

- `Nginx` serves the built frontend
- `Nginx` proxies `/api/` requests to the Django backend
- `PostgreSQL` runs inside the Docker network and is not exposed publicly
- user files are stored in a Docker volume

## Requirements

- Ubuntu 24.04 LTS or a similar Linux VPS
- Docker Engine + Docker Compose plugin
- Port `80` open for HTTP traffic
- Git

## Environment Variables

File: `backend/.env`

Minimum example:

```env
ADMIN_PASSWORD=change-me
SECRET_KEY=replace-with-a-strong-secret-key
DJANGO_ALLOWED_HOSTS=<SERVER_IP>,localhost,127.0.0.1
DJANGO_CSRF_TRUSTED_ORIGINS=http://<SERVER_IP>,http://localhost,http://127.0.0.1,http://localhost:5173,http://127.0.0.1:5173

POSTGRES_DB=my_cloud
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432

STORAGE_ROOT=/data/storage
```

## Quick Start On A Remote Server

### 1. Connect over SSH

`ssh deploy@<SERVER_IP>`

### 2. Clone the repository

`sudo mkdir -p /opt/my_cloud`

`sudo chown -R deploy:deploy /opt/my_cloud`

`cd /opt/my_cloud`

`git clone <REPO_URL>`

`cd <REPO_DIR>`

### 3. Create the environment file

`nano backend/.env`

### 4. Build and start the application

`docker compose up --build -d`

### 5. Verify that it works

Open in a browser:

`http://<SERVER_IP>/`

#### API check

`curl http://127.0.0.1/api/auth/csrf/`

#### Initial administrator

A bootstrap superuser with login `admin` is created from migration on first database initialization.

The initial password is taken from `ADMIN_PASSWORD` in `backend/.env`.

Changing `ADMIN_PASSWORD` later does not automatically update the password of an already existing `admin` user.

Use a strong unique password before the first deployment.

## Local Verification Before Deployment

This mode is intended for validating the integrated stack before deploying to a VPS.
Behavior is equivalent to the server deployment, but the application is accessed through `localhost`.

### Requirements (local)

- Docker Desktop (WSL2) or Docker Engine
- Docker Compose plugin
- Git

### Run

From the monorepo root:

#### 1. Prepare `backend/.env`

Create:

`backend/.env`

Example:

```env
ADMIN_PASSWORD=change-me
SECRET_KEY=replace-with-a-strong-secret-key

DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost,http://127.0.0.1,http://localhost:5173,http://127.0.0.1:5173

POSTGRES_DB=my_cloud
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432

STORAGE_ROOT=/data/storage
```

#### 2. Build and run the containers

`docker compose up --build`

Or in detached mode:

`docker compose up --build -d`

#### 3. Check the application

Open:

`http://localhost/`

API check:

`curl http://localhost/api/auth/csrf/`

#### 4. Stop the stack

`docker compose down`

## API Endpoints

All endpoints are available under the `/api/` prefix.

### Authentication

- **GET `/api/auth/csrf/`**
  Issue a CSRF cookie.

- **POST `/api/auth/register/`**
  Register a new user.
  JSON:

  ```json
  {
    "username": "user1",
    "full_name": "User One",
    "email": "user@example.com",
    "password": "Secret#1"
  }
  ```

- **POST `/api/auth/login/`**
  Sign in.

- **GET `/api/auth/logout/`**
  End the current session.

- **GET `/api/auth/me/`**
  Return information about the current user.

### User Administration

- **GET `/api/admin/users/`**
  List users visible to the current administrator together with storage metadata.

- **DELETE `/api/admin/users/<user_id>/?delete_files=1`**
  Delete a user.
  `delete_files=1` also removes the user's files and storage directory.

- **PATCH `/api/admin/users/<user_id>/level/`**
  Change user level.
  JSON:

  ```json
  {
    "level": "user | admin | senior_admin | superuser"
  }
  ```

### File Operations

- **POST `/api/files/upload/`**
  Upload a file.
  `multipart/form-data` fields:
  - `file`
  - `comment` optional

- **GET `/api/files/`**
  List files of the current user.

- **GET `/api/files/?user_id=<int>`**
  For administrators, list files of another user when permissions allow it.

- **DELETE `/api/files/<file_id>/`**
  Delete a file.

- **PATCH `/api/files/<file_id>/rename/`**
  Rename a file.
  JSON:

  ```json
  { "name": "new_name.txt" }
  ```

- **PATCH `/api/files/<file_id>/comment/`**
  Update the file comment.
  Empty string is allowed.
  JSON:

  ```json
  { "comment": "new comment" }
  ```

- **GET `/api/files/<file_id>/download/`**
  Download a file.
  Query:
  - `mode=preview` opens inline when supported by the browser
  - otherwise the file is downloaded as an attachment

- **POST `/api/files/<file_id>/share/`**
  Create or enable a public share link.

- **POST `/api/files/<file_id>/share/disable/`**
  Disable a public share link.

- **GET `/api/share/<uuid>`**
  Download a file through a public share link.
