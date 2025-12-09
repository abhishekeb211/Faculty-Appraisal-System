# Placeholder routes for dean, director, verification, and external
from flask import Blueprint, jsonify

bp = Blueprint('dean', __name__)

@bp.route('/dean/placeholder', methods=['GET'])
def dean_placeholder():
    return jsonify({"message": "Dean routes placeholder"}), 200
