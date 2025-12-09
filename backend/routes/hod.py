from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from utils.database import get_db
from utils.auth_middleware import require_auth, require_role, require_department_access
from utils.validation import validate_objectid, validate_department, sanitize_string, ValidationError

bp = Blueprint('hod', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/faculty/<department>', methods=['GET'])
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
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
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
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
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
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
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
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
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
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

# New workflow routes

@bp.route('/<department>/pending-appraisals', methods=['GET'])
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
def get_pending_appraisals(department):
    """Get list of faculty with pending HOD review"""
    try:
        db = _get_db()
        
        # Find faculty in department with submitted appraisals
        faculty = list(db.users.find({"dept": department, "role": "Faculty"}, {"password": 0}))
        
        result = []
        for fac in faculty:
            # Check appraisal status
            appraisal = db.forms.find_one({
                "userId": fac.get('userId'),
                "department": department,
                "hodApproved": {"$exists": False}
            })
            
            if appraisal:
                result.append({
                    "_id": str(fac['_id']),
                    "userId": fac.get('userId'),
                    "name": fac.get('name'),
                    "email": fac.get('email'),
                    "appraisalId": str(appraisal['_id']),
                    "submittedAt": appraisal.get('submittedAt'),
                    "status": "pending_hod_review"
                })
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Get pending appraisals error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/approve', methods=['POST'])
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
def approve_appraisal(department, faculty_id):
    """Approve faculty appraisal"""
    try:
        data = request.json
        comments = sanitize_string(data.get('comments', ''))
        
        db = _get_db()
        current_user = request.current_user
        
        # Update appraisal status
        result = db.forms.update_one(
            {"userId": faculty_id, "department": department},
            {
                "$set": {
                    "hodApproved": True,
                    "hodId": current_user['user_id'],
                    "hodComments": comments,
                    "hodApprovedAt": datetime.utcnow(),
                    "status": "hod_approved"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal approved successfully"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Approve appraisal error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/reject', methods=['POST'])
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
def reject_appraisal(department, faculty_id):
    """Reject faculty appraisal with reason"""
    try:
        data = request.json
        reason = sanitize_string(data.get('reason', ''))
        
        if not reason:
            return jsonify({"error": "Rejection reason is required"}), 400
        
        db = _get_db()
        current_user = request.current_user
        
        # Update appraisal status
        result = db.forms.update_one(
            {"userId": faculty_id, "department": department},
            {
                "$set": {
                    "hodApproved": False,
                    "hodId": current_user['user_id'],
                    "hodRejectionReason": reason,
                    "hodRejectedAt": datetime.utcnow(),
                    "status": "hod_rejected"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal rejected"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Reject appraisal error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/escalate-to-dean', methods=['POST'])
@require_auth
@require_role(['HOD', 'Admin'])
@require_department_access
def escalate_to_dean(department, faculty_id):
    """Escalate appraisal to Dean for review"""
    try:
        data = request.json
        reason = sanitize_string(data.get('reason', ''))
        
        db = _get_db()
        current_user = request.current_user
        
        # Update appraisal status
        result = db.forms.update_one(
            {"userId": faculty_id, "department": department},
            {
                "$set": {
                    "escalatedToDean": True,
                    "escalatedBy": current_user['user_id'],
                    "escalationReason": reason,
                    "escalatedAt": datetime.utcnow(),
                    "status": "escalated_to_dean"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal escalated to Dean"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Escalate appraisal error: {e}")
        return jsonify({"error": str(e)}), 500
