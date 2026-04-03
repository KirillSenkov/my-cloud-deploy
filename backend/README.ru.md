# My Cloud Backend

[English version](README.md) | Русская версия

Backend-сервис приложения `My Cloud`.

## Роль

Backend отвечает за:

- аутентификацию на основе сессий и CSRF-защиту
- регистрацию пользователей и начальную инициализацию профиля
- ролевое администрирование пользователей
- хранение метаданных файлов в PostgreSQL
- операции с файловым хранилищем
- скачивание файлов по публичным share-ссылкам

## Стек

- Django
- PostgreSQL
- `psycopg`
- `python-dotenv`
- Gunicorn для контейнерного запуска

## Основные Зоны

- `config/`
  конфигурация Django-проекта, база данных, middleware и маршрутизация
- `users/`
  модель пользователя, auth endpoints, ролевая логика и административное управление пользователями
- `storage/`
  файловая модель, storage helpers и сценарии upload/download/share

## Окружение

Ожидаемый файл окружения:

`backend/.env`

Ключевые переменные:

- `ADMIN_PASSWORD`
- `SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `STORAGE_ROOT`

## Локальная Разработка

Этот backend можно запускать напрямую для разработки, хотя основным deployment-oriented сценарием остаётся интегрированный Docker-запуск из корня репозитория.

### Требования

- Python 3.10+
- PostgreSQL

### Настройка

1. Создать базу PostgreSQL с именем `my_cloud`.
2. Настроить доступ к базе через `backend/.env` или `config/settings.py`.
3. Установить зависимости:

   ```bash
   pip install -r requirements.txt
   ```

4. Применить миграции:

   ```bash
   python manage.py migrate
   ```

5. Запустить dev-сервер:

   ```bash
   python manage.py runserver
   ```

## Модель Аутентификации

- аутентификация использует Django sessions
- CSRF-защита обязательна для `POST`, `PATCH` и `DELETE`
- `GET /api/auth/csrf/` выдаёт CSRF cookie, который использует frontend

## Ролевая Модель

Поддерживаемые уровни:

- `user`
- `admin`
- `senior_admin`
- `superuser`

Backend обеспечивает иерархические права для:

- просмотра доступных пользователей
- смены пользовательских уровней
- удаления пользователей
- доступа к файлам других пользователей

## Модель Файлового Хранилища

- у каждого пользователя есть выделенная директория хранения
- загруженные файлы сохраняются под `STORAGE_ROOT`
- метаданные файлов хранятся в PostgreSQL
- публичный доступ реализован через UUID-based share tokens

## Основные API Зоны

### Аутентификация

- `GET /api/auth/csrf/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/logout/`
- `GET /api/auth/me/`

### Администрирование Пользователей

- `GET /api/admin/users/`
- `DELETE /api/admin/users/<id>/`
- `PATCH /api/admin/users/<id>/level/`

### Работа С Файлами

- `POST /api/files/upload/`
- `GET /api/files/`
- `DELETE /api/files/<id>/`
- `PATCH /api/files/<id>/rename/`
- `PATCH /api/files/<id>/comment/`
- `GET /api/files/<id>/download/`
- `POST /api/files/<id>/share/`
- `POST /api/files/<id>/share/disable/`
- `GET /api/share/<uuid>/`

## Контейнерный Рантайм

В Docker backend-контейнер:

- устанавливает зависимости из `requirements.txt`
- запускает `python manage.py migrate`
- стартует Gunicorn на `0.0.0.0:8000`
