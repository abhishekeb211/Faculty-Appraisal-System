from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from utils.database import get_db
from utils.auth_middleware import require_auth, require_role
from utils.validation import validate_objectid, sanitize_string, ValidationError

bp = Blueprint('director', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/\u003cdepartment\u003e/\u003cuser_id\u003e/director-mark-given', methods=['POST'])
def director_mark_given(department, user_id):
    """Mark director evaluation as given"""
    try:
        db = _get_db()
        db.forms.update_one(
            {"userId": user_id, "department": department, "formType": "D"},
            {"$set": {"directorMarkGiven": True, "directorReviewedAt": datetime.now()}}
        )
        return jsonify({"message": "Director mark recorded"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/faculty/all', methods=['GET'])
@require_auth
@require_role(['Director', 'Admin'])
def get_all_faculty():
    """Get all faculty across departments"""
    try:
        db = _get_db()
        faculty = list(db.users.find({"role": "Faculty"}, {"password": 0}))
        
        for f in faculty:
            f['_id'] = str(f['_id'])
            f['id'] = str(f['_id'])
        
        return jsonify(faculty), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/hod/all', methods=['GET'])
@require_auth
@require_role(['Director', 'Admin'])
def get_all_hods():
    """Get all HODs"""
    try:
        db = _get_db()
        hods = list(db.users.find({"role": "HOD"}, {"password": 0}))
        
        for hod in hods:
            hod['_id'] = str(hod['_id'])
            hod['id'] = str(hod['_id'])
        
        return jsonify(hods), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/dean/all', methods=['GET'])
@require_auth
@require_role(['Director', 'Admin'])
def get_all_deans():
    """Get all Deans"""
    try:
        db = _get_db()
        deans = list(db.users.find({"role": "Dean"}, {"password": 0}))
        
        for dean in deans:
            dean['_id'] = str(dean['_id'])
            dean['id'] = str(dean['_id'])
        
        return jsonify(deans), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/external/add', methods=['POST'])
@require_auth
@require_role(['Director', 'Admin'])
def add_college_external():
    """Add college-level external reviewer"""
    try:
        data = request.json
        db = _get_db()
        
        # Hash password if provided
        if 'password' in data:
            import bcrypt
            data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Set role as external
        data['role'] = 'external'
        data['externalType'] = 'college'
        data['createdAt'] = datetime.now()
        
        result = db.users.insert_one(data)
        return jsonify({"message": "College external added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/external/list', methods=['GET'])
@require_auth
@require_role(['Director', 'Admin'])
def get_college_externals():
    """Get all college-level external reviewers"""
    try:
        db = _get_db()
        externals = list(db.users.find({"role": "external", "externalType": "college"}, {"password": 0}))
        
        for ext in externals:
            ext['_id'] = str(ext['_id'])
            ext['id'] = str(ext['_id'])
        
        return jsonify(externals), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/external/assign', methods=['POST'])
@require_auth
@require_role(['Director', 'Admin'])
def assign_college_external():
    """Assign college external to evaluate authorities (HOD/Dean)"""
    try:
        data = request.json
        external_id = data.get('externalId')
        authority_ids = data.get('authorityIds', [])  # HOD/Dean IDs
        authority_type = data.get('authorityType')  # 'HOD' or 'Dean'
        
        db = _get_db()
        
        # Create assignment
        assignment = {
            "externalId": external_id,
            "authorityIds": authority_ids,
            "authorityType": authority_type,
            "assignedAt": datetime.now(),
            "completed": False
        }
        
        result = db.college_external_assignments.insert_one(assignment)
        
        return jsonify({"message": "Assignment created successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/external/assignments/\u003cexternal_id\u003e', methods=['GET'])
def get_college_external_assignments(external_id):
    """Get authorities assigned to college external"""
    try:
        db = _get_db()
        
        assignments = list(db.college_external_assignments.find({"externalId": external_id}))
        
        result = []
        for assignment in assignments:
            authority_type = assignment.get("authorityType")
            authority_ids = assignment.get("authorityIds", [])
            
            for auth_id in authority_ids:
                authority = db.users.find_one({"_id": ObjectId(auth_id)})
                if authority:
                    # Check if already evaluated
                    evaluation = db.college_external_evaluations.find_one({
                        "authorityId": str(authority["_id"]),
                        "externalId": external_id
                    })
                    
                    result.append({
                        "_id": str(authority["_id"]),
                        "name": authority.get("name"),
                        "role": authority.get("role"),
                        "department": authority.get("dept"),
                        "designation": authority.get("desg"),
                        "authorityType": authority_type,
                        "isReviewed": evaluation is not None and evaluation.get("submitted", False),
                        "total_marks": evaluation.get("total_marks", 0) if evaluation else 0
                    })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/director/interaction/\u003cauthority_id\u003e', methods=['GET', 'POST'])
def director_interaction_evaluation(authority_id):
    """Get or submit director interaction evaluation"""
    db = _get_db()
    
    if request.method == 'GET':
        try:
            evaluation = db.director_interactions.find_one({"authorityId": authority_id})
            
            if evaluation:
                evaluation.pop('_id', None)
                return jsonify(evaluation), 200
            return jsonify({}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    else:  # POST
        try:
            data = request.json
            director_id = data.get("directorId")
            
            db.director_interactions.update_one(
                {"authorityId": authority_id, "directorId": director_id},
                {
                    "$set": {
                        **data,
                        "submitted": True,
                        "submittedAt": datetime.now()
                    }
                },
                upsert=True
            )
            
            return jsonify({"message": "Director interaction evaluation submitted"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

# New workflow routes

@bp.route('/escalated-appraisals', methods=['GET'])
@require_auth
@require_role(['Director', 'Admin'])
def get_director_escalated_appraisals():
    """Get all appraisals escalated to Director"""
    try:
        db = _get_db()
        
        # Find appraisals escalated to Director
        appraisals = list(db.forms.find({
            "escalatedToDirector": True,
            "directorApproved": {"$exists": False}
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
                    "department": faculty.get('dept'),
                    "escalatedAt": appraisal.get('escalatedToDirectorAt'),
                    "escalationReason": appraisal.get('directorEscalationReason'),
                    "escalatedBy": appraisal.get('escalatedByDean'),
                    "status": "escalated_to_director"
                })
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Get director escalated appraisals error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/director-approve', methods=['POST'])
@require_auth
@require_role(['Director', 'Admin'])
def approve_by_director(department, faculty_id):
    """Director gives final approval"""
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
                    "directorApproved": True,
                    "directorId": current_user['user_id'],
                    "directorComments": comments,
                    "directorApprovedAt": datetime.utcnow(),
                    "status": "final_approved"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal given final approval by Director"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Director approve error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<faculty_id>/director-reject', methods=['POST'])
@require_auth
@require_role(['Director', 'Admin'])
def reject_by_director(department, faculty_id):
    """Director rejects appraisal and sends back to Dean"""
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
                    "directorApproved": False,
                    "directorId": current_user['user_id'],
                    "directorRejectionReason": reason,
                    "directorRejectedAt": datetime.utcnow(),
                    "escalatedToDirector": False,
                    "status": "returned_to_dean"
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Appraisal returned to Dean"}), 200
        else:
            return jsonify({"error": "Appraisal not found"}), 404
            
    except Exception as e:
        print(f"Director reject error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/appraisal-summary', methods=['GET'])
@require_auth
@require_role(['Director', 'Admin'])
def get_appraisal_summary():
    """Get summary statistics for Director dashboard"""
    try:
        db = _get_db()
        
        # Count appraisals by status
        total_submitted = db.forms.count_documents({"submittedAt": {"$exists": True}})
        hod_approved = db.forms.count_documents({"hodApproved": True})
        dean_approved = db.forms.count_documents({"deanApproved": True})
        director_approved = db.forms.count_documents({"directorApproved": True})
        escalated_to_dean = db.forms.count_documents({"escalatedToDean": True, "deanApproved": {"$exists": False}})
        escalated_to_director = db.forms.count_documents({"escalatedToDirector": True, "directorApproved": {"$exists": False}})
        
        # Count users by role
        total_faculty = db.users.count_documents({"role": "Faculty"})
        total_hods = db.users.count_documents({"role": "HOD"})
        total_deans = db.users.count_documents({"role": "Dean"})
        
        return jsonify({
            "appraisals": {
                "totalSubmitted": total_submitted,
                "hodApproved": hod_approved,
                "deanApproved": dean_approved,
                "directorApproved": director_approved,
                "escalatedToDean": escalated_to_dean,
                "escalatedToDirector": escalated_to_director
            },
            "users": {
                "totalFaculty": total_faculty,
                "totalHODs": total_hods,
                "totalDeans": total_deans
            }
        }), 200
    except Exception as e:
        print(f"Get appraisal summary error: {e}")
        return jsonify({"error": str(e)}), 500
