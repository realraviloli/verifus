# License Server

Тестовый backend на Node.js (Express), эмулирующий сервер лицензирования для Android-приложения.

## Установка зависимостей

```bash
npm install
```

## Запуск сервера

```bash
node server.js
```

Сервер запустится на порту 8080.

## API Эндпоинты

### POST /camera/useTimeCode

Активация лицензии по коду.

**Content-Type:** application/x-www-form-urlencoded

**Параметры:**
- `code` (строка) - код активации

**Ответ:**
```json
{
  "code": 200,
  "now": 1717920000,
  "remain": 0,
  "ns": 0,
  "expiredTime": 1717923600000,
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "data": "",
  "sig": ""
}
```

### POST /camera/device

Регистрация устройства.

**Ответ:**
```json
{
  "code": 200,
  "message": "ok"
}
```

### GET /health

Проверка работоспособности сервера.

**Ответ:**
```json
{
  "status": "ok"
}
```

## Логирование

Сервер логирует следующую информацию для каждого запроса:
- IP клиента
- Время запроса
- Значение параметра `code`
- User-Agent
- Полный URL запроса

## Зависимости

- express ^4.18.2
- body-parser ^1.20.2
- crypto (встроенный модуль Node.js)
