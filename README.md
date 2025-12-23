# TREK LIST SERVER

Backend for **Trek List**, a backpacking checklist application. Users can create multiple gear checklists, and manage items in each checklist. They can also access a list of informational backpacking articles. This is a portfolio project demonstrating modern Node.js/Express development practices integration with a React client.

**Client Repository:** [Trek List Client Repository](https://github.com/mjbeauchamp/my-trek-client)

**Note:** Some sections of the app use placeholder Lorem Ipsum text and placeholder images. This is a portfolio project, so content may be minimal or illustrative rather than fully built out.

---

## FEATURES

- **User Authentication** – Secure login using Auth0.
- **Gear Checklists** – Create, update, and delete multiple checklists.
- **Item Management** – Add, edit, or remove items in each checklist.
- **Common Gear** – Select frequently used gear from a predefined list.
- **Backpacking Articles** – Browse curated content to learn more about safe and responsible trekking.

---

## TECH STACK

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** Auth0
- **Type Safety:** TypeScript

---

## GETTING STARTED

### Prerequisites

- Node.js (see .nvmrc for current version)
- MongoDB instance or connection URI
- Auth0 account (for authentication)

### Environment Variables

Create a `.env` file in the root of the project:

```env
PORT=<your-port>
MONGO_URI=<your-mongo-uri>
FRONTEND_URL=<your-frontend-uri>
AUTH0_DOMAIN=<your-auth0-domain>
AUTH0_AUDIENCE=<your-auth0-audience>
AUTH0_TOKEN_SIGN_ALG=<your-sign-alg>
```

## INSTALLATION & RUNNING SERVER

Clone down the repo from GitHub. Then run:

```bash
npm install
```

Once installation is complete, run:

```bash
npm run dev
```

The server should start and automatically connect to your MongoDB instance.

## NOTES

- All routes that modify user data are protected via JWTs issued by Auth0.
- The database schema is flexible but constrained: users have multiple gear lists, each with an array of items.
- This project is designed as a portfolio application demonstrating basic backend structure, authentication, and API design, rather than production-scale optimizations.

## FUTURE IMPROVEMENTS

- Addition of automated testing for routes and controllers
- Scalability improvements including data caching and paginated data fetching
- More robust validation and sanitization of data
- Separation of gear list item endpoints for better scalability

## API ENDPOINTS

### User

- **POST** `/api/user` – Create or sync user profile. (No user data currently required for client functionality, so user not returned.)

### Gear Lists - AUTHENTICATED ROUTES

- **GET** `/api/gear-lists` – Fetch all gear lists for authenticated user.
- **GET** `/api/gear-lists/gear-list/:listId` – Fetch gear list by list ID.
- **POST** `/api/gear-lists/gear-list` – Create a new gear list.
- **PUT** `/api/gear-lists/gear-list/:listId` – Update gear list metadata (list title, etc).
- **DELETE** `/api/gear-lists/gear-list/:listId` – Delete a gear list.

### Gear List Items - AUTHENTICATED ROUTES

- **POST** `/api/gear-lists/gear-list/:listId/items` – Add a new item.
- **PUT** `/api/gear-lists/gear-list/:listId/items/:itemId` – Update an item.
- **DELETE** `/api/gear-lists/gear-list/:listId/items/:itemId` – Delete an item.

### Common Gear

- **GET** `/api/commonGear` – Fetch predefined common gear items.

### Articles

- **GET** `/api/backpacking-articles` – Fetch backpacking articles.
- **GET** `/api/backpacking-articles/:articleId` – Fetch individual article by ID.

### Health Check

- **GET** `/health` – Returns server status.
