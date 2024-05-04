import random, string


def randomword(length: int):
    letters = string.ascii_lowercase + string.digits
    return "".join(random.choice(letters) for i in range(length))
