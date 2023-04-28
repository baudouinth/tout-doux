# importing all routes
from backend import APP, project, user  # noqa: imported but unused

APP.run(debug=True, port=5001)
