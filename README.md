# Test Project

This project is built with NextJS, Typescript, MUI and Mongodb

# Setup

You can run the application with the command below in the root of the project

> docker-compose up

This will try to spin a MongoDB server and build the app to be accessible on

> http://localhost:3000

# Alternative

In case you don't want to spin a docker, you can navigate `app/db/model/db.ts` and replace it
with your mongodb instance

# Testing

I've created a default user on login for easy testing. The user is automatically created when the db starts is started.

- email: test@test.com
- password: password 

# Structure

-- app -- contains the application
-- api -- contains graphql for backend work
-- db -- contains db related information

# Some helpful commands

### recreate a new build

> docker-compose up --force-recreate --build

### Tear down the application and its data

> docker-compose down -v
