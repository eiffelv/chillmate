from flask import Flask
from flask_cors import CORS
 

# Initializing flask app
app = Flask(__name__)
cors = CORS(app, origins='*')


# Route for seeing a data
@app.route('/data')
def get_time():

    # Returning an api for showing in  reactjs
    return {
        'Name':"Will",
        }

    
# Running app
if __name__ == '__main__':
    app.run(debug=True)