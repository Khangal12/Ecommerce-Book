from flask import Blueprint, request, jsonify, current_app
from backend.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import traceback

login_bp = Blueprint('login', __name__)

@login_bp.route('/login/', methods=['POST'])
def login():
    with current_app.app_context():
        try:
            data = request.form
            email = data.get('email')
            password = data.get('password')

            # Fetch the user by email
            user = User.query.filter_by(email=email).first()

            if user and check_password_hash(user.password, password):
                user_data = {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "address": user.address,
                    "phone_number": user.phone_number
                }
                # Password is correct, return success
                return jsonify({"status": "success", "message": "Login successful", "user":user_data}), 200
            else:
                # Invalid email or password
                return jsonify({"status": "error", "message": "Invalid credentials"}), 401

        except Exception as e:
            current_app.logger.error(f"Error during login: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "An error occurred", "error": str(e)}), 500

@login_bp.route('/signUp/', methods=['POST'])
def signUp():
    with current_app.app_context():
        try:
            data = request.form
            email = data.get('email')
            username = data.get('username')
            address = data.get('address')
            password = data.get('password')
            phone_number = data.get('phone_number')

            # Check if the email already exists
            if User.query.filter_by(email=email).first():
                return jsonify({"status": "error", "message": "И-мэйл хаяг аль хэдийн бүртгэгдсэн байна"}), 409

            # Check if the username already exists
            if User.query.filter_by(username=username).first():
                return jsonify({"status": "error", "message": "Нэвтрэх нэр аль хэдийн бүртгэгдсэн байна"}), 409

            # Hash the password
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

            # Create a new user
            newUser = User(email=email, password=hashed_password, username=username, address=address, phone_number=phone_number)
            db.session.add(newUser)
            db.session.commit()

            return jsonify({"status": "success", "message": "Хэрэглэгч амжиллтай бүртгэгдлээ"}), 200

        except Exception as e:
            current_app.logger.error(f"Error during sign-up: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Алдаа", "error": str(e)}), 402
