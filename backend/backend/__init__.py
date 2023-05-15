import os
from distutils.util import strtobool

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

APP = Flask(__name__, template_folder="templates")
CORS(APP)

APP.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////app/data/db.sqlite3"
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
APP.config["SECRET_KEY"] = "bb73839c36aa9315d69e081762daa881"
APP.config["DEBUG"] = strtobool(os.getenv("DEBUG", "no"))

DB = SQLAlchemy(APP)


@APP.route("/clear_db")
def clear_db():
    if not APP.config["DEBUG"]:
        return "Only in debug mode"
    DB.drop_all()
    DB.create_all()
    return "Done."


@APP.route("/create_db")
def create_db():
    if not APP.config["DEBUG"]:
        return "Only in debug mode"
    DB.create_all()
    return "Done."


@APP.route("/")
def hello_world():
    return "The backend is running."
