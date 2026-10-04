#!/usr/bin/env python3
"""Post-build SEO audit over the prerendered HTML in .next/server/app."""
import glob
import html
import os
import re
from collections import Counter

titles = []
over = []
dups = Counter()
canonical_home = []

for f in sorted(glob.glob(".next/server/app/*.html")):
    src = open(f, encoding="utf8").read()
    name = os.path.basename(f)[: -len(".html")]

    m = re.search(r"<title>(.*?)</title>", src)
    if m:
        t = html.unescape(m.group(1))
        titles.append(t)
        dups[t] += 1
        if len(t) > 60:
            over.append((len(t), name, t))

    # Any page other than the homepage canonicalising to "/" is a bug.
    for c in re.findall(r'<link rel="canonical" href="([^"]+)"', src):
        if c.rstrip("/") == "https://inkofmemories.com" and name != "index":
            canonical_home.append(name)

print("pages prerendered      :", len(glob.glob(".next/server/app/*.html")))
print("pages with a <title>   :", len(titles))
print("titles over 60 chars   :", len(over))
for l, n, t in over[:5]:
    print("   ", l, n, "::", t)
print("duplicate title groups :", sum(1 for v in dups.values() if v > 1))
print("brand-doubled titles   :", sum(1 for t in titles if t.count("Ink of Memories") > 1))
print("lowercase-start titles :", sum(1 for t in titles if t[:1].islower()))
print("wrong homepage canonical:", len(canonical_home), canonical_home[:5])
