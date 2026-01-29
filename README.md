# Parturi Kampaamo Hannastiina

Website for the hair salon Parturi Kampaamo Hannastiina. The site is implemented with Node.js and React. Node.js serves the React site statically and provides an API interface for managing services. Editing the content of the site requires a username and password.

_Parturi Kampaamo Hannastiinan sivusto. Sivusto on toteutettu Node.js:llä ja Reactilla. Node.js tarjoilee React-sivuston staattisesti, ja tarjoaa API-rajapinnan palveluiden hallintaan. Sivuston sisällön muokkaaminen vaatii käyttäjätunnuksen ja salasanan._

## Database | _Tietokanta_

The site's introduction, categories, users, and services are stored in a MySQL database, managed with Sequelize by logged-in users.

_Sivuston intro, kategoriat, käyttäjät ja palvelut ovat tallennettu MySQL-tietokantaan, jota hallinnoidaan Sequelizerin avulla, kirjautuneiden käyttäjien toimesta._

## User roles | _Käyttäjäroolit_

There are three main user roles and a fourth testing role. Site owner and site administrators can manage users and services, while authorized users can manage services. Site owner cannot be deleted. The testing role is for viewing purposes only and cannot edit the database.

_Kolmen käyttäjäroolin lisäksi on neljäs testaajarooli. Sivuston omistaja ja sivuston ylläpitäjät voivat hallinnoida käyttäjiä ja palveluita, ja valtuutetut käyttäjät voivat hallinnoida palveluita. Sivuston omistajaa ei voi poistaa. Testaajarooli on vain tarkastelua varten, eikä voi muokata tietokantaa._

## Dependencies | _Riippuvuudet_

### React

- react
- react-dom
- react-icons
- react redux
- @reduxjs/toolkit
- axios
- react-helmet-async
- vike

#### React Dev-dependencies | _React-kehitysriippuvuudet_

- typescript
- vite (6.x, required by Vike)
- rimraf
- rollup-plugin-copy
- eslint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- @types/react
- @types/react-dom
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @vitejs/plugin-react

### Node.js

- express
- express-validator
- mysql2
- sequelize
- cors
- bcryptjs
- jsonwebtoken
- dotenv

#### Node.js Dev-dependencies | _Node.js-kehitysriippuvuudet_

- concurrently
- nodemon
- typescript
- @types/bcrypt
- @types/bcryptjs
- @types/cors
- @types/express
- @types/jsonwebtoken
- @types/node

## SSR / Pre-rendering (Vike)

The React frontend is built with **Vike** (SSR/SSG on top of Vite). On `npm run build` it produces:

- `Hannastiina_Node/build/dist/client` (static client assets + prerendered HTML)
- `Hannastiina_Node/build/dist/server` (server bundle used by Vike during prerender)

The Node backend serves the prerendered HTML when available and falls back to the SPA `index.html`.

_React-frontend on toteutettu Vike:llä (SSR/SSG Viten päälle). Build tuottaa client- ja server-bundlet sekä prerenderöidyn HTML:n Node-projektin `build/dist`-kansioon. Node tarjoilee prerenderöidyn HTML:n, jos se löytyy, ja muuten käyttää SPA:n `index.html`:ää._

### Key files

- Vike entry points:
  - [Hannastiina_React/src/pages/+config.ts](Hannastiina_React/src/pages/+config.ts)
  - [Hannastiina_React/src/pages/+onRenderHtml.tsx](Hannastiina_React/src/pages/+onRenderHtml.tsx)
  - [Hannastiina_React/src/pages/+onRenderClient.tsx](Hannastiina_React/src/pages/+onRenderClient.tsx)
  - [Hannastiina_React/src/pages/+onBeforePrerenderStart.ts](Hannastiina_React/src/pages/+onBeforePrerenderStart.ts)
- SEO helper (SSR-safe head tags):
  - [Hannastiina_React/src/components/SEO/SEO.tsx](Hannastiina_React/src/components/SEO/SEO.tsx)
- Node static serving + prerender fallback:
  - [Hannastiina_Node/src/app.ts](Hannastiina_Node/src/app.ts)

### Prerendered routes

Currently only `/` is prerendered (see `+onBeforePrerenderStart.ts`).

## Development

### Frontend only (Vite dev server)

````bash
cd Hannastiina_React
npm install
npm run dev


### Production build (SSR + prerender output)

```bash
cd Hannastiina_React
npm install
npm run build
````

### Backend (serves the built frontend + API)

```bash
cd Hannastiina_Node
npm install
npm run build
npm start
```
