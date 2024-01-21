import os
from flask import Flask
from . import root, login, signUp, permissions, patient, docWork, admin, drugWarehousing

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True, static_folder='./static')

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.register_blueprint(root.bp)
    app.register_blueprint(login.bp)
    app.register_blueprint(signUp.bp)
    app.register_blueprint(permissions.bp)
    app.register_blueprint(patient.bp)
    app.register_blueprint(docWork.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(drugWarehousing.bp)

    return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run()
# flask --app . run --debug
