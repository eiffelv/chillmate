# Running the Frontend Locally

Prerequisites:

- [Node 21.x or higher](https://nodejs.org/en/download/package-manager)

Steps with Command Line:

1. Clone the repository somewhere in your system

   ```bash
   git clone https://github.com/csc648/chillmate.git
   ```

2. Navigate to the Repository folder

   ```bash
   cd chillmate
   ```

Next follow the following steps:

## Frontend - React

1. In the "app" folder, install the dependencies

   ```bash
   cd app
   npm install
   ```

2. Ignoring all warnings, run the development server

   ```bash
   npm start
   ```

The server should start and listen to http://localhost:3000

## Environment Variables

With the base server set up, you need to set up Environment Variables to get the app working properly.

1. From the root of the repo, create a new .env file in the app folder.
2. For "app/.env" file:

   ```dotenv
   # Temporary Solution
   DANGEROUSLY_DISABLE_HOST_CHECK=true

   # Set the Port according to Flask setup
   REACT_APP_FLASK_URI=http://127.0.0.1:5000
   ```