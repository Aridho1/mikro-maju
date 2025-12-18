import re
import time
import math

def isNaN(x: any) -> bool:
    try:
        return math.isnan(float(x))
    except ValueError:
        return True

# WRITE_REGEX = r"(\\(?:n|\$\w+(?:\([^)]*\))?)|[^\\]|.)"
WRITE_REGEX = r"(\\(?:n|\$\w+(?:\([^)]*\))?)|\s|[^\\\s]+)"

def parse_params(raw: str):
    
    # Parse parameter string:
    # - "2"                -> 2 (int)
    # - "2,3"              -> ["2","3"]
    # - "up=1,left=20"     -> {"up": "1", "left": "20"}

    raw = raw.strip()
    if not raw:
        return None

    # Ada key=value → dict
    if "=" in raw:
        result = {}
        for part in raw.split(","):
            if not part.strip():
                continue
            if "=" in part:
                key, val = part.split("=", 1)
                result[key.strip()] = val.strip()
            else:
                # fallback: key tanpa "=" → anggap 1
                result[part.strip()] = "1"
        return result

    # Kalau ada koma tapi tanpa "=" → list
    if "," in raw:
        return [p.strip() for p in raw.split(",") if p.strip()]

    # Single value → coba convert ke int/float
    try:
        if "." in raw:
            return float(raw)
        return int(raw)
    except ValueError:
        return raw

def getParams (*args, **kwargs) -> list[tuple, dict]:
    return [args, kwargs]

class WProps:
    def __init__(self):
        self.x: int = 1
        self.y: int = 1
        self.delay: float = 0.01
        self.maxTextLength: int = 0
        self.customDelay: float = 0

    def endl(self, count: int = 1):
        self['x'] = 1
        self['y'] += max(1, count)

COLORS = {
    "reset": "\033[0m",
    "resetcolor": "\033[0m",
    "bold": "\033[1m",
    "red": "\033[31m",
    "green": "\033[32m",
    "yellow": "\033[33m",
    "blue": "\033[34m",
    "magenta": "\033[35m",
    "cyan": "\033[36m",
    "white": "\033[37m",
}

CURSOR = {
    "up": "\033[F",
    "down": "\033[E",
    "left": "\033[D",
    "right": "\033[C",
    "clear": "\033[K"
}

globalProps: dict[str, int | float] = {
    'x': 1,
    'y': 1,
    'delay': 0.001,
    'maxTextLength': 0,
    'customDelay': 0,
}

def setGlobalWriteProps(props: dict[str, int | float]) -> dict[str, int | float]:
    global globalProps

    globalProps = {**globalProps, **props}
    return globalProps

def gotoxy(x: int, y: int) -> None:
    global globalProps

    x = max(1, x)
    y = max(1, y)

    print(f"\033[{y};{x}H", end='', flush=True)
    globalProps["x"] = x
    globalProps["y"] = y

def write(texts: str | tuple, delay: float = 0.01, maxTextLength: int = 0) -> None:
    global globalProps
    
    if isinstance(texts, str) or callable(texts):
        texts = (texts,)

    maxTextLength = max(0, maxTextLength)

    props: dict = {
        'x': 1,
        'y': 1,
    }

    for text in texts:
        if callable(text):
            text = text(globalProps)

        if isinstance(text, str) and len(text) > 0:
            tokens = re.findall(WRITE_REGEX, text)

            for i, token in enumerate(tokens):
                if token.startswith("\\"):  # command
                    cmd = token[1]

                    # newline
                    if cmd == "n":
                        print()
                        props["x"] = 1
                        props["y"] += 1
                        time.sleep(delay)

                    # -----------------------
                    # custom exec ($)
                    # -----------------------
                    elif cmd == "$":
                        func_name = token[2: token.find("(")].lower()  # ambil nama fungsi
                        params = token[token.find("(") + 1: token.find(")")]  # ambil isi param

                        _tmp: dict = {}
                        strs: str = f"args, kwargs = getParams({params})"
                        # print(f"{strs = }")
                        exec(strs, globals=globals())

                        args: tuple = globals().__getitem__('args')
                        kwargs: dict = globals().__getitem__('kwargs')
                        params = parse_params(params)

                        # dispatcher
                        if func_name == "s":
                            time.sleep(float(args[0]))

                        elif func_name == "color":
                            print(COLORS.get(args[0], ''), end='', flush=True)
                        
                        elif func_name in COLORS.keys():
                            print(COLORS[func_name], end='', flush=True)

                        elif func_name == "cursor":
                            for pos in (pos.lower() for pos in params.keys()):
                                num = params[pos]
                                if not num:
                                    continue

                                ranged = 0 if isNaN(num) else int(num)
                                for _ in range(ranged):
                                    if pos == "left":
                                        print(
                                            CURSOR["left"] + CURSOR["left"] +
                                            (' ', '')[_ + 1 == ranged],
                                            end='', flush=True
                                        )
                                    else:
                                        print(CURSOR[pos], end='', flush=True)

                                    if pos != "right":
                                        time.sleep(delay)

                # -----------------------
                # normal text
                # -----------------------
                else:
                    # kalau panjang sisa baris tidak cukup utk token penuh → break line
                    if maxTextLength and props["x"] - 1 + len(token) > maxTextLength and not len(token) > maxTextLength:
                        print()
                        props["x"] = 1
                        props["y"] += 1

                    for ch in token:
                        if maxTextLength and props["x"] > maxTextLength:
                            print()
                            props["x"] = 1
                            props["y"] += 1

                        print(ch, end="", flush=True)
                        props["x"] += 1

                        # delay khusus
                        if ch == ".":
                            time.sleep(delay * 10)
                        elif ch == "!":
                            time.sleep(delay * 20)
                        else:
                            time.sleep(delay)
    time.sleep(delay)

reject = lambda _, x: write(fr"\$cursor(up=1,right={x})\$s(.75)\$cursor(left={x})")

def askNWrite(
    question: str,
    validate=None,
    success=None,
    reject=reject,
    rejectDelay=0.5
):
    # Ambil input dengan validasi + clear log jika salah
    
    while True:
        write((question,))
        response = input("")

        if not callable(validate):
            return response

        if validate(response):
            if callable(success):
                try:
                    return success(response)
                except ValueError:
                    continue
            return response

        # Invalid input
        if callable(reject):
            # Tulis pesan error & hitung barisnya
            reject_msg = reject(response, len(question) + len(response) + 1)
            if reject_msg is None:
                reject_msg = "Input tidak valid!"
                reject_msg = ""
            if not reject_msg.endswith("\n"):
                reject_msg += "\n"

            time.sleep(rejectDelay)

def makeValidate (filters: list[str] = []) -> callable:
    return lambda x: x in filters

if __name__ == "__main__":

    write((
        r'halo semua\n',
        r'duar\n',
        (
            r'TUPLE\n',
            r'TUTTTTPLE\n',
        ),
        'end ',
        lambda globalP: write(str(globalP['x']))
    ))