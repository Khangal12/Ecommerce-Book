from flask import Flask, jsonify, request, Blueprint, current_app
from backend.models import db, User
import traceback

user_settings_bp = Blueprint('userSettings', __name__)

# Route to save user settings (POST for creating a new user, PUT for updating an existing user)
@user_settings_bp.route('/putUser/', methods=["PUT"])
def save_user():
    data = request.get_json()
    try:
            user_id = data.get("id")
            user = User.query.get(user_id)

            if not user:
                return jsonify({"error": "User not found"}), 404

            user.username = data.get("username", user.username)
            user.email = data.get("email", user.email)
            user.phone_number = data.get("phone", user.phone_number)
            user.address = data.get("address", user.address)

            db.session.commit()
            return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Failed to save user"}), 500
