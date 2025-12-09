import traceback
try:
    from flask import Flask
    from flask_cors import CORS
    from utils.database import get_db
    
    print("✅ Imports successful")
    
    app = Flask(__name__)
    print("✅ Flask app created")
    
    CORS(app)
    print("✅ CORS configured")
    
    db = get_db()
    print(f"✅ Database connected: {db}")
    
    print("\n Starting imports of routes...")
    from routes import auth, forms, admin, hod, dean, director, verification, external
    print("✅ All routes imported")
    
except Exception as e:
    print(f"\n❌ Error occurred:")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
