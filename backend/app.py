import logging
from logging.handlers import RotatingFileHandler
import os
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

load_dotenv()
migrate = Migrate()

def create_app(config_name="development"):
    app = Flask(__name__)

    # Fixed route for serving images
    @app.route('/files/book_images/<filename>')
    def serve_image(filename):
        return send_from_directory(os.path.join(app.root_path, 'files', 'book_images'), filename)

    # Enable CORS
    CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])
    CORS(admin_bp, origins=["http://localhost:3000", "http://localhost:3001"])
    CORS(login_bp, origins=["http://localhost:3000", "http://localhost:3001"])
    CORS(filter_bp, origins=["http://localhost:3000", "http://localhost:3001"])
    CORS(detail_bp, origins=["http://localhost:3000", "http://localhost:3001"])    
    CORS(book_bp, origins=["https://localhost:3000", "http://localhost:3001"])
    CORS(user_settings_bp, origins=["https://localhost:3000", "http://localhost:3001"])    
    CORS(cart_bp, origins=["https://localhost:3000", "http://localhost:3001"])

    # Load configuration
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(admin_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(filter_bp)
    app.register_blueprint(detail_bp)
    app.register_blueprint(book_bp)
    app.register_blueprint(user_settings_bp)
    app.register_blueprint(cart_bp)

    # Configure logging
    if not os.path.exists('logs'):
        os.makedirs('logs')
    log_file = os.path.join('logs', 'app.log')

    # Create a rotating file handler
    file_handler = RotatingFileHandler(log_file, maxBytes=10240, backupCount=10)
    file_handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)

    # Set logging level for the app logger
    app.logger.setLevel(logging.INFO)
    app.logger.info('Application startup')

    return app

if __name__ == "__main__":
    # Get the environment variable for the Flask environment
    env = os.getenv("FLASK_ENV", "development")
    app = create_app(env)
    app.run(debug=True)
