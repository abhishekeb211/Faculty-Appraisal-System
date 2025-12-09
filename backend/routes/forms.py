from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from utils.database import get_db

bp = Blueprint('forms', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/<department>/<user_id>/<form_type>', methods=['GET'])
def get_form(department, user_id, form_type):
    """Get form data for a user"""
    try:
        # Convert form_type to uppercase
        form_type = form_type.upper()
        
        # Find form in database
        db = _get_db()
        form = db.forms.find_one({
            "userId": user_id,
            "department": department,
            "formType": form_type
        })
        
        if form:
            # Remove MongoDB _id before sending
            form.pop('_id', None)
            return jsonify(form.get('data', {})), 200
        else:
            # Return empty structure if no form exists
            return jsonify({}), 200
            
    except Exception as e:
        print(f"Get form error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<user_id>/<form_type>', methods=['POST'])
def submit_form(department, user_id, form_type):
    """Submit or update form data"""
    try:
        form_type = form_type.upper()
        data = request.json
        
        # Upsert form data
        db = _get_db()
        result = db.forms.update_one(
            {
                "userId": user_id,
                "department": department,
                "formType": form_type
            },
            {
                "$set": {
                    "data": data,
                    "updatedAt": datetime.now()
                },
                "$setOnInsert": {
                    "createdAt": datetime.now()
                }
            },
            upsert=True
        )
        
        return jsonify({"message": "Form submitted successfully"}), 200
        
    except Exception as e:
        print(f"Submit form error: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<user_id>/get-status', methods=['GET'])
def get_status(department, user_id):
    """Get submission status for all forms"""
    try:
        db = _get_db()
        forms = list(db.forms.find({
            "userId": user_id,
            "department": department
        }))
        
        status = {
            "A": False,
            "B": False,
            "C": False,
            "D": False
        }
        
        for form in forms:
            form_type = form.get('formType')
            if form_type in status:
                status[form_type] = True
        
        return jsonify(status), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

