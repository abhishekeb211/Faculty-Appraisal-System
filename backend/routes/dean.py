from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from utils.database import get_db
from utils.auth_middleware import require_auth, require_role, require_department_access
from utils.validation import validate_objectid, sanitize_string, ValidationError

bp = Blueprint('dean', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/\u003cdepartment\u003e/portfolio-given', methods=['POST'])
@bp.route('/\u003cdepartment\u003e/\u003cuser_id\u003e/portfolio-given', methods=['POST'])
def portfolio_given(department, user_id=None):
    """Mark portfolio as reviewed by dean"""
    try:
        # Extract user_id from request body if not in URL
        if not user_id:
            data = request.json
            user_id = data.get('userId')
        
        db = _get_db()
        db.forms.update_one(
            {"userId": user_id, "department": department, "formType": "D"},
            {"$set": {"portfolioGivenByDean": True, "deanReviewedAt": datetime.now()}}
        )
        return jsonify({"message": "Portfolio marked as reviewed by dean"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/\u003cdepartment\u003e/dean-assignments/\u003cdean_id\u003e', methods=['GET'])
def get_dean_assignments(department, dean_id):
    """Get faculty assigned to dean for interaction evaluation"""
    try:
        db = _get_db()
        
        # Find assignments where this dean is assigned
        assignments = list(db.dean_assignments.find({
            "deanId": dean_id,
            "department": department
        }))
        
        # Get assigned faculty details
        faculty_data = {}
        reviewer_info = {}
        
        # Get dean info
        dean = db.users.find_one({"_id": ObjectId(dean_id)})
        if dean:
            reviewer_info = {
                "full_name": dean.get("name"),
                "organization": dean.get("organization", ""),
                "dept": dean.get("dept"),
                "desg": dean.get("desg", "Dean")
            }
        
        # Get faculty for each external group
        for assignment in assignments:
            external_id = assignment.get("externalId", "default")
            faculty_ids = assignment.get("facultyIds", [])
            
            if external_id not in faculty_data:
                faculty_data[external_id] = []
            
            for fac_id in faculty_ids:
                faculty = db.users.find_one({"_id": ObjectId(fac_id)})
                if faculty:
                    # Check if already reviewed
                    interaction_eval = db.dean_interactions.find_one({
                        "facultyId": str(faculty["_id"]),
                        "deanId": dean_id,
                        "department": department
                    })
                    
                    faculty_info = {
                        "_id": str(faculty["_id"]),
                        "name": faculty.get("name"),
                        "department": department,
                        "role": faculty.get("role"),
                        "designation": faculty.get("desg"),
                        "isReviewed": interaction_eval is not None and interaction_eval.get("submitted", False),
                        "total_marks": interaction_eval.get("total_marks", 0) if interaction_eval else 0
                    }
                    faculty_data[external_id].append(faculty_info)
        
        # Add reviewer info to response
        faculty_data["reviewer_info"] = reviewer_info
        
        return jsonify({"data": faculty_data}), 200
        
    except Exception as e:
        print(f"Error getting dean assignments: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/\u003cdepartment\u003e/\u003cfaculty_id\u003e/dean-interaction', methods=['GET', 'POST'])
def dean_interaction_evaluation(department, faculty_id):
    """Get or submit dean interaction evaluation"""
    db = _get_db()
    
    if request.method == 'GET':
        try:
            # Get existing evaluation
            evaluation = db.dean_interactions.find_one({
                "facultyId": faculty_id,
                "department": department
            })
            
            if evaluation:
                evaluation.pop('_id', None)
                return jsonify(evaluation), 200
            return jsonify({}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    else:  # POST
        try:
            data = request.json
            dean_id = data.get("deanId")
            
            # Upsert evaluation
            db.dean_interactions.update_one(
                {
                    "facultyId": faculty_id,
                    "department": department,
                    "deanId": dean_id
                },
                {
                    "$set": {
                        **data,
                        "submitted": True,
                        "submittedAt": datetime.now()
                    }
                },
                upsert=True
            )
            
            return jsonify({"message": "Dean interaction evaluation submitted successfully"}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@bp.route('/dean/faculty-list/\u003cdepartment\u003e', methods=['GET'])
def get_dean_faculty_list(department):
    """Get all faculty in dean's departments"""
    try:
        db = _get_db()
        faculty = list(db.users.find({"dept": department, "role": "Faculty"}, {"password": 0}))
        
        for f in faculty:
            f['_id'] = str(f['_id'])
        
        return jsonify(faculty), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/dean/associate-deans', methods=['GET'])
@require_auth
@require_role(['Dean', 'Director', 'Admin'])
def get_associate_deans():
    """Get all associate deans"""
    try:
        db = _get_db()
        # Find users with designation "Associate Dean"
        deans = list(db.users.find({"desg": "Associate Dean"}, {"password": 0}))
        
        for dean in deans:
            dean['_id'] = str(dean['_id'])
            dean['id'] = str(dean['_id'])  # Add id field for frontend compatibility
        
        return jsonify(deans), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# New workflow routes

@bp.route('/<department>/escalated-appraisals', methods=['GET'])
@require_auth
@require_role(['Dean', 'Admin'])
def get_escalated_appraisals(department):
    """Get list of appraisals escalated from HOD"""
    try:
        db = _get_db()
        
        # Find appraisals escalated to Dean
        appraisals = list(db.forms.find({
            "department": department,
            "escalatedToDean": True,
            "deanApproved": {"$exists": False}
        }))
        
        result = []
        for appraisal in appraisals:
            # Get faculty details
            faculty = db.users.find_one({"userId": appraisal.get('userId')}, {"password": 0})
            
            if faculty:
                result.append({
                    "_id": str(appraisal['_id']),
                    "facultyId": str(faculty['_id']),
                    "facultyName": faculty.get('name'),
                    "userId": faculty.get('userId'),
                    "escalatedAt": appraisal.get('escalatedAt'),
                    "escalationReason": appraisal.get('escalationReason'),
                    "escalatedBy": appraisal.get('escalatedBy'),
                    "status": "escalated_to_dean"
                })
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Get escalated appraisals error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/dean-approve', methods=['POST'])
@require_auth
@require_role(['Dean', 'Admin'])
def approve_by_dean(department, faculty_id):
    """Dean approves appraisal"""
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
                    "deanApproved": True,
                    "deanId": current_user['user_id'],
                    "deanComments": comments,
                    "deanApprovedAt": datetime.utcnow(),
                    "status": "dean_approved"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal approved by Dean"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Dean approve error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/dean-reject', methods=['POST'])
@require_auth
@require_role(['Dean', 'Admin'])
def reject_by_dean(department, faculty_id):
    """Dean rejects appraisal and sends back to HOD"""
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
                    "deanApproved": False,
                    "deanId": current_user['user_id'],
                    "deanRejectionReason": reason,
                    "deanRejectedAt": datetime.utcnow(),
                    "escalatedToDean": False,
                    "status": "returned_to_hod"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal returned to HOD"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Dean reject error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/escalate-to-director', methods=['POST'])
@require_auth
@require_role(['Dean', 'Admin'])
def escalate_to_director(department, faculty_id):
    """Escalate appraisal to Director for final review"""
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
                    "escalatedToDirector": True,
                    "escalatedByDean": current_user['user_id'],
                    "directorEscalationReason": reason,
                    "escalatedToDirectorAt": datetime.utcnow(),
                    "status": "escalated_to_director"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal escalated to Director"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Escalate to director error: {e}")
        return jsonify({"error": str(e)}), 500
