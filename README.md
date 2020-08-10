## EnergyPathfinder API Server

API Server for EnergyPathfinder Frontend, found in a separate github: https://github.com/pathfinder-toolkit/pathfinder-toolkit

[Hosted on heroku](https://api-pathfinder.herokuapp.com/)

[Swagger API docs](https://api-pathfinder.herokuapp.com/api-docs/)

### Setup

Copy and rename env.example to .env . Insert the following required environmental values:

- DATABASE_HOST, DATABASE_NAME, DATABASE_USER and DATABASE_PASSWORD: Your PostgreSQL database's host, name, user and password, respectively.
- CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET and CLOUDINARY_CLOUD_NAME: Your Cloudinary account's API key, secret and name, respectively.
- AUTH_ISSUER and AUTH_AUDIENCE: The issuer and audience for your Auth0 account.
- GOOGLE_RECAPTCHA_SECRET: Google Recaptcha secret to verify frontend's Google Recaptcha v2.

### Usage

npm install

npm start
