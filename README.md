# Parturi Kampaamo Hannastiina

Website for the hair salon Parturi Kampaamo Hannastiina. The site is implemented with Node.js and React. Node.js serves the React site statically and provides an API interface for managing services. Editing the content of the site requires a username and password.

_Parturi Kampaamo Hannastiinan sivusto. Sivusto on toteutettu Node.js:llä ja Reactilla. Node.js tarjoilee React-sivuston staattisesti, ja tarjoaa API-rajapinnan palveluiden hallintaan. Sivuston sisällön muokkaaminen vaatii käyttäjätunnuksen ja salasanan._

## Database | _Tietokanta_

The site's introduction, categories, users, and services are stored in a MySQL database, managed with Sequelize by logged-in users.

_Sivuston intro, kategoriat, käyttäjät ja palvelut ovat tallennettu MySQL-tietokantaan, jota hallinnoidaan Sequelizerin avulla, kirjautuneiden käyttäjien toimesta._

## User roles | _Käyttäjäroolit_

There are three user roles. Site owner and site administrators can manage users and services, while authorized users can manage services. Site owner cannot be deleted.

_Käyttäjärooleja on kolme. Sivuston omistaja ja sivuston ylläpitäjät voivat hallinnoida käyttäjiä ja palveluita, ja valtuutetut käyttäjät voivat hallinnoida palveluita. Sivuston omistajaa ei voi poistaa._

## Dependencies | _Riippuvuudet_

### React

- react
- react-dom
- react-icons
- react redux
- @reduxjs/toolkit
- axios

### Node.js

- express
- express-validator
- mysql2
- sequelize
- cors
- bcryptjs
- jsonwebtoken
- dotenv
