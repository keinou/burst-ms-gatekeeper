# Gatekeeper

![Build](https://github.com/keinou/burst-ms-gatekeeper/actions/workflows/build.yml/badge.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=bugs)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper)

Used to auth users.
You can authenticate in `POST` /auth and validate this in `GET` /user/me

If you are a admin, you can get all users in `GET` /user

You can validate a user with a message with format `{ role: 'user', cmd: 'get' }` in `TCP_PORT`

## Requirements

In this moment only a postgres database is supported and required.

## Configuration

You must configure the following environment variables:

- `POST`: The port where the server will listen
- `TCP_PORT`: The port where the tcp server will listen (used to microsservices communication)

- `DB_HOST`: The host of your database.
- `DB_PORT`: The port of your database.
- `DB_USER`: The user to connect with in your database.
- `DB_PASSWORD`: The password for the user above.
- `DB_DATABASE`: The name of the database you want to use.

- `JWT_SECRET`: A secret key used to encrypt jwt tokens.
- `JWT_EXPIRES`: expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d". Default is 2h.

- `SMTP_HOST`: The host of your smtp server.
- `SMTP_PORT`: The port of your smtp server.
- `SMTP_IGNORE_SSL`: If true, a secure connection is not required for SMTPS. Default is false.
- `SMTP_SECURE`: If true, the connection uses the STARTTLS command after connecting to the server. Default is true.
- `SMTP_USER`: The user to connect with in your smtp server.
- `SMTP_PASSWORD`: The password for the user above.

## Installation

```bash
yarn install
```

## Running the server

```bash
yarn start
```

## Testing

In this moment we dont have tests, but we are working on and will soon.

### Roadmap

- [x] Password reset
- [ ] Unit tests
- [ ] OpenApi documentation with swagger
