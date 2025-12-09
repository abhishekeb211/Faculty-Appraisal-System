from flask import Blueprint, jsonify

bp = Blueprint('director', __name__)

@bp.route('/director/placeholder', methods=['GET'])
def director_placeholder():
    return jsonify({"message": "Director routes placeholder"}), 200
