from flask import Flask, jsonify, request, Blueprint, current_app
from backend.models import db, Cart, CartItem, Book, Order,OrderItem
import traceback
import os
import json

cart_bp = Blueprint('cart', __name__)
BASE_URL = "http://127.0.0.1:5000/" 

@cart_bp.route('/cart/count/<int:pk>/', methods=["GET"])
def get_cart_count(pk):
    with current_app.app_context():
        try:
            cart = Cart.query.filter_by(user_id=pk).first()

            if cart:
                cart_item_count = CartItem.query.filter_by(cart_id=cart.id).count()
            else:
                cart_item_count = 0 

            return jsonify({
                "status": "success",
                "message": "",
                "count": cart_item_count
            }), 200

        except Exception as e:
            current_app.logger.error(f"Error retrieving books: {traceback.format_exc()}")
            return jsonify({"status": "error", "message": "Error saving the book", "error": str(e)}), 500
        
@cart_bp.route('/cart/add', methods=["POST"])
def add_cart():
    with current_app.app_context():
        try:
            # Parse JSON data from request
            data = request.get_json()
            user_id = data['user_id']
            quantity = data['quantity']
            book_id = data['book_id']

            # Fetch or create cart for the user
            cart = Cart.query.filter_by(user_id=user_id).first()
            if not cart:
                cart = Cart(user_id=user_id)
                db.session.add(cart)
                db.session.commit()

            # Check if the item already exists in the cart
            cart_item = CartItem.query.filter_by(cart_id=cart.id, book_id=book_id).first()
            if cart_item:
                # Update the quantity of the existing item
                cart_item.quantity += quantity
            else:
                # Add a new item to the cart
                cart_item = CartItem(cart_id=cart.id, book_id=book_id, quantity=quantity)
                db.session.add(cart_item)

            # Commit the changes to the database
            db.session.commit()

            return jsonify({
                "status": "success",
                "message": "Item added to cart successfully",
            }), 200

        except Exception as e:
            # Log the error and return a response
            current_app.logger.error(f"Error adding item to cart: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Error adding item to cart",
                "error": str(e)
            }), 500

@cart_bp.route('/cart/<int:pk>/', methods=["GET"])
def get_items(pk):
    with current_app.app_context():
        try:
            cart = Cart.query.filter_by(user_id=pk).first()

            if not cart:
                return jsonify({
                    "status": "success",
                    "message": "Cart is empty",
                    "items": [],
                }), 200

            # Fetch all items in the cart
            cart_items = CartItem.query.filter_by(cart_id=cart.id).all()

            # Prepare the data to return
            items = []
            for item in cart_items:
                # Get the book details using the book_id from the CartItem
                book = Book.query.get(item.book_id)
                if book:
                    image_url = book.image_url
                    if not image_url.startswith('http'):
                        image_url = os.path.join(BASE_URL, image_url)
                
                    items.append({
                        "id": item.id,
                        "book_id": item.book_id,
                        "quantity": item.quantity,
                        "price": book.price,  # Assuming 'price' is a field in Book
                        "image_url": image_url,  # Assuming 'image_url' is a field in Book
                        "title": book.title,  # Assuming 'title' is a field in Book
                        "author":book.author
                    })
                else:
                    # If book is not found, return default values or handle accordingly
                    items.append({
                        "id": item.id,
                        "book_id": item.book_id,
                        "quantity": item.quantity,
                        "price": 0,  # Default value if book is not found
                        "image_url": "",  # Default value if book is not found
                        "title": "Unknown Book", 
                        "author":"Unknown Author"
                    })

            return jsonify({
                "status": "success",
                "message": "Cart items retrieved successfully",
                "items": items,
            }), 200

        except Exception as e:
            # Log the error and return a response
            current_app.logger.error(f"Error retrieving cart items: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Error retrieving cart items",
                "error": str(e),
            }), 500

@cart_bp.route('/cart/item/<int:pk>/', methods=["PATCH"])
def update_cart_item(pk):
    with current_app.app_context():
        try:
            # Parse JSON data from request
            data = request.get_json()
            new_quantity = data.get("quantity")

            # Find the cart item by its ID
            cart_item = CartItem.query.get(pk)
            if not cart_item:
                return jsonify({
                    "status": "error",
                    "message": "Cart item not found",
                }), 404

            # Update the quantity if a valid quantity is provided
            if new_quantity is not None and new_quantity > 0:
                cart_item.quantity = new_quantity
                db.session.commit()
                return jsonify({
                    "status": "success",
                    "message": "Cart item updated successfully",
                }), 200
            else:
                return jsonify({
                    "status": "error",
                    "message": "Invalid quantity",
                }), 400

        except Exception as e:
            # Log the error and return a response
            current_app.logger.error(f"Error updating cart item: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Error updating cart item",
                "error": str(e),
            }), 500


@cart_bp.route('/cart/item/<int:pk>/', methods=["DELETE"])
def delete_cart_item(pk):
    with current_app.app_context():
        try:
            # Find the cart item by its ID
            cart_item = CartItem.query.get(pk)
            if not cart_item:
                return jsonify({
                    "status": "error",
                    "message": "Cart item not found",
                }), 404

            # Delete the cart item
            db.session.delete(cart_item)
            db.session.commit()

            return jsonify({
                "status": "success",
                "message": "Амжилттай устгалаа",
            }), 200

        except Exception as e:
            # Log the error and return a response
            current_app.logger.error(f"Error deleting cart item: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Error deleting cart item",
                "error": str(e),
            }), 500

@cart_bp.route('/orders/', methods=["POST"])
def add_order():
    with current_app.app_context():
        try:
            data = request.get_json()
            user_detail = data['customer']
            cart_items = data['cartItems']
            address = user_detail['address']
            address_string = json.dumps(address)
            if not user_detail or not cart_items:
                return jsonify({
                    "status": "error",
                    "message": "Invalid data: customer or cartItems missing"
                }), 400
            
            total_price = 0
            for item in cart_items:
                total_price += item['quantity'] * float(item['price'])
            order = Order(
                user_id = user_detail['user_id'],
                status="pending",
                total_price = total_price,
                address = address_string,
            )
            db.session.add(order)
            db.session.commit()

            for cart_item in cart_items:
                book_id = cart_item['book_id']
                cart_id = cart_item['id']
                quantity = cart_item['quantity']
                price = cart_item['price']

                order_item = OrderItem(
                    order_id=order.id,
                    book_id=book_id,
                    quantity=quantity,
                    price=price,
                    description=address_string
                )
                db.session.add(order_item)
                book = Book.query.filter_by(id=book_id).first()
    
                if book and book.stock_quantity >= quantity:
                    # Decrease the book's stock by the ordered quantity
                    book.stock_quantity -= quantity
                    db.session.add(book)  # Ensure the book record is updated in the database
                else:
                    # Handle the case where there's not enough stock
                    return jsonify({
                        "status": "error",
                        "message": f"Not enough stock for book ID {book_id}. Available stock: {book.stock}"
                    }), 400

                CartItem.query.filter(CartItem.id==cart_id,CartItem.book_id==book_id).delete()

            db.session.commit()

            return jsonify({
                "status": "success",
                "message": "Order placed successfully",
                "order_id": order.id,
                "total_price": total_price,
                "address": json.loads(order.address)
            }), 200
    
        except Exception as e:
            current_app.logger.error(f"Error placing order: {traceback.format_exc()}")
            return jsonify({
                "status": "error",
                "message": "Error placing order",
                "error": str(e),
            }), 500

