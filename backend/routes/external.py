from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from utils.database import get_db
from utils.auth_middleware import require_auth, require_role

bp = Blueprint('external', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/\\<department\\>/external-assignments/\\<external_id\\>', methods=['GET'])
@require_auth
@require_role(['external', 'Admin', 'Director'])
def get_external_assignments(department, external_id):
    """Get faculty assigned to external reviewer"""
    try:
        db = _get_db()
        
        # Find assignments for this external reviewer
        assignments = list(db.external_assignments.find({
            "externalId": external_id,
            "department": department
        }))
        
        # Get external reviewer info
        external = db.users.find_one({"_id": ObjectId(external_id)})
        reviewer_info = {}
        if external:
            reviewer_info = {
                "full_name": external.get("name"),
                "organization": external.get("organization", ""),
                "desg": "External Reviewer"
            }
        
        # Collect assigned faculty
        faculty_list = []
        for assignment in assignments:
            faculty_ids = assignment.get("facultyIds", [])
            
            for fac_id in faculty_ids:
                faculty = db.users.find_one({"_id": ObjectId(fac_id)})
                if faculty:
                    # Check if already evaluated
                    evaluation = db.external_evaluations.find_one({
                        "facultyId": str(faculty["_id"]),
                        "externalId": external_id,
                        "department": department
                    })
                    
                    faculty_info = {
                        "_id": str(faculty["_id"]),
                        "name": faculty.get("name"),
                        "department": department,
                        "role": faculty.get("role"),
                        "designation": faculty.get("desg"),
                        "isReviewed": evaluation is not None and evaluation.get("submitted", False),
                        "total_marks": evaluation.get("total_marks", 0) if evaluation else 0
                    }
                    faculty_list.append(faculty_info)
        
        return jsonify({
            "reviewer_info": reviewer_info,
            "faculty": faculty_list
        }), 200
        
    except Exception as e:
        print(f"Error getting external assignments: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/\\<department\\>/\\<faculty_id\\>/external-evaluation/\\<external_id\\>', methods=['GET', 'POST'])
@require_auth
@require_role(['external', 'Admin', 'Director'])
def external_faculty_evaluation(department, faculty_id, external_id):
    """Get or submit external evaluation for faculty"""
    db = _get_db()
    
    if request.method == 'GET':
        try:
            evaluation = db.external_evaluations.find_one({
                "facultyId": faculty_id,
                "externalId": external_id,
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
            
            db.external_evaluations.update_one(
                {
                    "facultyId": faculty_id,
                    "externalId": external_id,
                    "department": department
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
            
            return jsonify({"message": "External evaluation submitted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@bp.route('/college-external/\\<authority_id\\>/evaluation/\\<external_id\\>', methods=['GET', 'POST'])
@require_auth
@require_role(['external', 'Admin', 'Director'])
def college_external_authority_evaluation(authority_id, external_id):
    """Get or submit college external evaluation for authority (HOD/Dean)"""
    db = _get_db()
    
    if request.method == 'GET':
        try:
            evaluation = db.college_external_evaluations.find_one({
                "authorityId": authority_id,
                "externalId": external_id
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
            
            db.college_external_evaluations.update_one(
                {
                    "authorityId": authority_id,
                    "externalId": external_id
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
            
            return jsonify({"message": "College external evaluation submitted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@bp.route('/external/add-department', methods=['POST'])
@require_auth
@require_role(['HOD', 'Admin'])
def add_department_external():
    """Add department-level external reviewer (called by HOD)"""
    try:
        data = request.json
        db = _get_db()
        
        # Hash password if provided
        if 'password' in data:
            import bcrypt
            data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Set role as external
        data['role'] = 'external'
        data['externalType'] = 'department'
        data['createdAt'] = datetime.now()
        
        result = db.users.insert_one(data)
        return jsonify({"message": "Department external added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/external/department/\\<department\\>/list', methods=['GET'])
@require_auth
@require_role(['HOD', 'Admin', 'Director'])
def get_department_externals(department):
    """Get external reviewers for a department"""
    try:
        db = _get_db()
        externals = list(db.users.find({
            "role": "external",
            "externalType": "department",
            "dept": department
        }, {"password": 0}))
        
        for ext in externals:
            ext['_id'] = str(ext['_id'])
            ext['id'] = str(ext['_id'])
        
        return jsonify(externals), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/external/assign', methods=['POST'])
@require_auth
@require_role(['HOD', 'Admin', 'Director'])
def assign_external_to_faculty():
    """Assign external reviewer to faculty members"""
    try:
        data = request.json
        external_id = data.get('externalId')
        faculty_ids = data.get('facultyIds', [])
        department = data.get('department')
        
        db = _get_db()
        
        # Create assignment
        assignment = {
            "externalId": external_id,
            "facultyIds": faculty_ids,
            "department": department,
            "assignedAt": datetime.now(),
            "completed": False
        }
        
        result = db.external_assignments.insert_one(assignment)
        
        return jsonify({"message": "External assigned successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
