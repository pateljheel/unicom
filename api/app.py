import os
from dotenv import load_dotenv
from flask import Flask
from pymongo import MongoClient
from controllers import routes  # Import routes after app is initialized
from flasgger import Swagger

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
swagger = Swagger(app)

# Initialize MongoDB client with connection pooling
if bool(os.getenv("MONGO_USE_TLS", 'false') != 'false'):
    mongo_client = MongoClient(
        host=os.getenv("MONGO_HOST"),
        port=int(os.getenv("MONGO_PORT")),
        username=os.getenv("MONGO_USERNAME"),
        password=os.getenv("MONGO_PASSWORD"),
        authSource=os.getenv("MONGO_AUTH_SOURCE", "admin"),
        maxPoolSize=int(os.getenv("MONGO_MAX_POOL_SIZE", 50)),
        minPoolSize=int(os.getenv("MONGO_MIN_POOL_SIZE", 5)),
        tls=bool(os.getenv("MONGO_USE_TLS", False)),
        tlsCAFile=os.getenv("MONGO_CA_FILE"),
        connect=True,
        retryWrites=False # Disable retryWrites for compatibility with DocumentDB
    )
else:
    mongo_client = MongoClient(
        host=os.getenv("MONGO_HOST"),
        port=int(os.getenv("MONGO_PORT")),
        username=os.getenv("MONGO_USERNAME"),
        password=os.getenv("MONGO_PASSWORD"),
        authSource=os.getenv("MONGO_AUTH_SOURCE", "admin"),
        maxPoolSize=int(os.getenv("MONGO_MAX_POOL_SIZE", 50)),
        minPoolSize=int(os.getenv("MONGO_MIN_POOL_SIZE", 5)),
        connect=True,
        retryWrites=False # Disable retryWrites for compatibility with some DocumentDB
    )

print(os.getenv("MONGO_HOST"))
# Check if the connection was successful
try:
    mongo_client.admin.command('ping')  # Ping the MongoDB server
    print("MongoDB connection successful")
except Exception as e:
    print("MongoDB connection failed:", e)
    raise RuntimeError("Failed to connect to MongoDB")

# Reference to database
mongo_db = mongo_client[os.getenv("MONGO_DB")]

# Pass mongo_db to routes
app.config["MONGO_DB"] = mongo_db
app.config['SWAGGER'] = {
    "title": "Post Platform API",
    "uiversion": 3,
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'"
        }
    }
}

# Register routes blueprint
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("FLASK_PORT", 5000), host='0.0.0.0')  # Use the port from environment variable or default to 5000