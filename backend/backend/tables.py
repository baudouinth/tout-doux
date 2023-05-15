from backend import DB


class User(DB.Model):  # type:ignore
    __tablename__ = "users"
    username = DB.Column(DB.String(100), primary_key=True)
    email = DB.Column(DB.String(100))
    password_hash = DB.Column(DB.String(100))


class Project(DB.Model):  # type:ignore
    __tablename__ = "projects"
    unique_id = DB.Column(DB.String(100), primary_key=True)
    owner = DB.Column(DB.String(100))
    name = DB.Column(DB.String(100))
    content = DB.Column(DB.String())


class Share(DB.Model):  # type:ignore
    __tablename__ = "shares"
    project_id = DB.Column(DB.String(100), primary_key=True)
    project_name = DB.Column(DB.String())
    username = DB.Column(DB.String(100), primary_key=True)
