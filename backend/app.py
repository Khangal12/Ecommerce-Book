import os
import shutil
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from backend.config import config
from backend.models import db, Book
from backend.routes.admin import admin_bp
from backend.routes.login import login_bp
from backend.routes.filter import filter_bp
from backend.routes.detail import detail_bp
from backend.routes.book import book_bp
from backend.routes.settings import user_settings_bp
from backend.routes.cart import cart_bp
from dotenv import load_dotenv
from flask_cors import CORS
import datetime

load_dotenv() 
migrate = Migrate()

def create_app(config_name="development"):
    app = Flask(__name__)

    # Safe mode-г шалгах: орчинд тохируулсан SAFE_MODE хувьсагчийн утгыг авах
    safe_mode = os.getenv("SAFE_MODE", "false") == "true"  # Хэрэв SAFE_MODE нь true байвал safe_mode нь True болно

    # Зураг үйлдлүүдийг дамжуулах route
    @app.route('/files/book_images/<filename>')
    def serve_image(filename):
        # Зургийг root доторх 'files/book_images' хавтсаас олж дамжуулах
        return send_from_directory(os.path.join(app.root_path, 'files', 'book_images'), filename)

    # CORS тохиргоог идэвхжүүлэх
    CORS(app, origins=["http://localhost:3000","http://localhost:3001"])
    CORS(admin_bp, origins=["http://localhost:3000","http://localhost:3001"])
    CORS(login_bp, origins=["http://localhost:3000","http://localhost:3001"])
    CORS(filter_bp, origins=["http://localhost:3000","http://localhost:3001"])
    CORS(detail_bp, origins=["http://localhost:3000","http://localhost:3001"])    
    CORS(book_bp, origins=["http://localhost:3000","http://localhost:3001"])
    CORS(user_settings_bp, origins=["http://localhost:3000","http://localhost:3001"])    
    CORS(cart_bp, origins=["http://localhost:3000","http://localhost:3001"])

    # Тохиргоог ачаалж авах
    app.config.from_object(config[config_name])

    # Өргөтгөлийг эхлүүлэх
    db.init_app(app)
    migrate.init_app(app, db)

    # Safe Mode-ийг шалгах route нэмэх
    @app.route('/api/safe-mode', methods=['GET'])
    def get_safe_mode():
        # Safe Mode-ийн байдал
        return jsonify({"safeMode": safe_mode})

    # Өгөгдөл авах route, Safe Mode-ыг шалгаж зарим үйлдлийг хязгаарлах
    @app.route('/api/data', methods=['GET'])
    def get_data():
        if safe_mode:
            # Хэрэв Safe Mode идэвхжсэн бол зарим үйлдлийг хязгаарлах
            return jsonify({"status": "error", "message": "Safe mode is enabled, some features are restricted."}), 403
        else:
            # Үйлдлийг хэвийн горимд ажиллуулах
            return jsonify({"status": "success", "message": "Data fetched successfully."})

    # Автомат backup хийх функц
    def backup_database():
        if safe_mode:
            # Safe Mode идэвхжсэн үед автомат backup хийх
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = f"backup_{timestamp}.db"  # Backup файл нэр
            backup_path = os.path.join(app.root_path, 'backups', backup_file)

            # Backup хийх: db файлыг 'backups' хавтас руу хуулна
            if not os.path.exists(os.path.dirname(backup_path)):
                os.makedirs(os.path.dirname(backup_path))

            shutil.copy(app.config['SQLALCHEMY_DATABASE_URI'], backup_path)
            print(f"Database backup created at {backup_path}")

    # Жишээ: Нэг удаагийн backup хийх
    backup_database()

    # Blueprint-уудыг бүртгэх
    app.register_blueprint(admin_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(filter_bp)
    app.register_blueprint(detail_bp)
    app.register_blueprint(book_bp)
    app.register_blueprint(user_settings_bp)
    app.register_blueprint(cart_bp)

    return app

if __name__ == "__main__":
    # Flask орчны хувьсагчийг шалгах (development эсвэл production гэх мэт)
    env = os.getenv("FLASK_ENV", "development")
    app = create_app(env)
    app.run(debug=True)
