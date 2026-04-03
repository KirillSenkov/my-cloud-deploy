# My Cloud Backend

English | [Русская версия](README.ru.md)

Backend service for the `My Cloud` application.

## Role

The backend is responsible for:

- session-based authentication with CSRF protection
- user registration and profile bootstrap
- role-based user administration
- file metadata persistence in PostgreSQL
- filesystem-backed storage operations
- public share-link downloads

## Stack

- Django
- PostgreSQL
- `psycopg`
- `python-dotenv`
- Gunicorn for container runtime

## Main Areas

- `config/`
  Django project configuration, database setup, middleware, and URL wiring
- `users/`
  user model, authentication endpoints, role logic, and admin user management
- `storage/`
  file model, storage helpers, upload/download/share flows

## Environment

Expected environment file:

`backend/.env`

Key variables:

- `ADMIN_PASSWORD`
- `SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `STORAGE_ROOT`

## Local Development

This backend can be run directly for development, although the integrated Docker flow from the repository root is the main deployment-oriented path.

### Requirements

- Python 3.10+
- PostgreSQL

### Setup

1. Create a PostgreSQL database named `my_cloud`.
2. Configure database access through `backend/.env` or `config/settings.py`.
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply migrations:

   ```bash
   python manage.py migrate
   ```

5. Run the development server:

   ```bash
   python manage.py runserver
   ```

## Authentication Model

- authentication uses Django sessions
- CSRF protection is required for `POST`, `PATCH`, and `DELETE`
- `GET /api/auth/csrf/` issues the CSRF cookie used by the frontend

## Role Model

Supported levels:

- `user`
- `admin`
- `senior_admin`
- `superuser`

The backend enforces hierarchy-aware permissions for:

- viewing manageable users
- changing user levels
- deleting users
- accessing files owned by other users

## File Storage Model

- each user gets a dedicated storage directory
- uploaded files are stored under `STORAGE_ROOT`
- file metadata is persisted in PostgreSQL
- public sharing is implemented through UUID-based share tokens

## Main API Areas

### Authentication

- `GET /api/auth/csrf/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/logout/`
- `GET /api/auth/me/`

### User Administration

- `GET /api/admin/users/`
- `DELETE /api/admin/users/<id>/`
- `PATCH /api/admin/users/<id>/level/`

### File Operations

- `POST /api/files/upload/`
- `GET /api/files/`
- `DELETE /api/files/<id>/`
- `PATCH /api/files/<id>/rename/`
- `PATCH /api/files/<id>/comment/`
- `GET /api/files/<id>/download/`
- `POST /api/files/<id>/share/`
- `POST /api/files/<id>/share/disable/`
- `GET /api/share/<uuid>/`

## Container Runtime

In Docker, the backend container:

- installs dependencies from `requirements.txt`
- runs `python manage.py migrate`
- starts Gunicorn bound to `0.0.0.0:8000`
