import json
from uuid import uuid4

from flask import jsonify

from backend import APP, DB
from backend.user import User, requires_login
from backend.utils import autofill_args


class Project(DB.Model):  # type:ignore
    __tablename__ = "projects"
    unique_id = DB.Column(DB.String(100), primary_key=True)
    owner = DB.Column(DB.String(100))
    name = DB.Column(DB.String(100))
    content = DB.Column(DB.String())


def new_project(owner: str) -> Project:
    return Project(unique_id=str(uuid4()), owner=owner, name="", content="[]")


@APP.route("/api/project/new", methods=["POST"])
@requires_login
def new(current_user: User):
    project = new_project(current_user.username)
    DB.session.add(project)
    DB.session.commit()

    return jsonify({"unique_id": project.unique_id})


@APP.route("/api/project/list")
@requires_login
def list_(current_user: User):
    projects = Project.query.filter_by(owner=current_user.username).all()
    project_list = [
        {
            "name": project.name,
            "unique_id": project.unique_id,
        }
        for project in projects
    ]

    return jsonify({"projects": project_list})


@APP.route("/api/project/get")
@autofill_args
@requires_login
def get(current_user: User, unique_id: str):
    project = Project.query.filter_by(unique_id=unique_id).first()
    if project is None or project.owner != current_user.username:
        return jsonify({"message": "Project not found"}), 404

    return jsonify(
        {
            "unique_id": project.unique_id,
            "name": project.name,
            "owner": project.owner,
            "content": json.loads(project.content),
        }
    )


@APP.route("/api/project/edit", methods=["POST"])
@autofill_args
@requires_login
def edit(
    current_user: User,
    unique_id: str,
    new_name: str | None = None,
    new_content: list[str] | None = None,
):
    project = Project.query.filter_by(unique_id=unique_id).first()
    if project is None or project.owner != current_user.username:
        return jsonify({"message": "Project not found"}), 404

    if new_name is not None:
        project.name = new_name

    if new_content is not None:
        if not isinstance(new_content, list) or any(
            not isinstance(task, str) for task in new_content
        ):
            return jsonify({"message": "Invalid content"}), 400
        project.content = json.dumps(new_content)

    DB.session.commit()

    return jsonify(
        {
            "unique_id": project.unique_id,
            "name": project.name,
            "owner": project.owner,
            "content": json.loads(project.content),
        }
    )


@APP.route("/api/project/delete", methods=["DELETE"])
@autofill_args
@requires_login
def delete(
    current_user: User,
    unique_id: str,
):
    project = Project.query.filter_by(unique_id=unique_id).first()
    if project is None or project.owner != current_user.username:
        return jsonify({"message": "Project not found"}), 404

    DB.session.delete(project)
    DB.session.commit()

    return jsonify({})
