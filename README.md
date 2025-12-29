# TREK LIST API

This is the backend codebase for **Trek List**, a backpacking gear checklist application. Users can create multiple gear checklists, and manage items in each checklist. They can also access a list of informational backpacking articles. This is a portfolio project demonstrating modern Node.js/Express development practices. It's designed to be integrated with a React client:

**Client Repository:** [Trek List Client Repository](https://github.com/mjbeauchamp/my-trek-client)

## Live Demo

View deployed site here: [Trek List](https://trek-list.vercel.app/)

The client is deployed on **Vercel** and built with Vite + React.

The server is deployed using **Render**.

Base URL for the deployed API:

https://trek-list-api.onrender.com

Authenticated routes require a valid Auth0 JWT.

**Note:** Some sections of the app use placeholder text or images. This is a portfolio project, so some content is minimal or illustrative rather than fully built out.

---

## FEATURES

- **User Authentication** – Secure login using Auth0.
- **Gear Checklists** – Users can create, update, and delete multiple checklists.
- **Item Management** – Users can add, edit, or remove items in each checklist.
- **Common Gear** – Commonly used gear items can be selected from a predefined list.
- **Backpacking Articles** – A collection of curated content that teaches users about safe and responsible backpacking.

---

## TECH STACK

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** Auth0
- **Type Safety:** TypeScript

---

## GETTING STARTED

### Prerequisites

To run the server locally, you will need to set up:

- Node.js (see .nvmrc for current version)
- MongoDB instance or connection URI
- Auth0 account (for authentication)

## INSTALLATION & RUNNING SERVER

Clone down the repo from GitHub.

Create a `.env` file in the root of the project:

```.env
PORT=<your-port>
MONGO_URI=<your-mongo-uri>
FRONTEND_URL=<your-frontend-uri>
AUTH0_DOMAIN=<your-auth0-domain>
AUTH0_AUDIENCE=<your-auth0-audience>
AUTH0_TOKEN_SIGN_ALG=<your-auth0-sign-alg>
```

Run:

```bash
npm install
```

Once installation is complete, run:

```bash
npm run dev
```

The server should start and connect to your MongoDB instance.

## NOTES

- All routes that modify or retrieve user-specific data are protected using Auth0 JWT authentication.
- The user gear list database schema is flexible but constrained. Users can have multiple gear lists. Each gear list contains list metadata and an array of gear items.
- This project is designed as a portfolio application demonstrating basic backend structure, authentication, and API design, rather than full production-scale optimizations.

## FUTURE IMPROVEMENTS

- Addition of automated testing for routes and controllers
- Scalability improvements including data caching and paginated data fetching
- More robust validation and sanitization of data

## API ENDPOINTS

### User - AUTHENTICATED ROUTE

- **POST** `/api/user` – Create or sync user profile. (No user database data is currently required for client functionality, so user is not returned to client.)

### Gear Lists - AUTHENTICATED ROUTES

- **GET** `/api/gear-lists` – Fetch all gear lists for authenticated user.
- **GET** `/api/gear-lists/gear-list/:listId` – Fetch gear list by list ID.
- **POST** `/api/gear-lists/gear-list` – Create a new gear list.
- **PUT** `/api/gear-lists/gear-list/:listId` – Update gear list metadata (list title, etc).
- **DELETE** `/api/gear-lists/gear-list/:listId` – Delete a gear list.

### Gear List Items - AUTHENTICATED ROUTES

- **POST** `/api/gear-lists/gear-list/:listId/items` – Add a new item to gear list's "items" array.
- **PUT** `/api/gear-lists/gear-list/:listId/items/:itemId` – Update an item in gear list's "items" array.
- **DELETE** `/api/gear-lists/gear-list/:listId/items/:itemId` – Delete an item in gear list's "items" array.

### Common Gear

- **GET** `/api/commonGear` – Fetch predefined common gear items.

### Articles

- **GET** `/api/backpacking-articles` – Fetch backpacking 101 informational content articles.
- **GET** `/api/backpacking-articles/:articleId` – Fetch individual article by ID.

### Health Check

- **GET** `/health` – Returns server status.
