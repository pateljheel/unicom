from pymongo import MongoClient
from pymongo.collection import Collection
from datetime import datetime
from enum import Enum
from bson import ObjectId

# Enums for Post category and status
class PostCategory(Enum):
    ROOMMATE = "roommate"
    SELL = "sell"
    CARPOOL = "carpool"

class PostStatus(Enum):
    PUBLISHED = "published"
    UNPUBLISHED = "unpublished"
    CLOSED = "closed"
    PROCESSING = "processing"
    FAILED = "failed"

class GenderPreference(Enum):
    MALE = "male"
    FEMALE = "female"
    ANY = "any"

class OriginPreference(Enum):
    LOCAL = "local"
    INTERNATIONAL = "international"
    ANY = "any"

def create_collections(db):
    global db_users 
    db_users = db["users"]
    global db_posts
    db_posts = db["posts"]
    global db_images
    db_images = db["images"]

def delete_post_from_model(post_id: str):
    return db_posts.delete_one({"_id": ObjectId(post_id)}).deleted_count

def update_post_from_model(post_id: str, status: PostStatus):
    return db_posts.update_one({"_id": ObjectId(post_id)}, {"$set": {"status": status.value}}).modified_count

def get_user_by_id(user_id: str):
    return db_users.find_one({"_id": ObjectId(user_id)})

def delete_user_from_model(user_id: str):
    return db_users.delete_one({"_id": ObjectId(user_id)}).deleted_count

def update_user_from_model(user_id: str, college: str = None, department: str = None):
    update_fields = {}
    if college:
        update_fields["college"] = college
    if department:
        update_fields["department"] = department
    return db_users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields}).modified_count

def create_post_from_model(user_email: str, category: PostCategory, title: str, description: str):
    post = {
        "user_email": user_email,
        "category": category.value,
        "created_at": datetime.utcnow(),
        "status": PostStatus.PROCESSING.value,
        "title": title,
        "description": description,
    }
    return db_posts.insert_one(post).inserted_id

def create_image(post_id: str, url: str):
    image = {"post_id": post_id, "url": url}
    return db_images.insert_one(image).inserted_id