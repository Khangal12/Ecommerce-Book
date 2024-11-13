# backend/__init__.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize db and migrate
db = SQLAlchemy()
migrate = Migrate()

# Import the application factory function here to avoid circular imports
from .app import create_app
