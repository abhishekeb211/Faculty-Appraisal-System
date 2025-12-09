from flask import Blueprint, request, jsonify
from utils.database import get_db

bp = Blueprint('hod', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/faculty/<department>', methods=['GET'])
def get_faculty_by_department(department):
    """Get all faculty in a department"""
    try:
        db = _get_db()
        faculty = list(db.users.find({"dept": department, "role": "Faculty"}, {"password": 0}))
        for f in faculty:
            f['_id'] = str(f['_id'])
        return jsonify(faculty), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<user_id>/hod-mark-given', methods=['POST'])
def hod_mark_given(department, user_id):
    """Mark HOD evaluation as given"""
    try:
        data = request.json
        # Store HOD marks
        db = _get_db()
        db.hod_marks.update_one(
            {"userId": user_id, "department": department},
            {"$set": data},
            upsert=True
        )
        return jsonify({"message": "HOD marks recorded"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<user_id>/portfolio-given', methods=['POST'])
def portfolio_given(department, user_id):
    """Mark portfolio as given"""
    try:
        db = _get_db()
        db.forms.update_one(
            {"userId": user_id, "department": department, "formType": "D"},
            {"$set": {"portfolioGiven": True}}
        )
        return jsonify({"message": "Portfolio marked as given"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/total_marks/<department>/<faculty_id>', methods=['GET', 'POST'])
def total_marks(department,faculty_id):
    """Get or set total marks"""
    if request.method == 'GET':
        try:
            db = _get_db()
            marks = db.total_marks.find_one({"facultyId": faculty_id, "department": department})
            if marks:
                marks.pop('_id', None)
                return jsonify(marks), 200
            return jsonify({}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:  # POST
        try:
            data = request.json
            db = _get_db()
            db.total_marks.update_one(
                {"facultyId": faculty_id, "department": department},
                {"$set": data},
                upsert=True
            )
            return jsonify({"message": "Total marks updated"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@bp.route('/<department>/all_faculties_final_marks', methods=['GET'])
def all_faculties_final_marks(department):
    """Get final marks for all faculty"""
    try:
        db = _get_db()
        marks = list(db.total_marks.find({"department": department}))
        for m in marks:
            m['_id'] = str(m['_id'])
        return jsonify(marks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
