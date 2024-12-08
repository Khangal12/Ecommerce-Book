from flask import Blueprint, request, jsonify, current_app
from backend.models import db, Book, Category, Order, OrderItem
import datetime
import os
import traceback
from sqlalchemy.orm import joinedload

UPLOAD_FOLDER = 'files/book_images/'
BASE_URL = "http://127.0.0.1:5000/" 

admin_bp = Blueprint('admin', __name__)

# Ном нэмэх API
@admin_bp.route('/admin/add_book/', methods=['POST'])
def add_book():
    with current_app.app_context(): 
        data = request.form  # Хүснэгтээс ирсэн өгөгдөл авах
        image = request.files.get('file')  # Зураг оруулах
        published_date = data.get('publishedDate')  # Нийтлэгдсэн огноо авах
        category_names = data.getlist('category')  # Ангиллын нэрс авах

        try:
            # Огноог зөв формат руу хөрвүүлэх
            published_date = datetime.datetime.strptime(published_date, "%Y-%m-%d")
            # Зургийн нэрийг оноож хадгалах
            image_filename = f"{datetime.datetime.now().timestamp()}_{image.filename}"
            # Фолдерыг үүсгэх эсэхийг шалгах
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            image_path = os.path.join(UPLOAD_FOLDER, image_filename)
            image.save(image_path)  # Зургийг хадгалах
            image_url = image_path

            # Ангиллыг шалгах, хэрэв байхгүй бол шинээр үүсгэх
            categories = []
            for category_name in category_names:
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name)
                    db.session.add(category)
                    db.session.commit()
                categories.append(category)

            # Шинэ ном үүсгэх
            new_book = Book(
                title=data['name'],
                author=data['author'],
                price=float(data['price']),
                published_date=published_date,
                description=data.get('description'),
                stock_quantity=int(data.get('quantity', 0)),
                image_url=image_url,
                categories=categories
            )

            db.session.add(new_book)  # Өгөгдлийг хадгалах
            db.session.commit()

            return jsonify({"status": "success", "message": "Ном амжилттай нэмэгдлээ", "book": new_book.to_dict()}), 200

        except Exception as e:
            # Алдааг бүртгэж, хэрэглэгчид буцаах
            current_app.logger.error(f"Error adding book: {traceback.format_exc()}")
            return jsonify({"message": "Error saving the book", "error": str(e)}), 500

# Номнуудыг авах API
@admin_bp.route('/admin/books/', methods=["GET"])
def get_books():
    with current_app.app_context():
        try:
            books = Book.query.all()  # Бүх номнуудыг авах

            books_data = [book.to_dict() for book in books]  # Номнуудын жагсаалтыг үүсгэх

            return jsonify({"status": "success", "message": "", "books": books_data}), 200

        except Exception as e:
            # Алдааг бүртгэж, хэрэглэгчид буцаах
            current_app.logger.error(f"Error retrieving books: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Error saving the book", "error": str(e)}), 500

# Ном устгах API
@admin_bp.route('/admin/delete_book/<int:book_id>/', methods=["DELETE"])
def delete_book(book_id):
    with current_app.app_context():
        try:
            book = Book.query.get(book_id)  # Номын ID-аар хайлт хийх
            if not book:
                return jsonify({"message": "Book not found"}), 404  # Хэрэв ном олдохгүй бол

            # Хуучин зургийг устгах
            if book.image_url and os.path.exists(book.image_url):
                os.remove(book.image_url)

            db.session.delete(book)  # Номыг устгах
            db.session.commit()

            return jsonify({"status": "success", "message": "Ном амжилттай устгагдалаа"}), 200

        except Exception as e:
            # Алдааг бүртгэж, хэрэглэгчид буцаах
            current_app.logger.error(f"Error deleting book: {traceback.format_exc()}")
            return jsonify({"message": "Error deleting the book", "error": str(e)}), 500

# Ном засах API
@admin_bp.route('/admin/edit_book/<int:book_id>/', methods=['PUT'])
def edit_book(book_id):
    with current_app.app_context():
        data = request.form  # Хүснэгтээс өгөгдөл авах

        image = request.files.get('file')  # Зураг солих
        published_date = data.get('publishedDate')  # Огноо
        quantity = int(data.get('quantity'))  # Тоо хэмжээ
        category_names = data.getlist('category')  # Ангиллууд

        try:
            book = Book.query.get(book_id)  # Ном хайх
            if not book:
                return jsonify({"message": "Book not found"}), 404

            # Огноог шинэчлэх
            published_date = datetime.datetime.strptime(published_date, "%Y-%m-%d")
            
            # Шинэ зураг байвал хадгалах
            if image:
                # Хуучин зургийг устгах
                if book.image_url and os.path.exists(book.image_url):
                    os.remove(book.image_url)

                image_filename = f"{datetime.datetime.now().timestamp()}_{image.filename}"
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                image_path = os.path.join(UPLOAD_FOLDER, image_filename)
                image.save(image_path)
                book.image_url = image_path

            # Бусад талбаруудыг шинэчлэх
            book.title = data['name']
            book.author = data['author']
            book.price = float(data['price'])
            book.published_date = published_date
            book.description = data.get('description')
            book.stock_quantity = quantity

            # Ангиллыг шинэчлэх
            categories = []
            for category_name in category_names:
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name)
                    db.session.add(category)
                    db.session.commit()
                categories.append(category)
            book.categories = categories

            db.session.commit()

            return jsonify({"status": "success", "message": "Ном амжилттай засагдлаа", "book": book.to_dict()}), 200

        except Exception as e:
            # Алдааг бүртгэж, хэрэглэгчид буцаах
            current_app.logger.error(f"Error updating book: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Error updating the book", "error": str(e)}), 500

# Захиалгыг авах API
@admin_bp.route('/admin/orders/', methods=['GET'])
def get_order():
    try:
        # Хуудасны дугаар болон хязгаарын утгуудыг авах
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)

        # Захиалгуудыг хуудаслаж авах
        query = Order.query.order_by(Order.order_date.desc())
        orders_paginated = query.paginate(page=page, per_page=limit, error_out=False)

        orders = [order.to_dict() for order in orders_paginated.items]  # Захиалгуудын жагсаалт үүсгэх
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
            "message": "Захиалгууд амжилттай авлаа",
            "items": orders,
            "pagination": {
                "total_pages": total_pages,
                "total_items": total_items,
                "current_page": page
            }
        }), 200

    except Exception as e:
        # Алдааг бүртгэж, хэрэглэгчид буцаах
        current_app.logger.error(f"Error retrieving order items: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Error retrieving order items",
            "error": str(e),
        }), 500

# Захиалгын төлвийг солих API
@admin_bp.route('/admin/orders/<int:pk>/', methods=['PUT'])
def change_status(pk):
    try:
        order = Order.query.get(pk)  # Захиалга хайх

        if not order:
            return jsonify({
                "status": "error",
                "message": "Захиалга байхгүй",
            }), 404

        order.status = "success"  # Төлөв солих
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Захиалгын төлөв солигдлоо",
        }), 200

    except Exception as e:
        # Алдааг бүртгэж, хэрэглэгчид буцаах
        current_app.logger.error(f"Error changing order status: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Error changing order status",
            "error": str(e),
        }), 500
