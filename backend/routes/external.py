from flask import Blueprint, jsonify

bp = Blueprint('external', __name__)

@bp.route('/external/placeholder', methods=['GET'])
def external_placeholder():
    return jsonify({"message": "External routes placeholder"}), 200
