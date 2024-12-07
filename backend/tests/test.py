import unittest
import os
from io import BytesIO
from flask import Flask, send_from_directory
from flask.testing import FlaskClient
import tempfile

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        """Setup for each test case."""
        # Create a Flask app instance
        self.app = Flask(__name__)

        # Create a temporary folder to simulate book_images directory
        self.test_dir = tempfile.mkdtemp()
        self.test_image_filename = 'test_image.png'
        self.test_image_path = os.path.join(self.test_dir, self.test_image_filename)

        # Create a fake image for testing
        with open(self.test_image_path, 'wb') as f:
            f.write(b'fake image data')  # Writing fake binary data to simulate an image file

        @self.app.route('/files/book_images/<filename>')
        def serve_image(filename):
            return send_from_directory(self.test_dir, filename)

        self.client = self.app.test_client()

    def tearDown(self):
        """Clean up after each test case."""
        try:
            # Remove the test directory and the fake image file
            os.remove(self.test_image_path)
            os.rmdir(self.test_dir)
        except Exception as e:
            pass

    def test_serve_image(self):
        """Test serving an image from the /files/book_images route."""
        # Send a GET request to the route
        response = self.client.get(f'/files/book_images/{self.test_image_filename}')

        # Check if the status code is 200 (OK)
        self.assertEqual(response.status_code, 200)

        # Check if the file content is correct (in this case, it should be the fake image data)
        self.assertEqual(response.data, b'fake image data')

    def test_image_not_found(self):
        """Test when an image is not found."""
        # Send a GET request for a non-existent file
        response = self.client.get('/files/book_images/non_existent_image.png')

        # Check if the status code is 404 (Not Found)
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
