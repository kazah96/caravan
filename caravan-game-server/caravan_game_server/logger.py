import logging
import colorlog
import colorlog.escape_codes

handler = colorlog.StreamHandler()
handler.setFormatter(
    colorlog.ColoredFormatter(
        f"%(log_color)s[%(levelname)s:%(name)s]\t{colorlog.escape_codes.esc(97)}%(message)s"
    )
)


def get_logger(name: str):
    logger = colorlog.getLogger(name)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger
