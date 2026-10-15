# Countries Info API

**July–August 2023**

REST API for country reference data and border geometry. A caller can register, sign in, and issue personal API keys, then read a country profile or its borders by ISO code.

I built it as a backend a map or country-directory client can sit on: account management and data access are separate credentials, and a request for one country does not have to move every polygon in the dataset.

## What it does

- **Accounts.** Register, log in, refresh an access token, and log out.
- **API keys.** An authenticated user can generate up to three keys, list them, and delete one or all of them.
- **Country profiles.** Name, ISO codes, currencies, languages, capital, continents, population, main religion, area, nominal GDP per capita, driving side, and country domain. 195 profiles.
- **Borders.** GeoJSON for each country (`Polygon` or `MultiPolygon`) with the English name and both ISO codes. 196 features.
- **One path for both ISO code lengths.** `PL` and `POL` hit the same route. The handler chooses `ISO_A2` or `ISO_A3` from the length of the code.

Data routes expect two headers: `username` and `x-api-key`. The key must be one of the keys stored on that user. Creating and deleting keys requires a Bearer access token.

## Stack

| Piece | Role |
| --- | --- |
| Node.js, Express 4 | HTTP server and routing |
| MongoDB, Mongoose 7 | Document storage, schema validation, queries |
| JSON Web Tokens (`jsonwebtoken`) | Access tokens (15 minutes) and refresh tokens (7 days) |
| bcrypt | Password hashing, cost factor 10 |
| cookie-parser | Reads the refresh cookie |
| cors | Credentialed cross-origin requests |
| uuid | API keys and log entry ids |
| date-fns | Timestamps in the request and error logs |
| dotenv | Database URI and token secrets outside the repo |
| express-async-errors | Rejected async handlers reach the error middleware |
| nodemon | Restart on file changes during development |

## Layout

```
server.js                 app setup, middleware order, listen-after-connect
config/dbConn.js          Mongoose connection
routes/                   auth, refresh, logout, register, data, api keys
controllers/              request handling
middleware/               logging, CORS credentials, JWT, API key, errors
model/                    User, CountryInfo, CountryBordersGeojson + JSON fixtures
helpers/insertDataToDB.js wipe-and-reload of the reference data
```

Routes stay thin. Controllers own the HTTP responses. Mongoose models own the document shape. Middleware owns everything that applies to more than one route.

## Technical decisions

**Two credentials.** Login returns a 15-minute access token in the body and sets a 7-day refresh token as an `httpOnly`, `Secure`, `SameSite=None` cookie. The access token carries username and roles; the refresh token carries the username only. Data routes ignore the session: they take `username` and `x-api-key`, and the key must belong to that user (max 3). `/api-key` is mounted after `verifyJWT`, so only a session can issue or revoke keys. CORS allows credentialed requests so a frontend on another origin can send the cookie.

**Passwords and usernames.** Passwords are bcrypt hashes (cost 10). Usernames are unique through a MongoDB collation (`en`, strength 2), so `User` and `user` collide and the stored casing stays as registered. A collision returns `409`.

**Facts and geometry apart.** Profiles and borders live in separate collections, so a request for capital or GDP does not transfer polygon rings. The source file is one GeoJSON FeatureCollection (88 `Polygon`, 108 `MultiPolygon`). The load helper splits it into one document per country. A lookup is a single `$elemMatch` on `properties.ISO_A2` or `properties.ISO_A3`, chosen from the code length.

**Reload, errors, secrets.** `insertDataToDB.js` runs `deleteMany`, then `insertMany`, so a reload replaces the reference data. The server listens only after MongoDB is open. `express-async-errors` sends a rejected handler to one error middleware, which logs the error and responds `500`. Each request log line has a timestamp and a UUID and is appended under `logs/`. `DATABASE_URI` and both token secrets come from the environment; `.env` is gitignored.

## API

| Method | Path | Auth | Behaviour |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Create a user. `400` if a field is missing, `409` if the username already exists, `201` on success. |
| `POST` | `/auth` | Public | Check username and password. Returns `{ accessToken }` and sets the refresh cookie. `401` on a bad login. |
| `GET` | `/refresh` | Refresh cookie | Returns a new access token. `401` if the cookie is missing, `403` if it does not verify. |
| `GET` | `/logout` | Public | Clears the refresh cookie. `204` when there was no cookie. |
| `GET` | `/api-key/generate` | Bearer access token | Adds a key unless the user already has 3 (`403`). |
| `GET` | `/api-key/all` | Bearer access token | Lists the user's keys. |
| `DELETE` | `/api-key/all` | Bearer access token | Removes every key. |
| `DELETE` | `/api-key/:id` | Bearer access token | Removes one key. `:id` is its index in the user's key list. |
| `GET` | `/countries-info` | `username` + `x-api-key` | All country profiles. |
| `GET` | `/countries-info/:countryCode` | `username` + `x-api-key` | One profile by alpha-2 or alpha-3. |
| `GET` | `/countries-borders` | `username` + `x-api-key` | All border documents. |
| `GET` | `/countries-borders/:countryCode` | `username` + `x-api-key` | One border document by alpha-2 or alpha-3. |

A missing API key returns `400`. A key that is not on that user returns `403`.

## Run locally

Node dependencies:

```bash
npm install
```

`.env` in the project root:

```
DATABASE_URI=mongodb://127.0.0.1:27017/countriesInfo
ACCESS_TOKEN_SECRET=replace-me
REFRESH_TOKEN_SECRET=replace-me
PORT=3500
```

Start the server:

```bash
node server.js
```

During development, `npx nodemon server.js` restarts the process on changes.

Country profiles and borders are loaded from `model/countryInfo.json` and `model/countryBordersGeojson.json` through `helpers/insertDataToDB.js` (`insertCountryInfo`, `insertCountryBordersGeojson`). Each function clears its collection, then inserts the fixture. Run that load against an open connection before calling the data routes.
