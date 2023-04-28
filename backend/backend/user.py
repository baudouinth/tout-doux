import datetime
from functools import wraps
from typing import Any, Callable

import jwt
from flask import jsonify, render_template, request
from sqlalchemy.sql import exists
from werkzeug.security import check_password_hash, generate_password_hash

from backend import APP, DB
from backend.utils import autofill_args


class User(DB.Model):  # type:ignore
    __tablename__ = "users"
    username = DB.Column(DB.String(100), primary_key=True)
    email = DB.Column(DB.String(100))
    password_hash = DB.Column(DB.String(100))


def new_user(username: str, email: str, password: str) -> User:
    return User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
    )


def requires_login(fun: Callable) -> Callable:
    @wraps(fun)
    def decorator(*args, **kwargs):
        token = request.headers.get("x-access-tokens", None)
        if token is None:
            return jsonify({"message": "Login required"}), 401

        try:
            data = jwt.decode(
                token,
                APP.config["SECRET_KEY"],
                algorithms=["HS256"],
            )
            current_user = User.query.filter_by(username=data["username"]).first()
            assert current_user is not None
        except Exception:
            return jsonify({"message": "Invalid JWT"}), 401

        return fun(current_user, *args, **kwargs)

    return decorator


# Only for testing
@APP.route("/api/user/show_all")
def show_all():
    return render_template("show_users.html", users=User.query.all())


@APP.route("/api/user/register", methods=["POST"])
@autofill_args
def register(username: str, email: str, password: str):
    response: dict[str, Any] = {}
    user = new_user(username, email, password)
    user_exists = exists().where(User.username == user.username)
    if DB.session.query(user_exists).scalar():
        response["message"] = "An user with this username already exists"
        return jsonify(response), 401

    DB.session.add(user)
    DB.session.commit()

    return jsonify(response)


@APP.route("/api/user/login", methods=["POST"])
def login():
    auth = request.authorization
    response = {}
    if not auth or auth.username is None or auth.password is None:
        response["message"] = "Auth required"
        return jsonify(response), 401

    user = User.query.filter_by(username=auth.username).first()
    if user is not None and check_password_hash(user.password_hash, auth.password):
        expires = datetime.datetime.utcnow() + datetime.timedelta(minutes=45)
        response["token"] = jwt.encode(
            {"username": user.username, "expires": expires.timestamp()},
            APP.config["SECRET_KEY"],
            "HS256",
        )

        return jsonify(response)

    response["message"] = "Invalid username or passsword"
    return response, 401


@APP.route("/api/user/current")
@requires_login
def current(current_user: User):
    return jsonify({"username": current_user.username})
