from flask import Blueprint, request, jsonify, current_app
from backend.models import db, Book, Category
import traceback

filter_bp = Blueprint('filter', __name__)

@filter_bp.route('/categories/', methods=['GET'])
def get_categories():
    with current_app.app_context():
        try:
            # Бүх категориудыг татаж авах
            categories = Category.query.all()
            category_list = [{"id": category.id, "name": category.name} for category in categories]

            # Book моделийн distinct авторуудыг татаж авах (author field нь string гэж үзсэн)
            authors = db.session.query(Book.author).distinct().all()

            # Авторын нэрсийг татаж авсан үр дүнгээс гаргаж авах
            author_list = [author[0] for author in authors]

            return jsonify({
                "status": "success",
                "categories": category_list,
                "authors": author_list
            }), 200

        except Exception as e:
            # Алдаа гарсан тохиолдолд алдааны мэдээллийг тэмдэглэх
            current_app.logger.error(f"Категориудыг татах үед алдаа гарлаа: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Категориудыг татах явцад алдаа гарлаа",
                "error": str(e)
            }), 500

@filter_bp.route('/books', methods=['GET'])
def get_filtered_books():
    with current_app.app_context():
        try:
            # Автор болон категориудаар шүүгдсэн номнуудыг татаж авах
            author_filter = request.args.getlist('author')
            category_filter = request.args.getlist('category')
            price_range=request.args.get('priceRange')
            page = int(request.args.get('page',1))
            limit = int(request.args.get('limit' , 8))

            query = Book.query

            # Автор шүүлт хийх
            if author_filter and any(author_filter):
                query = query.filter(Book.author.in_(author_filter))
            
            # Категори шүүлт хийх
            if category_filter and any(category_filter):
                query = query.filter(Book.categories.any(Category.id.in_(category_filter)))
            
            # Үнэ шүүлт хийх
            if price_range:
                try:
                    # Үнэний диапазоныг салгах (e.g., "7970,500000")
                    price_min, price_max = map(float, price_range.split(','))
                    query = query.filter(Book.price >= price_min, Book.price <= price_max)
                except ValueError:
                    # Үнэний формат буруу байвал алдаа буцаах
                    return jsonify({
                        "status": "error",
                        "message": "Үнэний формат буруу байна. 'minPrice,maxPrice' гэж бичнэ үү."
                    }), 400

            # Query-г гүйцэтгэх
            total_books = query.with_entities(Book.id).count()  # ID-гаар тоолох (илүү хурдан)
            total_pages = (total_books + limit - 1) // limit

            # Хуудаслалт: Одоогийн хуудаснаас шалтгаалан limit, offset тохируулах
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
            # Алдаа гарсан тохиолдолд алдааны мэдээллийг тэмдэглэх
            current_app.logger.error(f"Шүүгдсэн номнуудыг татах явцад алдаа гарлаа: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Номнуудыг татах явцад алдаа гарлаа",
                "error": str(e)
            }), 500

@filter_bp.route('/books/<int:id>', methods=['GET'])
def get_one_book(id):
    with current_app.app_context():
        try:
            # Номыг ID-аар татаж авах
            book = Book.query.get(id)
            
            if not book:
                # Ном олдоогүй тохиолдолд алдаа буцаах
                return jsonify({
                    "status": "error",
                    "message": f"ID {id} дугаартай ном олдсонгүй."
                }), 404
            
            book_data = book.to_dict()

            return jsonify({
                "status": "success",
                "book": book_data
            }), 200

        except Exception as e:
            # Алдаа гарсан тохиолдолд алдааны мэдээллийг тэмдэглэх
            current_app.logger.error(f"ID {id} дугаартай номыг татах үед алдаа гарлаа: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Номыг татах явцад алдаа гарлаа",
                "error": str(e)
            }), 500

@filter_bp.route('/recommendations/<int:id>/', methods=['GET'])
def get_recommendations(id):
    with current_app.app_context():
        try:
            # Номыг ID-аар татаж авах
            book = Book.query.get(id)
            
            if not book:
                # Ном олдоогүй тохиолдолд алдаа буцаах
                return jsonify({
                    "status": "error",
                    "message": f"ID {id} дугаартай ном олдсонгүй."
                }), 404
            
            # санал болгох ном
            recommendations = Book.query.filter(
                Book.categories.any(Category.id.in_([cat.id for cat in book.categories])),  # Адилхан категориудыг шүүх
                Book.id != id  # Одоогийн номыг хасах
            ).limit(5).all()

            recommendation_data = [rec.to_dict() for rec in recommendations]
        
            return jsonify({
                "status": "success",
                "book": recommendation_data
            }), 200

        except Exception as e:
            # Алдаа гарсан тохиолдолд алдааны мэдээллийг тэмдэглэх
            current_app.logger.error(f"ID {id} дугаартай номыг татах үед алдаа гарлаа: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Номыг татах явцад алдаа гарлаа",
                "error": str(e)
            }), 500
