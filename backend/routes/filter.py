from flask import Blueprint, request, jsonify, current_app
from backend.models import db, Book, Category
import traceback

filter_bp = Blueprint('filter', __name__)

@filter_bp.route('/categories', methods=['GET'])
def get_categories():
    with current_app.app_context():
        try:
            # Fetch all categories
            categories = Category.query.all()
            category_list = [{"id": category.id, "name": category.name} for category in categories]

            # Fetch distinct authors from the Book model (assuming 'author' is a string field)
            authors = db.session.query(Book.author).distinct().all()

            # Extract the author names from the query result
            author_list = [author[0] for author in authors]

            return jsonify({
                "status": "success",
                "categories": category_list,
                "authors": author_list
            }), 200

        except Exception as e:
            current_app.logger.error(f"Error while fetching categories: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "An error occurred while fetching categories",
                "error": str(e)
            }), 500

@filter_bp.route('/books', methods=['GET'])
def get_filtered_books():
    with current_app.app_context():
        try:
            author_filter = request.args.getlist('author')
            category_filter = request.args.getlist('category')
            price_range=request.args.get('priceRange')
            page = int(request.args.get('page',1))
            limit = int(request.args.get('limit' , 8))

            query = Book.query

            if author_filter and any(author_filter):
                query = query.filter(Book.author.in_(author_filter))
            
            if category_filter and any(category_filter):
                query = query.filter(Book.categories.any(Category.id.in_(category_filter)))
            
            if price_range:
                # Split the price range string by comma (e.g., "7970,500000")
                try:
                    price_min, price_max = map(float, price_range.split(','))
                    query = query.filter(Book.price >= price_min, Book.price <= price_max)
                except ValueError:
                    # Handle the case where the price range is not in the correct format
                    return jsonify({
                        "status": "error",
                        "message": "Invalid price range format. Please use 'minPrice,maxPrice'."
                    }), 400

            # Execute the query
            total_books = query.with_entities(Book.id).count()  # Count only IDs to speed up the process
            total_pages = (total_books + limit - 1) // limit

            # Paginate: Limit and offset based on current page
            books = query.offset((page - 1) * limit).limit(limit).all()
            books_data = [book.to_dict() for book in books]

            return jsonify({
                "status": "success",
                "books": books_data,
                "totalBooks": total_books,
                "totalPages": total_pages,
                "currentPage": page
            }), 200

        except Exception as e:
            current_app.logger.error(f"Error while fetching filtered books: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "An error occurred while fetching books",
                "error": str(e)
            }), 500

@filter_bp.route('/books/<int:id>', methods=['GET'])
def get_one_book(id):
    with current_app.app_context():
        try:
            book = Book.query.get(id)
            
            if not book:
                return jsonify({
                    "status": "error",
                    "message": f"Book with ID {id} not found."
                }), 404
            
            book_data = book.to_dict()

            return jsonify({
                "status": "success",
                "book": book_data
            }), 200

        except Exception as e:
            current_app.logger.error(f"Error while fetching book with ID {id}: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "An error occurred while fetching the book",
                "error": str(e)
            }), 500

@filter_bp.route('/recommendations/<int:id>/', methods=['GET'])
def get_recommendations(id):
    with current_app.app_context():
        try:
            book = Book.query.get(id)
            
            if not book:
                return jsonify({
                    "status": "error",
                    "message": f"Book with ID {id} not found."
                }), 404
            
            recommendations = Book.query.filter(
                Book.categories.any(Category.id.in_([cat.id for cat in book.categories])),  # Check for matching categories
                Book.id != id  # Exclude the current book
            ).limit(5).all()

            recommendation_data = [rec.to_dict() for rec in recommendations]
        
            return jsonify({
                "status": "success",
                "book": recommendation_data
            }), 200

        except Exception as e:
            current_app.logger.error(f"Error while fetching book with ID {id}: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "An error occurred while fetching the book",
                "error": str(e)
            }), 500

