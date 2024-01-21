from flask import (
    Blueprint, current_app
)

bp = Blueprint('root', __name__)

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def catch_all(path):
    return current_app.send_static_file('index.html')
