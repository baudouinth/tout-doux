from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

APP = Flask(__name__, template_folder="templates")
CORS(APP)

APP.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
APP.config["SECRET_KEY"] = "bb73839c36aa9315d69e081762daa881"

DB = SQLAlchemy(APP)


# Only for testing
@APP.route("/clear_db")
def clear_db():
    DB.drop_all()
    DB.create_all()
    return "Done."


@APP.route("/")
def hello_world():
    return "The backend is running."
