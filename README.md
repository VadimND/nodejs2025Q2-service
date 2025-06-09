# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/VadimND/nodejs2025Q2-service.git
```

## Change Directory + Switch Branch

```
cd nodejs2025Q2-service
git checkout docker
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

### Production Build

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` by default.

## PostgreSQL & Prisma

- Prisma schema defined in `prisma/schema.prisma`
- Environment variables loaded from `.env`
- Apply migrations:

  ```bash
  npx prisma migrate deploy
  ```

## Docker

To run the full environment:

```bash
docker compose up --build
```
or 

```bash
docker pull vadimnd/home-library-app
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
