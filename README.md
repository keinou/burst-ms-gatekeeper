# Gatekeeper

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=bugs)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=keinou_burst-ms-gatekeeper&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=keinou_burst-ms-gatekeeper)

Used to auth users.

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
