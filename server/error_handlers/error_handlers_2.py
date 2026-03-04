from flask import jsonify
from werkzeug.exceptions import HTTPException
from Exeptions.exceptions import ItemAlreadyExistsException, MissingFieldException, ItemNotFoundException


def register_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            return jsonify({'error': e.name, 'description': e.description}), e.code
        if isinstance(e, (ItemAlreadyExistsException, MissingFieldException, ItemNotFoundException)):
            return jsonify({'error': 'Business Error', 'description': str(e)}), 400
        return jsonify({'error': 'Internal Server Error', 'description': str(e)}), 500
