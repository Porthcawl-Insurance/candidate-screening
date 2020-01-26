from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os
from otenki.settings import basedir

db = SQLAlchemy()


def create_app(test_config=None):
    app = Flask(__name__)

    if test_config is None:
        # Default settings
        app.config.from_pyfile(os.path.join(basedir, 'settings.py'))
    else:
        # Override with test settings
        app.config.from_mapping(test_config)

    from .views import api_bp, ui_bp

    app.register_blueprint(api_bp)
    app.register_blueprint(ui_bp)

    db.init_app(app)

    # Jsonify API error responses
    @app.errorhandler(404)
    def _api_not_found(e):
        if request.path.startswith('/api/'):
            return jsonify(error=str(e)), 404
        else:
            return e

    @app.errorhandler(405)
    def _api_bad_request(e):
        if request.path.startswith('/api/'):
            return jsonify(error=str(e)), 405
        else:
            return e

    return app
