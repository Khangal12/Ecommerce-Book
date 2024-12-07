from flask import Blueprint, request, jsonify, current_app
from backend.models import db, Book, Category, Order, OrderItem
import datetime
import os
import traceback
from sqlalchemy.orm import joinedload

UPLOAD_FOLDER = 'files/book_images/'
BASE_URL = "http://127.0.0.1:5000/" 

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/add_book/', methods=['POST'])
def add_book():
    with current_app.app_context(): 
        data = request.form
        image = request.files.get('file')
        published_date = data.get('publishedDate')
        category_names = data.getlist('category')

        try:
            published_date = datetime.datetime.strptime(published_date, "%Y-%m-%d")
            image_filename = f"{datetime.datetime.now().timestamp()}_{image.filename}"
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            image_path = os.path.join(UPLOAD_FOLDER, image_filename)
            image.save(image_path)
            image_url = image_path

            categories = []
            for category_name in category_names:
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name)
                    db.session.add(category)
                    db.session.commit()
                categories.append(category)

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

            db.session.add(new_book)
            db.session.commit()

            return jsonify({"status": "success", "message": "Ном амжилттай нэмэгдлээ", "book": new_book.to_dict()}), 200

        except Exception as e:
            current_app.logger.error(f"Error adding book: {traceback.format_exc()}")
            return jsonify({"message": "Error saving the book", "error": str(e)}), 500

@admin_bp.route('/admin/books/', methods=["GET"])
def get_books():
    with current_app.app_context():
        try:
            books = Book.query.all()

            books_data = [book.to_dict() for book in books]

            return jsonify({"status": "success", "message": "", "books": books_data}), 200

        except Exception as e:
            current_app.logger.error(f"Error retrieving books: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Error saving the book", "error": str(e)}), 500
        
@admin_bp.route('/admin/delete_book/<int:book_id>/', methods=["DELETE"])
def delete_book(book_id):
    with current_app.app_context():
        try:
            book = Book.query.get(book_id)
            if not book:
                return jsonify({"message": "Book not found"}), 404

            if book.image_url and os.path.exists(book.image_url):
                os.remove(book.image_url)

            db.session.delete(book)
            db.session.commit()

            return jsonify({"status": "success","message": "Ном амжилттай устгагдалаа"}), 200

        except Exception as e:
            current_app.logger.error(f"Error deleting book: {traceback.format_exc()}")
            return jsonify({"message": "Error deleting the book", "error": str(e)}), 500

@admin_bp.route('/admin/edit_book/<int:book_id>/', methods=['PUT'])
def edit_book(book_id):
    with current_app.app_context():
        data = request.form

        image = request.files.get('file')
        published_date = data.get('publishedDate')
        quantity = int(data.get('quantity'))
        category_names = data.getlist('category')

        try:
            book = Book.query.get(book_id)
            if not book:
                return jsonify({"message": "Book not found"}), 404

            # Update the published date
            published_date = datetime.datetime.strptime(published_date, "%Y-%m-%d")
            
            # If a new image is provided, save it
            if image:
                # Remove the old image if it exists
                if book.image_url and os.path.exists(book.image_url):
                    os.remove(book.image_url)

                image_filename = f"{datetime.datetime.now().timestamp()}_{image.filename}"
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                image_path = os.path.join(UPLOAD_FOLDER, image_filename)
                image.save(image_path)
                book.image_url = image_path

            # Update other fields
            book.title = data['name']
            book.author = data['author']
            book.price = float(data['price'])
            book.published_date = published_date
            book.description = data.get('description')
            book.stock_quantity =quantity

            # Update categories
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
            current_app.logger.error(f"Error updating book: {traceback.format_exc()}")
            return jsonify({"status": "error" , "message": "Error updating the book", "error": str(e)}), 500

@admin_bp.route('/admin/orders/', methods=['GET'])
def get_order():
    try:
        # Get the page number and search term from query parameters
        page = request.args.get('page', 1, type=int)  # Default to 1 if no page is provided
        limit = request.args.get('limit', 10, type=int)  # Default to 10 items per page

        # Filter orders by user_id (pk) and search by book title or author
        query = Order.query.order_by(Order.order_date.desc())

        # Paginate the orders
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
        # Log the error and return a response
        current_app.logger.error(f"Error retrieving order items: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Error retrieving order items",
            "error": str(e),
        }), 500
    
@admin_bp.route('/admin/orders/<int:pk>/', methods=['PUT'])
def change_status(pk):
    try:

        order = Order.query.get(pk)

        if not order:
            return jsonify({
                "status": "error",
                "message": "Захиалга байхгүй",
            }), 404

        order.status = "success"
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Амжилттай хүргэгдсэн",
        }), 200

    except Exception as e:
        # Log the error and return a response
        current_app.logger.error(f"Төлөв солиход алдаа: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Алдаа",
            "error": str(e),
        }), 500

@admin_bp.route('/admin/orders/<int:pk>/', methods=['GET'])
def get_orderDetail(pk):
    try:
        # Filter orders by user_id (pk) and search by book title or author
        order = Order.query.get(pk)
        order_items = OrderItem.query.filter_by(order_id=pk).all()
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
        # Log the error and return a response
        current_app.logger.error(f"Error retrieving order items: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Error retrieving order items",
            "error": str(e),
        }), 500