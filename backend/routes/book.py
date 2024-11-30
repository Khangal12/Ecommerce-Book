from flask import Flask, jsonify, request, Blueprint, current_app
from backend.models import db, Book, User
import traceback

book_bp = Blueprint('book', __name__)

@book_bp.route('/books/', methods=["GET"])
def get_books():
    with current_app.app_context():
        try:
            books = Book.query.limit(10)

            books_data = [book.to_dict() for book in books]

            return jsonify({"status": "success", "message": "", "books": books_data}), 200

        except Exception as e:
            current_app.logger.error(f"Error retrieving books: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Error saving the book", "error": str(e)}), 500
        
