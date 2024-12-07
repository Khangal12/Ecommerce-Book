# Flask-ийн Blueprint модулийг оруулж байна
from flask import Blueprint, request, jsonify, current_app
from backend.models import db, Book, Category, Order, OrderItem  # Моделүүдийг оруулж байна
import datetime  # Огноог боловсруулахын тулд datetime модулийг ашиглана
import os  # Файл хадгалах болон устгах функцийг ашиглана
import traceback  # Алдаа гарсан тохиолдолд дэлгэрэнгүй тайлбар гаргахын тулд ашиглана
from sqlalchemy.orm import joinedload  # SQLAlchemy оролт ашиглаж байгаа бол шаардлагатай

# Файлын хадгалах хавтасны замыг тодорхойлж байна
UPLOAD_FOLDER = 'files/book_images/'
BASE_URL = "http://127.0.0.1:5000/"  # Үндсэн URL

# Blueprint (админ хэсгийн API маршрутуудыг хуваарилах) тодорхойлж байна
admin_bp = Blueprint('admin', __name__)

def save_image(file, folder=UPLOAD_FOLDER):
    """Saves an uploaded image file to the specified folder."""
    try:
        timestamp = datetime.datetime.now().timestamp()
        filename = f"{timestamp}_{file.filename}"
        os.makedirs(folder, exist_ok=True)
        path = os.path.join(folder, filename)
        file.save(path)
        return path
    except Exception as e:
        current_app.logger.error(f"Error saving file: {traceback.format_exc()}")
        raise

def get_or_create_category(name):
    """Fetch or create a category."""
    category = Category.query.filter_by(name=name).first()
    if not category:
        category = Category(name=name)
        db.session.add(category)
        db.session.commit()
    return category

# Ном нэмэх api
@admin_bp.route('/admin/add_book/', methods=['POST'])
def add_book():
        try:
            data = request.form
            image = request.files.get('file')
            published_date = datetime.datetime.strptime(data['publishedDate'], "%Y-%m-%d")
            categories = [get_or_create_category(name) for name in data.getlist('category')]

            # Save image
            image_path = save_image(image)

            # Create new book
            new_book = Book(
                title=data['name'],
                author=data['author'],
                price=float(data['price']),
                published_date=published_date,
                description=data.get('description'),
                stock_quantity=int(data.get('quantity', 0)),
                image_url=image_path,
                categories=categories
            )
            db.session.add(new_book)
            db.session.commit()
            return jsonify({"status": "success", "message": "Ном амжилттай нэмэгдлээ", "book": new_book.to_dict()}), 200

        except Exception as e:
            # Алдаа гарсан тохиолдолд лог бичиж, алдааг хариулах
            current_app.logger.error(f"Error adding book: {traceback.format_exc()}")
            return jsonify({"message": "Error saving the book", "error": str(e)}), 500

# Номын жагсаалтыг авах api
@admin_bp.route('/admin/books/', methods=["GET"])
def get_books():
    with current_app.app_context():
        try:
            books = Book.query.all()  # Бүх номыг авна

            # Ном бүрийн мэдээллийг dict хэлбэрт хөрвүүлж байна
            books_data = [book.to_dict() for book in books]

            return jsonify({"status": "success", "message": "", "books": books_data}), 200

        except Exception as e:
            # Алдаа гарсан тохиолдолд лог бичиж, хариу буцаах
            current_app.logger.error(f"Error retrieving books: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Error saving the book", "error": str(e)}), 500

# Ном устгах маршрут
@admin_bp.route('/admin/delete_book/<int:book_id>/', methods=["DELETE"])
def delete_book(book_id):
    with current_app.app_context():
        try:
            book = Book.query.get(book_id)  # Номыг ID-ээр хайж байна
            if not book:
                return jsonify({"message": "Book not found"}), 404

            # Хэрэв зурагтай бол зураг файлыг устгах
            if book.image_url and os.path.exists(book.image_url):
                os.remove(book.image_url)

            db.session.delete(book)  # Номыг устгах
            db.session.commit()  # Өгөгдлийн санд өөрчлөлт хийх

            return jsonify({"status": "success", "message": "Ном амжилттай устгагдалаа"}), 200

        except Exception as e:
            current_app.logger.error(f"Error deleting book: {traceback.format_exc()}")
            return jsonify({"message": "Error deleting the book", "error": str(e)}), 500

