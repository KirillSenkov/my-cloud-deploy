# My Cloud

[English version](README.md) | Русская версия

## Веб-приложение Облачного Хранилища

- регистрация пользователей и аутентификация на основе Django sessions и CSRF cookie
- административный интерфейс управления пользователями
- персональное файловое хранилище с загрузкой, предпросмотром, скачиванием, переименованием, комментариями и управлением публичными ссылками

## Стек

- Backend: Django + PostgreSQL
- Frontend: React (Vite) + Redux + React Router
- Deploy: Docker Compose + Nginx как единая точка входа

## Архитектура Деплоя

Приложение доступно по одному URL, например `http://<SERVER_IP>/`:

- `Nginx` раздаёт собранный frontend
- `Nginx` проксирует запросы `/api/` в Django backend
- `PostgreSQL` работает внутри Docker-сети и не публикуется наружу
- пользовательские файлы сохраняются в Docker volume

## Требования

- Ubuntu 24.04 LTS или аналогичный Linux VPS
- Docker Engine + Docker Compose plugin
- открытый порт `80` для HTTP
- Git

## Переменные Окружения

Файл: `backend/.env`

Минимальный пример:

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

## Быстрый Запуск На Удалённом Сервере

### 1. Подключиться по SSH

`ssh deploy@<SERVER_IP>`

### 2. Клонировать репозиторий

`sudo mkdir -p /opt/my_cloud`

`sudo chown -R deploy:deploy /opt/my_cloud`

`cd /opt/my_cloud`

`git clone <REPO_URL>`

`cd <REPO_DIR>`

### 3. Создать файл окружения

`nano backend/.env`

### 4. Собрать и запустить приложение

`docker compose up --build -d`

### 5. Проверить работу приложения

Открыть в браузере:

`http://<SERVER_IP>/`

#### Проверка API

`curl http://127.0.0.1/api/auth/csrf/`

#### Базовый администратор

При первой инициализации базы данных миграция создаёт bootstrap-superuser с логином `admin`.

Начальный пароль берётся из `ADMIN_PASSWORD` в `backend/.env`.

Если пользователь `admin` уже существует, последующее изменение `ADMIN_PASSWORD` не обновляет его пароль автоматически.

Перед первым деплоем укажи в `backend/.env` сильный уникальный пароль.

## Локальная Проверка Перед Деплоем

Этот режим нужен для проверки интегрированного стека перед размещением на VPS.
По поведению он эквивалентен серверному деплою, но приложение открывается через `localhost`.

### Требования

- Docker Desktop (WSL2) или Docker Engine
- Docker Compose plugin
- Git

### Запуск

Из корня монорепозитория:

#### 1. Подготовить `backend/.env`

Создать:

`backend/.env`

Пример:

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

#### 2. Собрать и запустить контейнеры

`docker compose up --build`

Или в фоне:

`docker compose up --build -d`

#### 3. Проверить приложение

Открыть:

`http://localhost/`

Проверка API:

`curl http://localhost/api/auth/csrf/`

#### 4. Остановить стек

`docker compose down`

## API Эндпоинты

Все эндпоинты доступны под префиксом `/api/`.

### Аутентификация

- **GET `/api/auth/csrf/`**
  Выдать CSRF cookie.

- **POST `/api/auth/register/`**
  Зарегистрировать нового пользователя.
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
  Выполнить вход.

- **GET `/api/auth/logout/`**
  Завершить текущую сессию.

- **GET `/api/auth/me/`**
  Вернуть информацию о текущем пользователе.

### Администрирование Пользователей

- **GET `/api/admin/users/`**
  Показать список пользователей, доступных текущему администратору, вместе с метаданными хранилища.

- **DELETE `/api/admin/users/<user_id>/?delete_files=1`**
  Удалить пользователя.
  `delete_files=1` также удаляет файлы пользователя и его директорию хранения.

- **PATCH `/api/admin/users/<user_id>/level/`**
  Изменить уровень пользователя.
  JSON:

  ```json
  {
    "level": "user | admin | senior_admin | superuser"
  }
  ```

### Работа С Файлами

- **POST `/api/files/upload/`**
  Загрузить файл.
  Поля `multipart/form-data`:
  - `file`
  - `comment` опционально

- **GET `/api/files/`**
  Показать файлы текущего пользователя.

- **GET `/api/files/?user_id=<int>`**
  Для администратора показать файлы другого пользователя, если это разрешено правами.

- **DELETE `/api/files/<file_id>/`**
  Удалить файл.

- **PATCH `/api/files/<file_id>/rename/`**
  Переименовать файл.
  JSON:

  ```json
  { "name": "new_name.txt" }
  ```

- **PATCH `/api/files/<file_id>/comment/`**
  Изменить комментарий к файлу.
  Пустая строка разрешена.
  JSON:

  ```json
  { "comment": "new comment" }
  ```

- **GET `/api/files/<file_id>/download/`**
  Скачать файл.
  Query:
  - `mode=preview` пытается открыть файл в браузере
  - иначе файл скачивается как attachment

- **POST `/api/files/<file_id>/share/`**
  Создать или включить публичную ссылку.

- **POST `/api/files/<file_id>/share/disable/`**
  Отключить публичную ссылку.

- **GET `/api/share/<uuid>`**
  Скачать файл по публичной ссылке.
