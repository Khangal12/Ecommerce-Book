import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from backend.config import config
from backend.models import db, Book
from backend.routes.admin import admin_bp
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
    CORS(app, origins=["http://localhost:3000"])  # Assuming frontend is on localhost:3000
    CORS(admin_bp, origins=["http://localhost:3000"])

    # Load configuration
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(admin_bp)

    return app

if __name__ == "__main__":
    # Get the environment variable for the Flask environment
    env = os.getenv("FLASK_ENV", "development")
    app = create_app(env)
    app.run(debug=True)
