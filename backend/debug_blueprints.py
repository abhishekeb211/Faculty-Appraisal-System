import sys
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
    
    print("\nStarting imports of routes...")
    from routes import auth, forms, admin, hod, dean, director, verification, external
    print("✅ All routes imported")
    
    print("\nRegistering blueprints...")
    app.register_blueprint(auth.bp)
    print("✅ auth blueprint registered")
    app.register_blueprint(forms.bp)
    print("✅ forms blueprint registered")
    app.register_blueprint(admin.bp)
    print("✅ admin blueprint registered")
    app.register_blueprint(hod.bp)
    print("✅ hod blueprint registered")
    app.register_blueprint(dean.bp)
    print("✅ dean blueprint registered")
    app.register_blueprint(director.bp)
    print("✅ director blueprint registered")
    app.register_blueprint(verification.bp)
    print("✅ verification blueprint registered")
    app.register_blueprint(external.bp)
    print("✅ external blueprint registered")
    
    print("\n✅✅✅ ALL BLUEPRINTS REGISTERED SUCCESSFULLY ✅✅✅")
    
except Exception as e:
    print(f"\n❌ Error occurred:")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
    sys.exit(1)
