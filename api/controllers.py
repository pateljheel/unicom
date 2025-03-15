from flask import Blueprint, jsonify

routes = Blueprint('routes', __name__)

@routes.route('/posts/<string:id>', methods=['GET'])
def get_post(id):
    """
    Fetch a post by its ID.
    Should not return the post if the post status is not published.
    Only the post owner should be able to fetch the post if the post status is not published.
    """
    return jsonify({"message": f"Fetching post with ID {id}"}), 200

@routes.route('/posts/<string:id>', methods=['DELETE'])
def delete_post(id):
    """
    Delete a post by its ID.
    Only the post owner should be able to delete the post.
    """
    return jsonify({"message": f"Deleting post with ID {id}"}), 200

@routes.route('/posts/<string:id>', methods=['PATCH'])
def update_post(id):
    """
    Update a post by its ID.
    Only the post owner should be able to update the post.
    Only the post status should be updatable between PUBLISHED, UNPUBLISHED and CLOSED.
    """
    return jsonify({"message": f"Updating post with ID {id}"}), 200

@routes.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    """
    Fetch a user by its ID. 
    """
    return jsonify({"message": f"Fetching user with ID {id}"}), 200

@routes.route('/users/<string:id>', methods=['DELETE'])
def delete_user(id):
    """
    Delete a user by its ID.
    Only the user owner should be able to delete the user.
    """
    return jsonify({"message": f"Deleting user with ID {id}"}), 200

@routes.route('/users/<string:id>', methods=['PATCH'])
def update_user(id):
    """
    Update a user by its ID.
    Only the user owner should be able to update the user.
    Only the user college and department should be updatable.
    """
    return jsonify({"message": f"Updating user with ID {id}"}), 200

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
    return jsonify({"message": "Fetching my posts"}), 200

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
    return jsonify({"message": "Fetching all posts"}), 200

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
    return jsonify({"message": "Creating a new post"}), 201

@routes.route('/signedurl', methods=['GET'])
def get_signed_url():
    """
    Generate a signed URL for the post images.
    Common URL should be returned for all the post images in the final s3 bucket (not the intermediary s3 bucket).
    """
    return jsonify({"message": "Fetching signed URL"}), 200