# Ном засварлах api
@admin_bp.route('/admin/edit_book/<int:book_id>/', methods=['PUT'])
def edit_book(book_id):
    with current_app.app_context():
        data = request.form  # Формын өгөгдөл
        image = request.files.get('file')  # Файл (зураг) авах
        published_date = data.get('publishedDate')  # Хэвлэгдсэн огноо
        quantity = int(data.get('quantity'))  # Тоо хэмжээ
        categories = [get_or_create_category(name) for name in data.getlist('category')]  # Категориуд

        try:
            book = Book.query.get(book_id)  # Номыг ID-ээр авах
            if not book:
                return jsonify({"message": "Book not found"}), 404

            # Хэвлэгдсэн огноог шинэчилж байна
            published_date = datetime.datetime.strptime(published_date, "%Y-%m-%d")
            
            # Шинэ зураг байвал хадгалж, хуучин зургийг устгана
            if image:
                if book.image_url and os.path.exists(book.image_url):
                    os.remove(book.image_url)
                book.image_url = save_image(image)

            # Бусад талбаруудыг шинэчилж байна
            book.title = data['name']
            book.author = data['author']
            book.price = float(data['price'])
            book.published_date = published_date
            book.description = data.get('description')
            book.stock_quantity = quantity

            # Категориудыг шинэчилж байна
            book.categories = categories

            db.session.commit()  # Өгөгдлийн санд өөрчлөлт хийх

            return jsonify({"status": "success", "message": "Ном амжилттай засагдлаа", "book": book.to_dict()}), 200

        except Exception as e:
            current_app.logger.error(f"Error updating book: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Error updating the book", "error": str(e)}), 500

# Захиалга авах api
@admin_bp.route('/admin/orders/', methods=['GET'])
def get_order():
    try:
        # Хуудасны дугаар болон хязгаарын хэмжээг авна
        page = request.args.get('page', 1, type=int)  
        limit = request.args.get('limit', 10, type=int)

        # Захиалгуудыг авах
        query = Order.query.order_by(Order.order_date.desc())

        # Захиалгуудыг хуудаслах
        orders_paginated = query.paginate(page=page, per_page=limit, error_out=False)

        orders = [order.to_dict() for order in orders_paginated.items]
        total_pages = orders_paginated.pages
        total_items = orders_paginated.total

        if not orders:
            return jsonify({
                "status": "success",
                "message": "Захиалга байхгүй",
                "items": [],
                "pagination": {
                    "total_pages": total_pages,
                    "total_items": total_items,
                    "current_page": page
                }
            }), 200

        return jsonify({
            "status": "success",
            "message": "Order items retrieved successfully",
            "items": orders,
            "pagination": {
                "total_pages": total_pages,
                "total_items": total_items,
                "current_page": page
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error retrieving order items: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Error retrieving order items",
            "error": str(e),
        }), 500

# Захиалгын төлвийг өөрчлөх api
@admin_bp.route('/admin/orders/<int:pk>/', methods=['PUT'])
def change_status(pk):
    try:
        order = Order.query.get(pk)  # Захиалгыг ID-ээр авах

        if not order:
            return jsonify({
                "status": "error",
                "message": "Захиалга байхгүй",
            }), 404

        order.status = "success"  # Төлвийг амжилттай гэж өөрчилж байна
        db.session.commit()  # Өгөгдлийн санд өөрчлөлт хийх

        return jsonify({
            "status": "success",
            "message": "Амжилттай хүргэгдсэн",
        }), 200

    except Exception as e:
        current_app.logger.error(f"Төлөв солиход алдаа: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Алдаа",
            "error": str(e),
        }), 500

# Захиалгын дэлгэрэнгүй мэдээлэл авах api
@admin_bp.route('/admin/orders/<int:pk>/', methods=['GET'])
def get_orderDetail(pk):
    try:
        order = Order.query.get(pk)  # Захиалга авах
        order_items = OrderItem.query.filter_by(order_id=pk).all()  # Захиалгын эд зүйлс авах
        items_data = []
        for item in order_items:
            items_data.append({
                "id":item.id,
                "book": item.book.to_dict() if item.book else "Нэргүй",
                "quantity": item.quantity,
                "price": item.price,
                "total": item.quantity * item.price,
            })

        if not items_data:
            return jsonify({
                "status": "success",
                "message": "Захиалга байхгүй",
                "items": [],
            }), 200

        return jsonify({
            "status": "success",
            "message": "Order items retrieved successfully",
            "items": items_data,
            "address": order.address if order else "Хаяг байхгүй"
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error retrieving order items: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Error retrieving order items",
            "error": str(e),
        }), 500
