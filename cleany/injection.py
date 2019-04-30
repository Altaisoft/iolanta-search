class Backend:
    """This class does not mean anything except that crying out loud, really."""

    def __call__(self, *args, **kwargs):
        raise NotImplementedError('backend.__call__() is not implemented.')

    def __getattr__(self, item):
        raise NotImplementedError(f'backend.{item} is not implemented.')


def backend(model_class):
    def wrapper(backend_class):
        model_class.__backend__ = backend_class
        return backend_class

    return wrapper
