class ItemAlreadyExistsException(Exception):
    def __init__(self, item):
        super().__init__(f"item '{item}' already exists.")


class MissingFieldException(Exception):
    def __init__(self, field):
        super().__init__(f"Field {field} is required.")


class ItemNotFoundException(Exception):
    def __init__(self, itemId):
        super().__init__(f"item with id {itemId} not found.")
