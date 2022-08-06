# Family Car Booking App (Backend)

This project is a simple app to track our shared family car, Honda. The car is used by me, my wife and my father, all at different days and time.

My wife provides a frontend as her portfolio project, and I'm doing backend.

I started this project to practice hexagonal architecture, AWS SST (wrapper around CDK) and Cucumber/Gherkin testing.

## Useful commands

* `yarn start`        deploy main resources and start lambdas locally
* `yarn deploy:dev`   deploy code for dev env (similar for qa and prod)
* `yarn test`         perform Vitest unit tests
* `yarn seed:dev`     seed DB with dev data
* `yarn unseed:dev`   remove seed data from DB
* `yarn integration`  run integration tests against this API

## Project file structure
Most folders inside `services/core` are business entities. Each entity contains the following elements:
- {entity}.types.ts - interfaces and types for this entity
- {entity}.constants.ts - constants related to this entity
- {entity}.mapper.ts - mappers 1) network <-> business logic 2) business logic <-> database
- {entity}.service.ts - business logic concerning this entity
- {entity}.abilities.ts - role-based abilities of this entity relative to other entities
- {entity}.repository.ts - layer for DB queries and data mapping from and to the data access layer

Handlers are located in `services/handlers` directory. Each handler should be thin, know only about API Gateway event structure, and form responses. Otherwise, it merely delegates work to the services and repositories.

## Database
DynamoDB is used for this project, a single-table design is attempted using [ElectroDB](https://github.com/tywalch/electrodb) for easier interaction with DynamoDB API.

### Seed data
Seed scripts are located at is located in unversioned files, as it contains secrets like passwords for initial users.

After your stack is deployed, you can seed your DB in dev environment by running `yarn seed:dev`.

## Auth
[//]: # (TODO add auth implementation docs)
Auth is very simple, no registration required, as this is a family-only app. Users are assigned their usernames, passwords and roles ahead of time. This data is in a non-VCS secret json file loaded into the DB (might need to put it into SSM when setting up a deployment pipeline).

## Testing

### Unit
Vitest is used as a unit testing framework.

To test a particular file run `yarn test:watch <your-file-regexp>`.

To run tests in non-dev mode, e.g. as part of your pipeline, run `yarn test`. It will run all Vitest tests.

### Integration
Integration testing covers the backend API. It is written in Gherkin using Jest-Cucumber package.

Feature files are located in `specs/features`. Step definitions are located in `specs/step-definitions` folder at any depth. The main rule is that the Jest-cucumber file must be named `<what-is-tested.feature.steps.ts>`, e.g. `login.feature.steps.ts`.

Pre-requisites to running integration tests:
- run `yarn deploy:qa` to deploy the latest changes to the `qa` env where the integration tests will run
- ensure you have `features/.env.integration` file. Ask your teammates for the actual values or deploy your own environment to get unique values

To run all integration tests, do `yarn integration`.

To run only a particular file, do `yarn integration <your-jest-cucumber-file-regex>`. For example, to run the login feature tests, run `yarn integration login`.

> Some Gherkin definitions might contain tech terms. This was done on purpose, because I'm only testing the API, and this is a pet project. On a real project we would most likely test e2e and Gherkin steps would not contain terms like `cookie`.
