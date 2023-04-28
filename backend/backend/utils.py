import inspect
from functools import wraps
from typing import Callable

from flask import request


def autofill_args(fun: Callable) -> Callable:
    parameters = tuple(inspect.signature(fun).parameters.keys())

    @wraps(fun)
    def wrapped_route():
        request_json = request.get_json(force=True)
        args = {name: request_json[name] for name in request_json if name in parameters}

        return fun(**args)

    return wrapped_route
