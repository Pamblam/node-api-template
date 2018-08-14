
![enter image description here](https://poiemaweb.com/img/nodejs-mysql.png)

## Node API Template

A starting point for a simple restful node powered web service.

#### Features

 - User authentication
 - New user email validation
 - JWT access tokens
 - MySQL database

#### Set up

 1. Download the files
 2. Import the `install.sql` file into your DB.
 3. Run `npm install` in the directory with the files.
 4. Fill out the variables in `.env`.
 5. Run `chmod +x ./server`.

#### Start the webservice

 - `nohup ./server &`

#### Stop the webservice

 - Get the `TITLE` property from the .env file
 - Run `killall <title>` (eg, if the title is "node-api-server, " run `killall node-api-server`)

#### Developing new endpoints

 - Create a .js file in the `/endpoints` directory, optionally using any directory structure you want.
 - export an object in your .js file with three properties:
    - method: post/get/put/delete, etc.
    - path: the path to this endpoint
    - handler: a function that accepts the .env values and returns a function that handles incoming requests.

See existing endpoints for example.

