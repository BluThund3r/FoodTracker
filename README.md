# FoodTracker

**FoodTracker** is a REST API that provide users with the functionalities to keep track of their daily meals and exercise. Once registered and logged in, a user can add their details, in order to get their daily ideal nutritional values . After doing so, the user can create meals and add food to them. They can also add exercise in the app, so that they keep record of the burnt calories in a day as well.

## Setup

In order to run the application, first clone this repository.

After cloning the repo, one has to open a terminal and run the `npm run db` script in order to run the database in a docker container (be sure to first start the docker daemon, either from terminal on _Linux_ or by running the **Docker Desktop** app on _Windows_).

Once the database is running, simply run the command `npm run start` to run the application.

## Environment Variables

`DATABASE_URL` = the URL for database connection

`POSTGRES_USER` = the user for database connection

`POSTGRES_PASSWORD` = the password for database connection

`POSTGRES_DB` = the name of the database

`POSTGRES_HOST` = the host where the database is running

`POSTGRES_PORT_DOCKER` = the port that the database is listening in Docker

`POSTGRES_PORT` = the port on the host machine where the database can be accessed

`JWT_SECRET` = the secret key for JWT

`SERVER_PORT` = the port where the API is running on the host machine

## Database Diagram

![alt text](./diagrams/FoodTrackerDB.jpg)
