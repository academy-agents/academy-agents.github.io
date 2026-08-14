#!/usr/bin/env python3
"""Compile every Python sample embedded in the site.

An earlier version of this site copied snippets verbatim from the upstream docs
without running them, and shipped three that did not work: a module-level
`async with` (SyntaxError), `exchange=` where the parameter is `factory=`, and
`ProcessPoolExecutor(max_processes=...)` where the argument is `max_workers`.

Copying from an authoritative source is not the same as checking it. Run this
before publishing:

    python3 bin/check-code-samples.py

Note this only catches syntax errors and a few known-bad API signatures — it
does not execute the samples. Anything that survives here can still be wrong,
so run new samples for real against a live install.
"""

from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Files that embed Python via {% highlight python %} ... {% endhighlight %}
SOURCES = ["index.html", "start.md", "examples.md"]

BLOCK = re.compile(r"\{%\s*highlight python\s*%\}\n(.*?)\n\{%\s*endhighlight\s*%\}", re.S)

# Signatures known to be wrong upstream. Substring -> what it should be.
KNOWN_BAD = {
    "max_processes=": "ProcessPoolExecutor takes max_workers=, not max_processes=",
    "exchange=Redis": "Manager.from_exchange_factory takes factory=, not exchange=",
    "exchange=Local": "Manager.from_exchange_factory takes factory=, not exchange=",
    "async with Manager.from_exchange_factory": "needs `async with await ...`",
}


def main() -> int:
    failures = 0
    checked = 0

    for name in SOURCES:
        path = ROOT / name
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")

        for index, block in enumerate(BLOCK.findall(text), start=1):
            checked += 1
            label = f"{name} block {index}"

            try:
                compile(block, label, "exec")
            except SyntaxError as exc:
                print(f"FAIL {label}: {exc.msg} (line {exc.lineno})")
                failures += 1
                continue

            for needle, message in KNOWN_BAD.items():
                if needle in block:
                    print(f"FAIL {label}: {message}")
                    failures += 1

    if failures:
        print(f"\n{failures} problem(s) across {checked} block(s).")
        return 1

    print(f"All {checked} Python block(s) OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
