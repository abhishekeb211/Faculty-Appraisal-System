from flask import Blueprint, request, jsonify
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
        # Insert new user
        db = _get_db()
        result = db.users.insert_one(data)
        return jsonify({"message": "Faculty added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/faculty-list', methods=['GET'])
def get_faculty_list():
    """Get list of all faculty"""
    try:
        db = _get_db()
        faculty = list(db.users.find({"role": "Faculty"}, {"password": 0}))
        for f in faculty:
            f['_id'] = str(f['_id'])
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
