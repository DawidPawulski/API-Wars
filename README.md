# API-Wars
Small project which was made as my JavaScript practice to get more experience using both internal and external web API. All the HTML markup is generated from the scripts to make it more dynamic and work like single-page application.

A list of Star Wars planet is displayed with related information. 

User can browse planets using buttons to move to previous/next records. If no records are available, buttons get disabled.

The list of residents of each planet can be displayed in a modal when button with residents' number is pressed.

Planets can be voted. There is a database on a server side to keep record on how many votes each planet got.

## Configuration
In order to run this application one should first create a database. 

It should contain one table `votes`. You can find SQL command which creates this table in the `sql_commands` file.

Create following environment variables in order to serve connection with the database properly:
- `PSQL_USER_NAME`
- `PSQL_PASSWORD`
- `PSQL_HOST`
- `PSQL_DB_NAME`

Project was created using Virtual Environment. There are several packages used to make it run, for example Flask. Please install all the packages from `requirements.txt`.

## Specification
Python

Flask

Javascript

WebAPI

PostgreSQL
