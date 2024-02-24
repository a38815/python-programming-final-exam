from uuid import uuid4
from flask import Flask, json, request, jsonify, send_from_directory,abort, current_app,flash, request, redirect, url_for
from functools import wraps 
from flask_cors import CORS
from ariadne import combine_multipart_data, graphql_sync, make_executable_schema, gql, load_schema_from_path
from ariadne.constants import PLAYGROUND_HTML
from resolver import query, mutation, category, product, user
from database import db
from utils import validate_token, allowed_file
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(os.path.abspath(".."), 'static/img')
# check if the upload multi folder not exists
if not os.path.exists(os.path.join(os.path.abspath(".."), 'static')):
    try:
        os.makedirs(os.path.join(os.path.abspath(".."), 'static'))
    except OSError as e:
        print(e)
if not os.path.exists(UPLOAD_FOLDER):
    try:
        os.makedirs(UPLOAD_FOLDER)
    except OSError as e:
        print(e)
type_defs = gql(load_schema_from_path("../schema.graphql"))
schema = make_executable_schema(type_defs, query, mutation, category, product, user)

static_dir = os.path.join('static', 'img')
app = Flask(__name__,
    root_path=os.path.abspath(".."),
    static_folder=static_dir,
    static_url_path='/static'
    )
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

cors = CORS(app, resources={r"/graphql": {"origins": "*"}})

# @app.route('/static/:path', methods=['GET'])
# def send_static(path):
#     print('path',path)
#     return current_app.send_static_file(
#         os.path.join('img', path)
#     )

@app.route('/static/<path:path>', methods=['GET'])
def send_static(path):
    return send_from_directory('static', path)

@app.route("/graphql", methods=["GET"])
def graphql_playgroud():
    """Serve GraphiQL playground"""
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    
    data = request.get_json()
    token = None
    if "Authorization" in request.headers:
        token = request.headers["Authorization"]

    success, result = graphql_sync(
        schema,
        data,
        context_value=validate_token(token),
        debug=app.debug,
    )
    
    status_code = 200 if success else 400
    return jsonify(result), status_code

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            print('file',file.filename)
            filename = secure_filename(file.filename)
            file_after_save = uuid4().__str__() + filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file_after_save ))
            # return redirect(url_for('upload_file',
            #                         filename=filename))
            return jsonify({
                "status": "success", 
                "message": "File uploaded successfully",
                "url": f"http://localhost:5000/static/{file_after_save}"
                })
    return '''
        <!doctype html>
            <title>Upload new File</title>
            <h1>Upload new File</h1>
            <form method=post enctype=multipart/form-data>
            <input type=file name=file>
            <input type=submit value=Upload>
        </form>
    '''
if __name__ == '__main__':
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )