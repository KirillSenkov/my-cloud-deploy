# My Cloud Frontend

[English version](README.md) | Русская версия

Frontend-приложение платформы `My Cloud`.

## Роль

Frontend предоставляет:

- сценарии входа и регистрации
- UI для управления файлами аутентифицированного пользователя
- взаимодействие с публичными share-ссылками
- административные экраны управления пользователями
- single-page navigation поверх backend API

## Стек

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios

## Основные Зоны

- `src/api/`
  HTTP client и API wrappers
- `src/features/auth/`
  состояние аутентификации и bootstrap flow
- `src/features/files/`
  список файлов, upload, delete и обновление метаданных
- `src/features/adminUsers/`
  список пользователей, удаление и смена уровней
- `src/pages/`
  route-level UI для login, registration, files и admin users
- `src/components/`
  переиспользуемые UI-компоненты и modal dialogs

## Локальная Разработка

### Требования

- Node.js 18+
- Yarn или npm

### Настройка

```bash
cd frontend
yarn install
yarn dev
```

## Dev Flow

- Vite dev server работает на порту `5173`
- backend dev server обычно работает на порту `8000`
- Vite проксирует запросы `/api` в backend
- Axios передаёт cookies и автоматически добавляет `X-CSRFToken` для mutating requests

## Маршруты

- `/`
  список файлов текущего пользователя
- `/?userId=<id>`
  список файлов другого пользователя при открытии авторизованным администратором
- `/admin/users`
  административная страница пользователей
- `/login`
  страница входа
- `/register`
  страница регистрации

## Функциональные Зоны

- bootstrap аутентификации через `/api/auth/me/`
- upload, download, rename, comment, delete и share-link сценарии для файлов
- список пользователей с учётом ролевой иерархии
- смена ролей и удаление пользователей через modal-driven actions
- protected routing для аутентифицированных разделов

## Примечания

- Интегрированный deployment path управляется из корня репозитория через Docker Compose и Nginx
- Root-level документация остаётся основным источником истины для инструкций по деплою
