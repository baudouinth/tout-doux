from flask import jsonify

from backend import APP, DB
from backend.tables import Project, Share, User
from backend.user import requires_login
from backend.utils import autofill_args


def has_share(project_id: str, username: str) -> bool:
    share = Share.query.filter_by(project_id=project_id, username=username).first()
    return share is not None


@APP.route("/api/share/list")
@requires_login
def list_shares(current_user: User):
    shares = Share.query.filter_by(username=current_user.username).all()
    shares_list = [
        {
            "name": share.project_name,
            "unique_id": share.project_id,
        }
        for share in shares
    ]

    return jsonify({"shares": shares_list})


@APP.route("/api/share/new", methods=["POST"])
@autofill_args
@requires_login
def new_share(
    current_user: User,
    project_id: str,
    new_editor: str,
):
    project = Project.query.filter_by(unique_id=project_id).first()
    if project is None or project.owner != current_user.username:
        return jsonify({"message": "Project not found"}), 404

    new_editor_obj = User.query.filter_by(username=new_editor).first()
    if new_editor_obj is None:
        return jsonify({"message": "User not found"}), 404

    if has_share(project_id, new_editor):
        return jsonify({"message": "Already shared"}), 400

    share = Share(
        project_id=project_id,
        project_name=project.name,
        username=new_editor_obj.username,
    )
    DB.session.add(share)
    DB.session.commit()

    return jsonify({"success": True, "new_editor": new_editor_obj.username})
