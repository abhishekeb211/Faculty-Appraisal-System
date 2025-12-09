from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
import bcrypt
from utils.database import get_db

bp = Blueprint('admin', __name__, url_prefix='/admin')

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/add-faculty', methods=['POST'])
def add_faculty():
    """Add new faculty member"""
    try:
        data = request.json
        db = _get_db()
        
        # Check if user ID already exists
        existing = db.users.find_one({"userId": data.get("_id")})
        if existing:
            return jsonify({"error": "User ID already exists"}), 400
        
        # Hash default password (userId)
        default_password = data.get("_id", "password123")
        hashed_password = bcrypt.hashpw(default_password.encode('utf-8'), bcrypt.gensalt())
        
        # Prepare user document
        user_doc = {
            "userId": data.get("_id"),
            "name": data.get("name"),
            "email": data.get("mail"),
            "dept": data.get("dept"),
            "role": data.get("desg"),  # Role from desg field
            "desg": data.get("role"),  # Designation from role field
            "mobile": data.get("mob"),
            "password": hashed_password,
            "createdAt": datetime.now(),
            "higherDean": data.get("higherDean"),  # For Associate Deans
            "isActive": True
        }
        
        result = db.users.insert_one(user_doc)
        return jsonify({"message": "Faculty added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        print(f"Error adding faculty: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/faculty-list', methods=['GET'])
def get_faculty_list():
    """Get list of all faculty"""
    try:
        db = _get_db()
        faculty = list(db.users.find({}, {"password": 0}))
        for f in faculty:
            f['_id'] = str(f['_id'])
            f['id'] = str(f['_id'])
        return jsonify(faculty), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/summary', methods=['GET'])
def get_summary():
    """Get system summary"""
    try:
        db = _get_db()
        total_users = db.users.count_documents({})
        total_forms = db.forms.count_documents({})
        
        users_by_role = {}
        for role in ["Faculty", "Admin", "HOD", "Dean", "Director", "Verification Team", "external"]:
            count = db.users.count_documents({"role": role})
            users_by_role[role] = count
        
        return jsonify({
            "totalUsers": total_users,
            "totalForms": total_forms,
            "usersByRole": users_by_role
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/verification-team', methods=['GET', 'POST'])
def verification_team():
    """Get or create verification team members"""
    db = _get_db()
    
    if request.method == 'GET':
        try:
            members = list(db.users.find({"role": "Verification Team"}, {"password": 0}))
            for m in members:
                m['_id'] = str(m['_id'])
                m['id'] = str(m['_id'])
            return jsonify(members), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    else:  # POST - Add new verification team member
        try:
            data = request.json
            
            # Hash password
            password = data.get("password", data.get("userId", "password123"))
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            user_doc = {
                "userId": data.get("userId"),
                "name": data.get("name"),
                "email": data.get("email"),
                "dept": data.get("department"),
                "role": "Verification Team",
                "desg": "Verifier",
                "password": hashed_password,
                "createdAt": datetime.now(),
                "isActive": True
            }
            
            result = db.users.insert_one(user_doc)
            return jsonify({"message": "Verification team member added", "id": str(result.inserted_id)}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@bp.route('/assign-faculty-to-verification-team', methods=['POST'])
def assign_faculty_to_verification_team():
    """Assign faculty to verification team member"""
    try:
        data = request.json
        verifier_id = data.get('verifierId')
        faculty_ids = data.get('facultyIds', [])
        department = data.get('department')
        
        db = _get_db()
        
        # Create assignment
        assignment = {
            "verifierId": verifier_id,
            "facultyIds": faculty_ids,
            "department": department,
            "assignedAt": datetime.now(),
            "completed": False
        }
        
        result = db.verifications.insert_one(assignment)
        
        return jsonify({"message": "Faculty assigned to verification team", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/assign-dean-to-department', methods=['POST'])
def assign_dean_to_department():
    """Assign dean to department(s) for interaction evaluation"""
    try:
        data = request.json
        dean_id = data.get('deanId')
        departments = data.get('departments', [])
        faculty_ids = data.get('facultyIds', [])
        
        db = _get_db()
        
        # Update dean's interaction departments
        db.users.update_one(
            {"_id": ObjectId(dean_id)},
            {"$set": {"interactionDepartments": departments}}
        )
        
        # Create assignment for each department
        for dept in departments:
            assignment = {
                "deanId": dean_id,
                "department": dept,
                "facultyIds": faculty_ids,
                "externalId": "default",  # Can be customized
                "assignedAt": datetime.now()
            }
            db.dean_assignments.update_one(
                {"deanId": dean_id, "department": dept},
                {"$set": assignment},
                upsert=True
            )
        
        return jsonify({"message": "Dean assigned to departments"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Additional helper endpoint for fetching all faculties
@bp.route('/all-faculties', methods=['GET'])
def get_all_faculties():
    """Get all faculties with basic info"""
    try:
        db = _get_db()
        faculties = list(db.users.find({}, {"password": 0}))
        
        result = []
        for f in faculties:
            result.append({
                "_id": str(f["_id"]),
                "userId": f.get("userId"),
                "name": f.get("name"),
                "dept": f.get("dept"),
                "role": f.get("role"),
                "designation": f.get("desg"),
                "email": f.get("email")
            })
        
        return jsonify({"data": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
