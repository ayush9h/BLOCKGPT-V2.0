import logging
import sys


class CustomFormatter(logging.Formatter):
    grey = "\x1b[38;20m"
    green = "\x1b[32;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"

    format_str = (
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s (%(filename)s:%(lineno)d)"
    )

    FORMATS = {
        logging.DEBUG: grey + format_str + reset,
        logging.INFO: green + format_str + reset,
        logging.WARNING: yellow + format_str + reset,
        logging.ERROR: red + format_str + reset,
        logging.CRITICAL: bold_red + format_str + reset,
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(
            record.levelno, self.grey + self.format_str + self.reset
        )
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(CustomFormatter())

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)
logger.addHandler(console_handler)
