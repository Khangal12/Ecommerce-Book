from flask import Blueprint, request, jsonify, current_app
from backend.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import traceback
import re  # Regex шалгагч

# Логин болон бүртгэлийн Blueprint үүсгэх
login_bp = Blueprint('login', __name__)

# И-мэйл хаягийг шалгах утилит функц
def is_valid_email(email):
    email_regex = r"(^[a-z0-9_]+(?:-[a-z0-9_]+)*@[a-z0-9-]+\.[a-z0-9-]+$)"
    return re.match(email_regex, email) is not None

# Логин хийх маршрутын тодорхойлолт
@login_bp.route('/login/', methods=['POST'])
def login():
    with current_app.app_context():
        try:
            data = request.get_json()  # JSON хэлбэрээр өгөгдөл авах
            email = data.get('email')  # И-мэйл хаягийг авна
            password = data.get('password')  # Нууц үгийг авна

            # И-мэйл эсвэл нууц үг хоосон байгаа эсэхийг шалгана
            if not email or not password:
                return jsonify({"status": "error", "message": "И-мэйл эсвэл нууц үг хоосон байна"}), 400

            # И-мэйл хаягийн формат зөв эсэхийг шалгана
            if not is_valid_email(email):
                return jsonify({"status": "error", "message": "Буруу И-мэйл хаяг"}), 400

            # И-мэйл хаягаар хэрэглэгчийг хайна
            user = User.query.filter_by(email=email).first()

            # Хэрэглэгч байгаа бөгөөд нууц үг зөв бол
            if user and check_password_hash(user.password, password):
                # Хэрэглэгчийн мэдээллийг бэлтгэнэ
                user_data = {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "address": user.address,
                    "phone_number": user.phone_number
                }
                # Амжилттай нэвтэрлээ гэж мэдэгдэнэ
                return jsonify({"status": "success", "message": "Амжилттай нэвтэрлээ", "user": user_data}), 200
            else:
                # И-мэйл эсвэл нууц үг буруу бол
                return jsonify({"status": "error", "message": "Алдаа"}), 401

        except Exception as e:
            # Алдаа гарвал логи руу бичиж, хэрэглэгчид алдааг харуулах
            current_app.logger.error(f"Error during login: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Алдаа гарсан байна", "error": str(e)}), 500

# Бүртгэл хийх маршрутын тодорхойлолт
@login_bp.route('/signUp/', methods=['POST'])
def signUp():
    with current_app.app_context():
        try:
            data = request.get_json()  # JSON хэлбэрээр өгөгдөл авах
            email = data.get('email')  # И-мэйл хаягийг авна
            username = data.get('username')  # Нэвтрэх нэрийг авна
            address = data.get('address')  # Хаягийг авна
            password = data.get('password')  # Нууц үгийг авна
            phone_number = data.get('phone_number')  # Утасны дугаарыг авна

            # Бүх талбар бөглөгдсөн эсэхийг шалгана
            if not email or not username or not password or not phone_number:
                return jsonify({"status": "error", "message": "Бүх талбарууд бөглөнө үү"}), 400

            # И-мэйл хаягийн формат зөв эсэхийг шалгана
            if not is_valid_email(email):
                return jsonify({"status": "error", "message": "Буруу И-мэйл хаяг"}), 400

            # Нууц үгийн урт шалгана (жишээ нь 6 тэмдэгтээс бага байх ёсгүй)
            if len(password) < 6:
                return jsonify({"status": "error", "message": "Нууц үг 6-с багагүй тэмдэгттэй байх ёстой"}), 400

            # И-мэйл хаяг болон хэрэглэгчийн нэрийг шалгах
            existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
            if existing_user:
                return jsonify({"status": "error", "message": "И-мэйл хаяг эсвэл нэвтрэх нэр аль хэдийн бүртгэгдсэн байна"}), 409

            # Хэрэглэгчийн нууц үгийг давхар нууцлан хадгална
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

            # Шинэ хэрэглэгч үүсгэнэ
            new_user = User(email=email, password=hashed_password, username=username, address=address, phone_number=phone_number)
            db.session.add(new_user)
            db.session.commit()  # Өгөгдлийн сантай холбоход commit хийнэ

            return jsonify({"status": "success", "message": "Хэрэглэгч амжилттай бүртгэгдлээ"}), 200

        except Exception as e:
            # Алдаа гарвал логи руу бичиж, хэрэглэгчид алдааг харуулах
            current_app.logger.error(f"Error during sign-up: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Алдаа гарсан байна", "error": str(e)}), 500
