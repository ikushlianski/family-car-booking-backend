# Family Car Booking App (Backend)

This project is a simple app to track our shared family car, Honda. The car is used by me, my wife and my father, all at different days and time.

My wife provides a frontend as her portfolio project, and I'm doing backend.

I started this project to practice hexagonal architecture, AWS SST (wrapper around CDK) and Cucumber/Gherkin testing.

## Useful commands

* `npm start`       deploy main resources and start lambdas locally
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npm run deploy`  deploy this stack to your AWS account/region

## Project file structure
Most folders inside `services/core` are business entities. Each entity contains the following elements:
- {entity}.types.ts - interfaces and types for this entity
- {entity}.constants.ts - constants related to this entity
- {entity}.mapper.ts - mappers 1) network <-> business logic 2) business logic <-> database
- {entity}.service.ts - business logic concerning this entity
- {entity}.repository.ts - layer for DB queries and data mapping from and to the data access layer
- {operation-with-entity}.handler.ts - a Lambda handler that knows about API Gateway event structure and delegates work to services and repositories

## Database
DynamoDB is used for this project, a single-table design is attempted using [ElectroDB](https://github.com/tywalch/electrodb) for easier interaction with DynamoDB API.

### Seed data
Seed scripts are located at is located in unversioned files, as it contains secrets like passwords for initial users.

After your stack is deployed, ensure you have these seeds in `./src/db/seeds/defaultData_<stage>.ts` and run `npm run seed:dev` to seed data in your <stage> (dev, qa, prod).

## Auth
[//]: # (TODO add auth implementation docs)
Auth is very simple, no registration required, as this is a family-only app. Users are assigned their usernames, passwords and roles ahead of time. This data is in a non-VCS secret json file loaded into the DB (might need to put it into SSM when setting up a deployment pipeline).

## Testing

### Local Lambda testing
For local testing of lambdas, use AWS SAM CLI. For example, to run a getBookingLambda, use this code:

```
NODE_ENV=dev cdk synth --no-staging \
&& sam local invoke getUserLambda \
-e ./src/user/getUser.event.json \
-t ./cdk.out/userLambdaStack.template.json
```

### Unit tests
Jest is used as a testing framework.

To test a particular file run `npm run test:watch -- -- <your-file-regexp>`.

The double `--` is because of how `concurrently` tool passes arguments and because of how `npm` scripts work.

To run tests in non-dev mode, e.g. as part of your pipeline, run `npm run test`. It will build the project and run all Jest tests.

### Integration tests
Integration testing covers the backend API. It is written in Gherkin using Cucumber.

To run integration tests, do `npm run integration`
