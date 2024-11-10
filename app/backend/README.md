# Running the Backend Locally

Prerequisites:

- [Python 3.12.x](https://www.python.org/downloads/)

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

## Backend - Flask
  
1. Using a different terminal window, navigate the "app/backend" folder

   ```console
   cd app/backend
   ```

2. Create a Virtual Environment to hold packages for the Flask app.

   ```console
   python -m venv venv
   ```

3. Activate the Virtual Environment

   ```console
   venv/Scripts/activate
   ```

4. Install dependencies

   ```console
   pip install -r requirements.txt
   ```

5. Try running the development server automatically with

   ```console
   python server.py
   ```

In most cases, the server should now listen to http://localhost:5000.

<details>
  
<summary>If That Doesn't Work</summary>

If there are port conflicts, try configuring the Flask App with Environment Variables:

1. Create a new file called .env and place it in the backend folder beside requirements.txt

  ```dotenv
  FLASK_APP=server
  FLASK_ENV=development
  FLASK_DEBUG=1
  FLASK_RUN_PORT=5050
  ```

2. Then run the development server with

  ```console
  flask run
  ```

</details>

## Environment Variables

With the base server set up, you need to set up Environment Variables to get the app working properly.

1. Create an .env file in app/backend.
2. For "app/backend/.env" file (append if exists):

   ```dotenv
   # Database URI
   MONGO_URI = <Link to MongoDB Database>

   # Local development origin
   # Set the Port accordingly
   FRONTEND_ORIGIN=http://localhost:3000

   # API Keys
   GOOGLE_API_KEY = <Gemini API Key>
   fireworks_key = <Fireworks Key>
   ```

   > For Security Reasons, some of the values are not filled.
