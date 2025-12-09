from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
import traceback

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')

# Enable CORS for frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Import database connection  
from utils.database import get_db
db = None  # Initialize as None first

# Health check endpoint
@app.route('/')
def health_check():
    global db
    if db is None:
        db = get_db()
    
    return jsonify({
        "status": "online",
        "message": "Faculty Appraisal System Backend API",
        "version": "1.0.0",
        "mongodb": "connected" if db else "disconnected"
    })

# Import routes after app is configured
try:
    from routes import auth, forms, admin, hod, dean, director, verification, external
    
    # Register blueprints
    app.register_blueprint(auth.bp)
    app.register_blueprint(forms.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(hod.bp)
    app.register_blueprint(dean.bp)
    app.register_blueprint(director.bp)
    app.register_blueprint(verification.bp)
    app.register_blueprint(external.bp)
    print("All routes registered successfully")
except Exception as e:
    print(f"Error registering routes: {e}")
    traceback.print_exc()

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    try:
        # Get database connection - COMMENTED OUT TO TEST
        # db = get_db()
        # if db:
        #     print(f"MongoDB connected successfully to: {db.name}")
        # else:
        #     print("MongoDB connection failed")
        
        port = int(os.getenv('PORT', 5000))
        print(f"Starting Flask backend on port {port}")
        print(f"CORS enabled for http://localhost:5173")
        
        # Start Flask app
        app.run(host='127.0.0.1', port=port, debug=False)
    except Exception as e:
        print(f"\nError during startup:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {e}")
        print("\nFull traceback:")
        traceback.print_exc()
        sys.exit(1)
