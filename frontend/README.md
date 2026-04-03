# My Cloud Frontend

English | [Русская версия](README.ru.md)

Frontend application for the `My Cloud` platform.

## Role

The frontend provides:

- login and registration flows
- authenticated file management UI
- public share-link interactions
- administrative user management screens
- single-page navigation over the backend API

## Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios

## Main Areas

- `src/api/`
  HTTP client and API wrappers
- `src/features/auth/`
  authentication state and bootstrap flow
- `src/features/files/`
  file list, upload, delete, and metadata updates
- `src/features/adminUsers/`
  admin user list, deletion, and level-change flows
- `src/pages/`
  route-level UI for login, registration, files, and admin users
- `src/components/`
  reusable UI pieces and modal dialogs

## Local Development

### Requirements

- Node.js 18+
- Yarn or npm

### Setup

```bash
cd frontend
yarn install
yarn dev
```

## Development Flow

- Vite dev server runs on port `5173`
- backend development server typically runs on port `8000`
- Vite proxies `/api` requests to the backend
- Axios sends cookies and adds `X-CSRFToken` automatically for mutating requests

## Routes

- `/`
  current user's file list
- `/?userId=<id>`
  another user's file list when opened by an authorized admin
- `/admin/users`
  administrative users page
- `/login`
  sign-in page
- `/register`
  registration page

## Functional Areas

- authentication bootstrap through `/api/auth/me/`
- file upload, download, rename, comment, delete, and share-link flows
- admin user list with role hierarchy support
- role changes and user deletion through modal-driven actions
- protected routing for authenticated areas

## Notes

- The integrated deployment path is handled from the repository root through Docker Compose and Nginx
- Root-level documentation is the primary source of truth for deployment instructions
