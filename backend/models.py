from datetime import datetime
from backend import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Float

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    address = db.Column(db.String)
    phone_number = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)

class Order(db.Model):
    __tablename__ = 'order'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String)
    total_price = db.Column(db.Numeric)
    address = db.Column(db.String)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'order_date': self.order_date.isoformat(),  # Convert datetime to ISO format
            'status': self.status,
            'total_price': str(self.total_price),  # Convert Numeric to string (to avoid serialization issues)
            'address': self.address,
            'user': {
                'id': self.user.id,
                'name': self.user.username,  # Assuming the User model has 'name' attribute
                'email': self.user.email, 
                'phone_number': self.user.phone_number # Assuming the User model has 'email' attribute
            }
        }

class OrderItem(db.Model):
    __tablename__ = 'order_item'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    description = db.Column(db.String)

    order = db.relationship('Order', backref=db.backref('order_items', lazy=True))
    book = db.relationship('Book', backref=db.backref('order_items', lazy=True))

class Cart(db.Model):
    __tablename__ = 'cart'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('carts', lazy=True))

class CartItem(db.Model):
    __tablename__ = 'cart_item'
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    cart = db.relationship('Cart', backref=db.backref('cart_items', lazy=True))
    book = db.relationship('Book', backref=db.backref('cart_items', lazy=True))

class Book(db.Model):
    __tablename__ = 'book'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    published_date = db.Column(db.Date)
    description = db.Column(db.Text)
    stock_quantity = db.Column(db.Integer)
    image_url = db.Column(db.String(255))

    categories = db.relationship('Category', secondary='book_category', back_populates='books')
    
    def __repr__(self):
        return f"<Book {self.title}>"
    
    def to_dict(self):
        base_url = "http://127.0.0.1:5000"
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'price': str(self.price) if self.price else None,
            'published_date': self.published_date.strftime('%Y-%m-%d') if self.published_date else None,
            'description': self.description,
            'stock_quantity': self.stock_quantity,
            'image_url': f"{base_url}/{self.image_url}" if self.image_url else None,
            'categories': [category.name for category in self.categories],
        }

class Category(db.Model):
    __tablename__ = 'category'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    books = db.relationship('Book', secondary='book_category', back_populates='categories')
    
    def __repr__(self):
        return f"<Category {self.name}>"

class BookCategory(db.Model):
    __tablename__ = 'book_category'
    
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), primary_key=True)

class Review(db.Model):
    __tablename__ = 'review'
    
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(Float, nullable=False)
    comment = db.Column(db.Text)
    review_date = db.Column(db.DateTime, default=datetime.utcnow)

    book = db.relationship('Book', backref=db.backref('reviews', lazy=True))
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
