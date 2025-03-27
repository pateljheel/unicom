from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId
from models import *

routes = Blueprint('routes', __name__)
db = current_app.config["MONGO_DB"]
create_collections(db)

@routes.route('/posts/<string:id>', methods=['GET'])
def get_post(id):
    """
    Fetch a post by its ID.
    Should not return the post if the post status is not published.
    Only the post owner should be able to fetch the post if the post status is not published.
    """
    post = db.posts.find_one({"_id": ObjectId(id)})
    if not post:
        return jsonify({"error": "Post not found"}), 404
    if post["status"] != PostStatus.PUBLISHED.value:
        return jsonify({"error": "Access denied"}), 403
    return jsonify(post), 200
    # return jsonify({"message": f"Fetching post with ID {id}"}), 200

@routes.route('/posts/<string:id>', methods=['DELETE'])
def delete_post(id):
    """
    Delete a post by its ID.
    Only the post owner should be able to delete the post.
    """
    count = delete_post_from_model(id)
    if count == 0:
        return jsonify({"error": "Post not found or not deleted"}), 404
    return jsonify({"message": f"Post {id} deleted"}), 200
    # return jsonify({"message": f"Deleting post with ID {id}"}), 200

@routes.route('/posts/<string:id>', methods=['PATCH'])
def update_post(id):
    """
    Update a post by its ID.
    Only the post owner should be able to update the post.
    Only the post status should be updatable between PUBLISHED, UNPUBLISHED and CLOSED.
    """
    data = request.json
    if "status" not in data:
        return jsonify({"error": "Status is required"}), 400
    try:
        new_status = PostStatus(data["status"])
    except ValueError:
        return jsonify({"error": "Invalid status provided"}), 400
    count = update_post_from_model(id, new_status)
    if count == 0:
        return jsonify({"error": "Post not found or not updated"}), 404
    return jsonify({"message": f"Post {id} updated to {new_status.value}"}), 200
    # return jsonify({"message": f"Updating post with ID {id}"}), 200

@routes.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    """
    Fetch a user by its ID. 
    """
    user = get_user_by_id(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user["_id"] = str(user["_id"])
    return jsonify(user), 200
    # return jsonify({"message": f"Fetching user with ID {id}"}), 200

@routes.route('/users/<string:id>', methods=['DELETE'])
def delete_user(id):
    """
    Delete a user by its ID.
    Only the user owner should be able to delete the user.
    """
    count = delete_user_from_model(id)
    if count == 0:
        return jsonify({"error": "User not found or not deleted"}), 404
    return jsonify({"message": f"User {id} deleted"}), 200
    # return jsonify({"message": f"Deleting user with ID {id}"}), 200

@routes.route('/users/<string:id>', methods=['PATCH'])
def update_user(id):
    """
    Update a user by its ID.
    Only the user owner should be able to update the user.
    Only the user college and department should be updatable.
    """
    data = request.json
    college = data.get("college")
    department = data.get("department")
    if not college and not department:
        return jsonify({"error": "At least one field (college or department) must be provided"}), 400
    count = update_user_from_model(id, college, department)
    if count == 0:
        return jsonify({"error": "User not found or not updated"}), 404
    return jsonify({"message": f"User {id} updated"}), 200
    # return jsonify({"message": f"Updating user with ID {id}"}), 200

@routes.route('/myposts', methods=['GET'])
def get_my_posts():
    """
    Fetch all posts created by the user.
    Should return all posts created by the user regardless of the post status.
    Allow filtering by post status and category.
    Allow searching by post title and description.
    Allow sorting by post created date.
    Allow pagination.
    """
    # db = current_app.config["MONGO_DB"]
    user_email = request.args.get("user_email")
    if not user_email:
        return jsonify({"error": "user_email query parameter required"}), 400
    query = {"user_email": user_email}
    status = request.args.get("status")
    if status:
        query["status"] = status
    category = request.args.get("category")
    if category:
        query["category"] = category
    search = request.args.get("search")
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    sort_by = request.args.get("sort_by", "created_at")
    order = int(request.args.get("order", -1))
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    posts_cursor = db.posts.find(query).sort(sort_by, order).skip((page-1)*page_size).limit(page_size)
    posts = []
    for post in posts_cursor:
        post["_id"] = str(post["_id"])
        posts.append(post)
    return jsonify(posts), 200
    # return jsonify({"message": "Fetching my posts"}), 200

@routes.route('/posts', methods=['GET'])
def get_posts():
    """
    Fetch all posts.
    Should return all posts in published status.
    Allow filtering by post category.
    Allow searching by post title and description.
    Allow sorting by post created date.
    Allow pagination.
    """
    # db = current_app.config["MONGO_DB"]
    query = {"status": PostStatus.PUBLISHED.value}
    category = request.args.get("category")
    if category:
        query["category"] = category
    search = request.args.get("search")
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    # Sorting and pagination (simplified)
    sort_by = request.args.get("sort_by", "created_at")
    order = int(request.args.get("order", -1))
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    posts_cursor = db.posts.find(query).sort(sort_by, order).skip((page-1)*page_size).limit(page_size)
    posts = []
    for post in posts_cursor:
        post["_id"] = str(post["_id"])
        posts.append(post)
    return jsonify(posts), 200
    # return jsonify({"message": "Fetching all posts"}), 200

@routes.route('/posts', methods=['POST'])
def create_post():
    """
    Create a new post.
    Must process the post image and text for modedration.
    Once moderated, the post should be created with the status set to PUBLISHED.
    Post images must be stored in s3 bucket and the URL should be returned in the response.
    While moderation is running the the post images must be stored in an intermediary s3 bucket and post status must be set to PROCESSING.
    If post moderation fails, the post status should be changed to FAILED allowing user to only delete the post. 
    """
    data = request.json
    required_fields = ["user_email", "category", "title", "description"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400
    try:
        category = PostCategory(data["category"])
    except ValueError:
        return jsonify({"error": "Invalid category"}), 400
    post_id = create_post_from_model(data["user_email"], category, data["title"], data["description"])
    # Simulate moderation process: here we'll just set the status to PUBLISHED.
    update_post_from_model(post_id, PostStatus.PUBLISHED)
    image_url = data.get("image_url")
    if image_url:
        create_image(str(post_id), image_url)
    return jsonify({"message": "Post created", "post_id": str(post_id)}), 201
    # return jsonify({"message": "Creating a new post"}), 201

@routes.route('/signedurl', methods=['GET'])
def get_signed_url():
    """
    Generate a signed URL for the post images.
    Common URL should be returned for all the post images in the final s3 bucket (not the intermediary s3 bucket).
    """
    # TODO
    signed_url = ""
    return jsonify({"signed_url": signed_url}), 200
    # return jsonify({"message": "Fetching signed URL"}), 200