import sys

import orjson
from followthemoney.types import CountryType

if __name__ == "__main__":
    countries = CountryType()
    data = {}
    for locale, names in countries._names.items():
        data[str(locale)] = names

    sys.stdout.write(orjson.dumps(data).decode())
