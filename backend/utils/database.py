from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

_db = None

def get_db():
    """Get MongoDB database connection"""
    global _db
    if _db is None:
        try:
            mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/faculty_appraisal_db')
            client = MongoClient(mongo_uri)
            # Explicitly specify the database name
            _db = client['faculty_appraisal_db']
        except Exception as e:
            print(f"[ERROR] MongoDB connection error: {e}")
            _db = None
    return _db
