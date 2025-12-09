from flask import Blueprint, request, jsonify
from utils.database import get_db
from utils.auth_middleware import require_auth, require_role

bp = Blueprint('verification', __name__)

def _get_db():
    """Lazy database getter"""
    return get_db()

@bp.route('/faculty_to_verify/<verifier_id>', methods=['GET'])
@require_auth
@require_role(['Verification Team', 'Admin'])
def get_faculty_to_verify(verifier_id):
    """Get faculty assigned to this verifier"""
    try:
        # Get assigned faculty
        db = _get_db()
        assignments = list(db.verifications.find({"verifierId": verifier_id}))
        for a in assignments:
            a['_id'] = str(a['_id'])
        return jsonify(assignments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/<department>/<user_id>/<verifier_id>/verify-research', methods=['POST'])
@require_auth
@require_role(['Verification Team', 'Admin'])
def verify_research(department, user_id, verifier_id):
    """Submit research verification"""
    try:
        data = request.json
        db = _get_db()
        db.verifications.update_one(
            {"userId": user_id, "verifierId": verifier_id, "department": department},
            {"$set": {"verificationData": data, "verified": True}},
            upsert=True
        )
        return jsonify({"message": "Verification submitted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
