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

#### React Dev-dependencies | _React-kehitysriippuvuudet_

- typescript
- vite
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
