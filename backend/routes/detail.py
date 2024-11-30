from flask import Blueprint, request, jsonify, current_app
from backend.models import db, Book, Category,Review,User
import traceback
from datetime import datetime

detail_bp = Blueprint('detail', __name__)

@detail_bp.route('/recommendations/<int:id>/', methods=['GET'])
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

@detail_bp.route('/review' , methods=['POST'])
def create_review():

    data = request.get_json()
    
    if not all(key in data for key in ['book_id', 'rating']):
        return jsonify({'error': 'Missing required fields'}), 400
    rating = float(data['rating'])

    new_review = Review(
        book_id=data['book_id'],
        user_id=data['user_id'],
        rating=rating,
        comment=data.get('comment', ''),  # Comment is optional
        review_date=datetime.utcnow()  # Automatically sets the current date and time
    )

    try:
        # Add the review to the database
        db.session.add(new_review)
        db.session.commit()
        return jsonify({
            'message': 'Review successfully added',
            'review': {
                'id': new_review.id,
                'book_id': new_review.book_id,
                'user_id': new_review.user_id,
                'rating': new_review.rating,
                'comment': new_review.comment,
                'review_date': new_review.review_date
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@detail_bp.route('/review/<int:id>/', methods=['GET'])
def get_reviews(id):
    
    if not id:
        return jsonify({'error': 'book_id is required'}), 400
    
    try:
        # Query the reviews for the specified book, ordered by review_date in descending order, limit to 'limit' reviews
        reviews = Review.query.filter_by(book_id=id).join(User , User.id ==Review.user_id).order_by(Review.review_date.desc()).limit(10).all()

        # Prepare the list of reviews to return in the response
        reviews_data = [
            {
                'id': review.id,
                'book_id': review.book_id,
                'user_id': review.user_id,
                'user_name':review.user.username,
                'rating': review.rating,
                'comment': review.comment,
                'review_date': review.review_date.isoformat()  # Convert datetime to ISO format
            }
            for review in reviews
        ]

        return jsonify({
            "status": "success",
            'reviews': reviews_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
