# importing all routes
from backend import APP, project, share, user  # noqa: imported but unused

APP.run(debug=APP.config["DEBUG"], host="0.0.0.0", port=5001)
