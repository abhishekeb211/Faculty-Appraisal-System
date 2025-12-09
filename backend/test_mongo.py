import traceback
import sys

print("Testing MongoDB connection...")

try:
    from pymongo import MongoClient
    print("✅ pymongo imported")
    
    client = MongoClient('mongodb://localhost:27017/')
    print("✅ MongoClient created")
    
    db = client['faculty_appraisal_db']
    print(f"✅ Database object: {db}")
    print(f"   - Type: {type(db)}")
    print(f"   - Name: {db.name}")
    
    # Test connection
    client.server_info()
    print("✅ MongoDB server is accessible")
    
    # Test a simple query
    collections = db.list_collection_names()
    print(f"✅ Collections in database: {collections}")
    
    print("\n=== All MongoDB tests passed ===")
    
except Exception as e:
    print(f"\n❌ Error: {type(e).__name__}: {e}")
    traceback.print_exc()
    sys.exit(1)
