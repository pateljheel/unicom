import os
from dotenv import load_dotenv
from flask import Flask
from pymongo import MongoClient
from controllers import routes

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client with connection pooling
mongo_client = MongoClient(
    host=os.getenv("MONGO_HOST"),
    port=int(os.getenv("MONGO_PORT")),
    username=os.getenv("MONGO_USERNAME"),
    password=os.getenv("MONGO_PASSWORD"),
    maxPoolSize=int(os.getenv("MONGO_MAX_POOL_SIZE", 50)),
    minPoolSize=int(os.getenv("MONGO_MIN_POOL_SIZE", 5)),
    connect=True
)

# Reference to database
mongo_db = mongo_client[os.getenv("MONGO_DB")]

# Pass mongo_db to routes
app.config["MONGO_DB"] = mongo_db
app.register_blueprint(routes)
